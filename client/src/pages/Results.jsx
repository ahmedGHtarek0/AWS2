import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { checkInteractions, savePrescription } from '../services/api';
import { AlertTriangle, CheckCircle, FileText, Pill, Save, Shield } from 'lucide-react';

import Loader from '../components/Loader';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, isHistory } = location.state || {};
  
  const [interactions, setInteractions] = useState([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate('/upload');
      return;
    }

    const fetchInteractions = async () => {
      if (result.drugs.length > 1) {
        setChecking(true);
        try {
          const { data } = await checkInteractions(result.drugs);
          setInteractions(data.interactions);
        } catch (err) {
          console.error(err);
        } finally {
          setChecking(false);
        }
      }
    };

    fetchInteractions();
  }, [result, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePrescription({
        drugs: result.drugs,
        rawText: result.text
      });
      alert('Prescription saved to history!');
      navigate('/history');
    } catch (err) {
      alert('Error saving prescription.');
    } finally {
      setSaving(false);
    }
  };

  if (!result) return null;

  return (
    <div className="fade-in">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Analysis Results</h1>
        <p style={{ color: 'var(--text-muted)' }}>Drugs identified from your prescription</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Drugs List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Pill color="var(--secondary)" />
            <h2 style={{ fontSize: '1.5rem' }}>Extracted Drugs</h2>
          </div>
          
          {result.drugs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.drugs.map((drug, i) => (
                <div key={i} className="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="var(--success)" />
                  <span style={{ fontWeight: 600 }}>{drug}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No clear drug names identified.</p>
          )}
        </motion.div>

        {/* Interactions */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <Shield color={interactions.length > 0 ? 'var(--error)' : 'var(--success)'} />
            <h2 style={{ fontSize: '1.5rem' }}>Safety Check</h2>
          </div>

          {checking ? (
            <Loader size={60} text="Analyzing interactions..." />
          ) : interactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {interactions.map((item, i) => (
                <div key={i} style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <AlertTriangle size={18} />
                    {item.drugA.toUpperCase()} + {item.drugB.toUpperCase()}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.severity}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <p>No major interactions found among extracted drugs.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Raw Text Toggle / Save */}
      {!isHistory && (
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={handleSave} className="btn-primary" style={{ padding: '12px 40px' }} disabled={saving}>
            <Save size={20} /> {saving ? 'Saving...' : 'Save to History'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Results;
