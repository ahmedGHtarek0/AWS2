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

        console.log('Processing upload for user:', req.username);
        const imageBuffer = req.file.buffer;
        const imageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
        const cacheKey = `ocr:${imageHash}`;

        // Check cache
        const cachedOcr = await client.get(cacheKey);
        if (cachedOcr) {
            console.log('Using cached OCR result');
            const drugs = extractDrugs(cachedOcr);
            return res.json({ text: cachedOcr, drugs });
        }

        // Run OCR
        console.log('Starting Tesseract OCR...');
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
            logger: m => console.log('Tesseract:', m.status, Math.round(m.progress * 100) + '%')
        });
        console.log('OCR completed successfully');
        
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
        const { drugs } = req.body; 

        if (!drugs || drugs.length < 2) {
            return res.json({ interactions: [] });
        }

        const interactions = [];
        for (let i = 0; i < drugs.length; i++) {
            for (let j = i + 1; j < drugs.length; j++) {
                const drugA = drugs[i].toLowerCase().trim();
                const drugB = drugs[j].toLowerCase().trim();
                
                const key1 = `${drugA}:${drugB}`;
                const key2 = `${drugB}:${drugA}`;
                
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
        const username = req.username;

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
        console.log('Fetching history for user:', username);
        const prescriptionIds = await client.lRange(`user:${username}:prescriptions`, 0, -1);
        console.log('Found prescription IDs:', prescriptionIds.length);

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

const extractDrugs = (text) => {
    const commonDrugs = [
        'Aspirin', 'Warfarin', 'Metformin', 'Ibuprofen', 'Simvastatin', 
        'Clarithromycin', 'Amoxicillin', 'Lisinopril', 'Levothyroxine', 
        'Paracetamol', 'Panadol', 'Augmentin', 'Concor', 'Glucophage',
        'Zyrtec', 'Cataflam', 'Voltaren', 'Brufen', 'Flagyl'
    ];
    const found = [];
    
    console.log('Extracting drugs from text length:', text.length);
    commonDrugs.forEach(drug => {
        if (text.toLowerCase().includes(drug.toLowerCase())) {
            found.push(drug);
        }
    });
    console.log('Drugs found:', found);

    return [...new Set(found)];
};
