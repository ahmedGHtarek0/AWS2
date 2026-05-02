import Tesseract from 'tesseract.js';
import { client } from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Simple mock interaction database
const interactionDb = {
    'aspirin:warfarin': 'High Risk: Increased risk of bleeding.',
    'ibuprofen:aspirin': 'Moderate Risk: May decrease the effectiveness of aspirin.',
    'metformin:contrast': 'High Risk: Risk of lactic acidosis.',
    'simvastatin:clarithromycin': 'High Risk: Increased risk of muscle breakdown.',
};

export const uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imageBuffer = req.file.buffer;
        const imageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
        const cacheKey = `ocr:${imageHash}`;

        // Check cache
        const cachedOcr = await client.get(cacheKey);
        if (cachedOcr) {
            const drugs = extractDrugs(cachedOcr);
            return res.json({ text: cachedOcr, drugs });
        }

        // Run OCR
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        
        // Cache result
        await client.set(cacheKey, text, { EX: 604800 }); // 1 week

        const drugs = extractDrugs(text);

        res.json({ text, drugs });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ message: 'Error processing image' });
    }
};

export const checkInteraction = async (req, res) => {
    try {
        const { drugs } = req.body; // Array of drug names

        if (!drugs || drugs.length < 2) {
            return res.json({ interactions: [] });
        }

        const interactions = [];
        for (let i = 0; i < drugs.length; i++) {
            for (let j = i + 1; j < drugs.length; j++) {
                const drugA = drugs[i].toLowerCase().trim();
                const drugB = drugs[j].toLowerCase().trim();
                
                // Check both directions
                const key1 = `${drugA}:${drugB}`;
                const key2 = `${drugB}:${drugA}`;
                
                // Check cache first
                let interaction = await client.get(`interaction:${key1}`);
                if (!interaction) {
                    interaction = interactionDb[key1] || interactionDb[key2] || null;
                    if (interaction) {
                        await client.set(`interaction:${key1}`, interaction, { EX: 604800 });
                    }
                }

                if (interaction) {
                    interactions.push({ drugA, drugB, severity: interaction });
                }
            }
        }

        res.json({ interactions });
    } catch (error) {
        console.error('Interaction Error:', error);
        res.status(500).json({ message: 'Error checking interactions' });
    }
};

export const savePrescription = async (req, res) => {
    try {
        const { drugs, rawText } = req.body;
        const username = req.username; // From auth middleware

        const id = uuidv4();
        const prescriptionKey = `prescription:${id}`;

        await client.hSet(prescriptionKey, {
            id,
            username,
            drugs: JSON.stringify(drugs),
            rawText,
            createdAt: new Date().toISOString()
        });

        // Add to user's history list
        await client.lPush(`user:${username}:prescriptions`, id);

        res.json({ message: 'Prescription saved', id });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ message: 'Error saving prescription' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const username = req.username;
        const prescriptionIds = await client.lRange(`user:${username}:prescriptions`, 0, -1);

        const history = [];
        for (const id of prescriptionIds) {
            const data = await client.hGetAll(`prescription:${id}`);
            if (data && Object.keys(data).length > 0) {
                data.drugs = JSON.parse(data.drugs);
                history.push(data);
            }
        }

        res.json(history);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: 'Error fetching history' });
    }
};

// Helper: Simple Regex to find common drug names (or words that look like drugs)
const extractDrugs = (text) => {
    // This is a simplified regex for MVP. In reality, you'd match against a database.
    // For now, let's look for capitalized words or common patterns.
    const commonDrugs = ['Aspirin', 'Warfarin', 'Metformin', 'Ibuprofen', 'Simvastatin', 'Clarithromycin', 'Amoxicillin', 'Lisinopril', 'Levothyroxine'];
    const found = [];
    
    commonDrugs.forEach(drug => {
        if (text.toLowerCase().includes(drug.toLowerCase())) {
            found.push(drug);
        }
    });

    return [...new Set(found)];
};
