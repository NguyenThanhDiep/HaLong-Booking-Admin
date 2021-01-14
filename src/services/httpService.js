import axios from 'axios';

export default class HttpService {

    constructor(baseurl) {
        this.baseUrl = baseurl;
        this.config = {
            timeout: 10000,
            responseType: 'json',
            baseURL: this.baseUrl,
            auth: {
                username: 'DiepNguyen',
                password: 'realmadrid1995'
            }
        };
        this.handleError = (error) => {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else {
                console.log(error.message);
            }
        };
    }

    async get(route) {
        let response = {};
        await axios.get(this.baseUrl + route, this.config)
            .then(r => response = r)
            .catch(this.handleError);
        return response.data;
    }

    async post(route, item) {
        let response = {};
        await axios.post(this.baseUrl + route, item, this.config)
            .then(r => response = r)
            .catch(this.handleError);
        return response.data;
    }

    async put(route, item) {
        let response = {};
        await axios.put(this.baseUrl + route, item, this.config)
            .then(r => response = r)
            .catch(this.handleError);
        return response.data;
    }

    async delete(route) {
        let response = {};
        await axios.delete(this.baseUrl + route, this.config)
            .then(r => response = r)
            .catch(this.handleError);
        return response.data;
    }
}
