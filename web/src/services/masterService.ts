import api from './api';

class MasterService {
    static async getInstitutions(): Promise<any[]> {
        const response = await api.get('/masters/institution');
        return response.data;
    }
    static async createInstitution(data: any): Promise<any> {
        const response = await api.post('/masters/institution', data);
        return response.data;
    }

    static async getCampuses(instId?: string): Promise<any[]> {
        const url = instId ? `/masters/campus?institution=${instId}` : '/masters/campus';
        const response = await api.get(url);
        return response.data;
    }
    static async createCampus(data: any): Promise<any> {
        const response = await api.post('/masters/campus', data);
        return response.data;
    }

    static async getDepartments(campusId?: string): Promise<any[]> {
        const url = campusId ? `/masters/department?campus=${campusId}` : '/masters/department';
        const response = await api.get(url);
        return response.data;
    }
    static async createDepartment(data: any): Promise<any> {
        const response = await api.post('/masters/department', data);
        return response.data;
    }

    static async getPrograms(deptId?: string): Promise<any[]> {
        const url = deptId ? `/masters/program?department=${deptId}` : '/masters/program';
        const response = await api.get(url);
        return response.data;
    }
    static async createProgram(data: any): Promise<any> {
        const response = await api.post('/masters/program', data);
        return response.data;
    }
}

export default MasterService;
