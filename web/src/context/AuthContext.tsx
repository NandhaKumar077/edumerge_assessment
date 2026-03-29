import React, { createContext, useContext, useState } from 'react';
import type { User } from '../services/authService';
import AuthService from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(AuthService.getUser());
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(AuthService.isLoggedIn());

    const login = async (email: string, password: string) => {
        const data = await AuthService.login(email, password);
        setUser(data.user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
