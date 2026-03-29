import api from './api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'officer' | 'management' | string;
}

class AuthService {
    private static STORAGE_USER = 'edu_user';
    private static STORAGE_TOKEN = 'edu_token';

    static getUser(): User | null {
        const data = localStorage.getItem(this.STORAGE_USER);
        return data ? JSON.parse(data) : null;
    }

    static getToken(): string | null {
        return localStorage.getItem(this.STORAGE_TOKEN);
    }

    static isLoggedIn(): boolean {
        return !!this.getToken();
    }

    static async login(email: string, password: string): Promise<any> {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem(this.STORAGE_TOKEN, token);
        localStorage.setItem(this.STORAGE_USER, JSON.stringify(user));
        return response.data;
    }

    static async register(data: any): Promise<any> {
        const response = await api.post('/auth/register', data);
        return response.data;
    }

    static logout() {
        localStorage.removeItem(this.STORAGE_TOKEN);
        localStorage.removeItem(this.STORAGE_USER);
        window.location.href = '/login';
    }

    static hasRole(...roles: string[]): boolean {
        const user = this.getUser();
        return user ? roles.includes(user.role) : false;
    }
}

export default AuthService;
