
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const role = user?.role || '';

    const roleLabelMap: Record<string, string> = {
        admin: 'Administrator',
        officer: 'Admission Officer',
        management: 'Management'
    };

    const roleLabel = roleLabelMap[role] || role;

    return (
        <div className="sidebar">
            <div className="brand">
                <div className="logo-icon">E</div>
                <h2>Edu<span>Merge</span></h2>
            </div>

            <nav>
                {role === 'management' && (
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="icon" style={{ display: 'flex' }}><LayoutDashboard size={18} /></span> Dashboard
                    </NavLink>
                )}

                {/* SETUP (Admin Only) */}
                {role === 'admin' && (
                    <>
                        <div className="nav-section">Setup</div>
                        <NavLink to="/master-setup" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="icon" style={{ display: 'flex' }}><Settings size={18} /></span> Master Setup
                        </NavLink>
                    </>
                )}

                {/* ADMISSION (Officer Only) */}
                {role === 'officer' && (
                    <>
                        <div className="nav-section">Admission</div>
                        <NavLink to="/applicants" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="icon" style={{ display: 'flex' }}><FileText size={18} /></span> Applicants
                        </NavLink>
                        <NavLink to="/admissions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <span className="icon" style={{ display: 'flex' }}><GraduationCap size={18} /></span> Admissions
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="user-profile">
                <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
                <div className="info">
                    <p className="name">{user?.name}</p>
                    <p className="role">{roleLabel}</p>
                </div>
                <button className="logout-btn" onClick={() => logout()} title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
