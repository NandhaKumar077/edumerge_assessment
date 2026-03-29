import api from './api';

class AdmissionService {
    static async allocateSeat(data: { applicantId: string; programId: string; quota: string }): Promise<any> {
        const response = await api.post('/admission/allocate', data);
        return response.data;
    }

    static async confirmAdmission(applicantId: string): Promise<any> {
        const response = await api.post('/admission/confirm', { applicantId });
        return response.data;
    }

    static async getConfirmedAdmissions(): Promise<any[]> {
        const response = await api.get('/admission/confirmed');
        return response.data;
    }
}

export default AdmissionService;
