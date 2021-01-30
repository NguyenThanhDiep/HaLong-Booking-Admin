import { environment } from './environment';
import HttpService from './httpService';

export default class HotelService {
    constructor() {
        this.httpService = new HttpService(environment.ApiHotel.BaseUrl) 
    }

    async getAllHotels() {
        return await this.httpService.get(environment.ApiHotel.AllHotels);
    }

    async getHotelsByName(searchString) {
        return await this.httpService.get(environment.ApiHotel.GetHotelsByName.replace('{searchString}', searchString));
    }

    async getHotelById(hotelId) {
        return await this.httpService.get(environment.ApiHotel.HotelById.replace('{hotelId}', hotelId));
    }

    async createHotel(hotelModel) {
        return await this.httpService.post(environment.ApiHotel.AllHotels, hotelModel);
    }

    async updateHotel(hotelModel) {
        return await this.httpService.put(environment.ApiHotel.HotelById.replace('{hotelId}', hotelModel.id), hotelModel);
    }

    async deleteHotel(hotelId) {
        return await this.httpService.delete(environment.ApiHotel.HotelById.replace('{hotelId}', hotelId));
    }

    async getRoomById(roomId) {
        return await this.httpService.get(environment.ApiHotel.RoomById.replace('{roomId}', roomId));
    }

    async deleteRoom(roomId) {
        return await this.httpService.delete(environment.ApiHotel.RoomById.replace('{roomId}', roomId));
    }

    async createRoom(roomModel) {
        return await this.httpService.post(environment.ApiHotel.AllRooms, roomModel);
    }

    async updateRoom(roomModel) {
        return await this.httpService.put(environment.ApiHotel.RoomById.replace('{roomId}', roomModel.id), roomModel);
    }

    async getBookingsByStatus(status) {
        return await this.httpService.get(environment.ApiHotel.AllBookings + '?status=' + status);
    }

    async getBookingById(bookingId) {
        return await this.httpService.get(environment.ApiHotel.BookingById.replace('{bookingId}', bookingId));
    }

    async updateBooking(bookingModel) {
        return await this.httpService.put(environment.ApiHotel.BookingById.replace('{bookingId}', bookingModel.id), bookingModel);
    }

    async deleteBooking(bookingId) {
        return await this.httpService.delete(environment.ApiHotel.BookingById.replace('{bookingId}', bookingId));
    }

    async changeStatusBooking(bookingModel, adminId) {
        return await this.httpService.put(environment.ApiHotel.BookingById.replace('{bookingId}', bookingModel.id) + '?adminId=' + adminId, bookingModel);
    }

    async getTimelinesByBookingId(bookingId) {
        return await this.httpService.get(environment.ApiHotel.AllTimelines + '?bookingId=' + bookingId);
    }
}
