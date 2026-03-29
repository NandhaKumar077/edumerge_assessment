import api from './api';

class ApplicantService {
    static async getAllApplicants(filters?: any): Promise<any[]> {
        const response = await api.get('/applicants', { params: filters });
        return response.data;
    }

    static async createApplicant(data: any): Promise<any> {
        const response = await api.post('/applicants', data);
        return response.data;
    }

    static async updateDocStatus(id: string, status: string): Promise<any> {
        const response = await api.patch(`/applicants/${id}/docs`, { status });
        return response.data;
    }

    static async updateFeeStatus(id: string, status: string): Promise<any> {
        const response = await api.patch(`/applicants/${id}/fee`, { status });
        return response.data;
    }
}

export default ApplicantService;
