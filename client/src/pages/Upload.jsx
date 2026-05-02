import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { uploadPrescription } from '../services/api';
import { Upload as UploadIcon, FileImage, X, Search } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const { data } = await uploadPrescription(formData);
      // Pass data to results page via state
      navigate('/results', { state: { result: data } });
    } catch (err) {
      alert('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Upload Prescription</h1>
        <p style={{ color: 'var(--text-muted)' }}>Scan your prescription for AI analysis</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div 
          className="glass card"
          style={{ width: '100%', maxWidth: '600px', border: '2px dashed var(--glass-border)' }}
        >
          {!preview ? (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', cursor: 'pointer' }}>
              <UploadIcon size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem' }} />
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Click to select or drag & drop</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>PNG, JPG or JPEG (Max 5MB)</p>
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </label>
          ) : (
            <div style={{ position: 'relative' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'contain' }} 
              />
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          )}

          {preview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2rem' }}
            >
              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? (
                  <>Processing with AI...</>
                ) : (
                  <>
                    <Search size={20} /> Start Analysis
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
