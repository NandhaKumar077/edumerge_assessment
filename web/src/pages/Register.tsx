import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Zap } from 'lucide-react';
import AuthService from '../services/authService';
import { toast } from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';
import './Login.css'; // Reusing Login.css as it contains common register styles

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('officer');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const roles = [
        { id: 'admin', name: 'Admin — Setup masters & quotas' },
        { id: 'officer', name: 'Admission Officer — Manage applicants' },
        { id: 'management', name: 'Management — View only' }
    ];

    const handleRegister = async () => {
        if (!name || !email || !password || !role) {
            toast.error('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await AuthService.register({ name, email, password, role });
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="brand">
                    <div className="brand-icon">E</div>
                    <h1>EduMerge</h1>
                </div>
                <h2>Join the specialized network</h2>
                <p>Create an account to start managing admissions and student data with precision.</p>

                <div className="role-cards">
                    <div className="role-card">
                        <span className="role-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={28} /></span>
                        <div>
                            <strong>Unified Platform</strong>
                            <p>One system for all admission stakeholders</p>
                        </div>
                    </div>
                    <div className="role-card">
                        <span className="role-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={28} /></span>
                        <div>
                            <strong>Real-time Sync</strong>
                            <p>Instant quota and seat updates</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-card glass-card scrollable" style={{ maxHeight: '96vh', overflowY: 'auto' }}>
                    <h2>Create account</h2>
                    <p className="subtitle">Join the EduMerge administration team</p>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@college.edu" />
                    </div>

                    <div className="form-group">
                        <label>Assigned Role</label>
                        <CustomSelect
                            options={roles}
                            valueKey="id"
                            placeholder="Select your role"
                            selectedValue={role}
                            selectionChange={setRole}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                        </div>
                    </div>

                    <button className="btn btn-primary login-btn" onClick={handleRegister} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="auth-footer" style={{ marginTop: '24px' }}>
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
