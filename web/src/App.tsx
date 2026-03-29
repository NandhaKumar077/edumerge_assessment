import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MasterSetup from './pages/MasterSetup';
import ApplicantForm from './pages/ApplicantForm';
import AdmissionList from './pages/AdmissionList';
import AccessDenied from './pages/AccessDenied';
import './index.css';

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="app-container">
      {isLoggedIn && <Sidebar />}
      <main className={isLoggedIn ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          <Route path="/dashboard" element={<PrivateRoute roles={['management']}><Dashboard /></PrivateRoute>} />
          <Route path="/master-setup" element={<PrivateRoute roles={['admin']}><MasterSetup /></PrivateRoute>} />
          <Route path="/applicants" element={<PrivateRoute roles={['officer']}><ApplicantForm /></PrivateRoute>} />
          <Route path="/admissions" element={<PrivateRoute roles={['officer']}><AdmissionList /></PrivateRoute>} />

          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
