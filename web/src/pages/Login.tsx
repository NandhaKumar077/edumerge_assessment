import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ClipboardList, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isLoggedIn, user } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            routeByRole(user?.role);
        }
    }, [isLoggedIn, user]);

    const routeByRole = (role?: string) => {
        if (role === 'admin') navigate('/master-setup');
        else if (role === 'officer') navigate('/admissions');
        else navigate('/dashboard');
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            // Navigation handled by useEffect
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed');
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="brand">
                    <div className="brand-icon">E</div>
                    <h1>EduMerge</h1>
                </div>
                <h2>Admission Management System</h2>
                <p>Manage quotas, applicants, and admissions from a single platform</p>

                <div className="role-cards">
                    <div className="role-card">
                        <span className="role-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={28} /></span>
                        <div>
                            <strong>Admin</strong>
                            <p>Master setup & quotas</p>
                        </div>
                    </div>
                    <div className="role-card">
                        <span className="role-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={28} /></span>
                        <div>
                            <strong>Admission Officer</strong>
                            <p>Applicants & seat allocation</p>
                        </div>
                    </div>
                    <div className="role-card">
                        <span className="role-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart3 size={28} /></span>
                        <div>
                            <strong>Management</strong>
                            <p>View dashboards</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-right">
                <div className="login-card glass-card">
                    <h2>Welcome back</h2>
                    <p className="subtitle">Sign in to continue to EduMerge</p>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@college.edu"
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button className="btn btn-primary login-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
