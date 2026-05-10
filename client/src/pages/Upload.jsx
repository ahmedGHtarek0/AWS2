import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { uploadPrescription } from '../services/api';
import { Upload as UploadIcon, FileImage, X, Search, Sparkles } from 'lucide-react';
import Loader from '../components/Loader';

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
      navigate('/results', { state: { result: data } });
    } catch (err) {
      alert('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Upload Prescription
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-muted)' }}
        >
          Scan your prescription for AI analysis
        </motion.p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div 
          layout
          className="glass card"
          style={{ width: '100%', maxWidth: '600px', border: '2px dashed var(--glass-border)', overflow: 'hidden' }}
          whileHover={{ borderColor: 'var(--secondary)', boxShadow: '0 0 30px rgba(0, 210, 255, 0.2)' }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: '4rem 0' }}
              >
                <Loader text="AI is reading your prescription..." />
              </motion.div>
            ) : !preview ? (
              <motion.label 
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', cursor: 'pointer' }}
              >
                <motion.div 
                  className="float"
                  style={{ marginBottom: '1.5rem' }}
                >
                  <UploadIcon size={64} color="var(--secondary)" />
                </motion.div>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Click to select or drag & drop</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>PNG, JPG or JPEG (Max 5MB)</p>
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </motion.label>
            ) : (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ position: 'relative' }}
              >
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'contain', display: 'block' }} 
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setFile(null); setPreview(null); }}
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {preview && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2rem' }}
            >
              <button 
                className="btn-primary pulse" 
                style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
                onClick={handleUpload}
              >
                <Sparkles size={20} /> Analyze Now
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
