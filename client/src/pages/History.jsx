import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import { Clock, Calendar, Pill, ChevronRight } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate('/results', { state: { result: { drugs: item.drugs, text: item.rawText }, isHistory: true } });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading history...</div>;

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Medical History</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your saved prescriptions and analyses</p>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }} className="glass card">
          <Clock size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No prescriptions found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Upload your first prescription to start building your history.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass"
              style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleItemClick(item)}
            >
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Pill color="var(--secondary)" />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {item.drugs.map((drug, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {drug}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <ChevronRight color="var(--text-muted)" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
