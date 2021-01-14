import { environment } from './environment';
import HttpService from './httpService';

export default class HotelService {
    constructor() {
        this.httpService = new HttpService(environment.ApiHotel.BaseUrl) 
    }

    async getAllHotels() {
        return await this.httpService.get(environment.ApiHotel.GetAllHotels);
    }

    async getHotelsByName(searchString) {
        return await this.httpService.get(environment.ApiHotel.GetHotelsByName.replace('{searchString}', searchString));
    }

    async getHotelById(hotelId) {
        return await this.httpService.get(environment.ApiHotel.GetHotelById.replace('{hotelId}', hotelId));
    }

    async getRoomById(roomId) {
        return await this.httpService.get(environment.ApiHotel.GetRoomById.replace('{roomId}', roomId));
    }
}
