export const environment = {
    ApiHotel: {
        BaseUrl: "http://localhost:57223/",
        BaseUrlSuffix: "",

        AllHotels: "hotels/",
        GetHotelsByName: "hotels/?searchString={searchString}",
        HotelById: "hotels/{hotelId}/",
        AllRooms: "rooms/",
        RoomById: "rooms/{roomId}/",
        AllBookings: "bookings/",
        BookingById: "bookings/{bookingId}/"
    },
    ApiAdmin: {
        BaseUrl: "http://localhost:57223/",
        BaseUrlSuffix: "",

        AllAdmins: "admins/",
    }
};
