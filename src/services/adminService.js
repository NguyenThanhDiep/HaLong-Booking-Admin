import { environment } from './environment';
import HttpService from './httpService';

export default class AdminService {
    constructor() {
        this.httpService = new HttpService(environment.ApiAdmin.BaseUrl) 
    }

    async login(userName, password) {
        return await this.httpService.get(environment.ApiAdmin.AllAdmins + '?userName=' + userName + '&password=' + password);
    }
}