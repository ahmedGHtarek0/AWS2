import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Search, Clock } from 'lucide-react';

const Landing = () => {
  return (
    <div className="fade-in">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4rem', marginBottom: '1.5rem' }}
        >
          Smart Prescription Reader
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 2.5rem' }}
        >
          Upload your prescription images, extract drug names instantly using AI, and check for potentially dangerous interactions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to="/signup" className="btn-primary" style={{ display: 'inline-flex', fontSize: '1.1rem', padding: '16px 32px' }}>
            Get Started for Free
          </Link>
        </motion.div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
        {[
          { icon: <Zap color="#00d2ff" />, title: "Instant OCR", desc: "Our AI extracts drug names from handwritten or printed prescriptions in seconds." },
          { icon: <Shield color="#22c55e" />, title: "Interaction Check", desc: "Automatically cross-references extracted drugs for safety and compatibility." },
          { icon: <Clock color="#f59e0b" />, title: "Smart History", desc: "Keep all your prescriptions in one secure, Redis-powered digital vault." },
          { icon: <Search color="#a855f7" />, title: "Deep Analysis", desc: "Understand your medication better with clear, extracted text and drug lists." }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            className="glass card"
            whileHover={{ y: -10, borderColor: 'var(--secondary)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Landing;
