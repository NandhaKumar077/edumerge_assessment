import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDenied: React.FC = () => {
    return (
        <div style={{
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass-card" style={{
                maxWidth: '480px',
                width: '100%',
                padding: '60px 40px',
                textAlign: 'center',
                borderRadius: '30px',
                animation: 'scaleIn 0.3s ease-out'
            }}>
                <div style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(99,102,241,0.3))', display: 'flex', justifyContent: 'center' }}>
                    <ShieldAlert size={64} strokeWidth={1.5} color="#6366f1" />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Access Denied</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '24px' }}>You do not have the required permissions to view this page.</p>
                <div style={{
                    background: 'rgba(0,0,0,0.03)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    marginBottom: '30px'
                }}>Please contact your administrator if you believe this is an error.</div>
                <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Back to Dashboard</Link>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to   { transform: scale(1);    opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default AccessDenied;
