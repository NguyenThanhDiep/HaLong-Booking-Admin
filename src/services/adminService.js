import { environment } from './environment';
import HttpService from './httpService';

export default class AdminService {
    constructor() {
        this.httpService = new HttpService(environment.ApiAdmin.BaseUrl) 
    }

    async login(userName, password) {
        return await this.httpService.get(environment.ApiAdmin.AllAdmins + '?userName=' + userName + '&password=' + password);
    }

    async getAdminById(adminId) {
        return await this.httpService.get(environment.ApiAdmin.AdminById.replace('{adminId}', adminId));
    }

    async updateAdmin(adminModel) {
        return await this.httpService.put(environment.ApiAdmin.AdminById.replace('{adminId}', adminModel.id), adminModel);
    }
}