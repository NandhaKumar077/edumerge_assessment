import api from './api';

class DashboardService {
    static async getStats(): Promise<any> {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
}

export default DashboardService;
