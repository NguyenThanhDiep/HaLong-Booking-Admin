<template>
  <div class="bookings">
    <h2 class="text-center mb-3 font-weight-bold">List Bookings</h2>
    <CCard>
      <CCardHeader>
        <div class="d-flex">
          <div class="d-flex menu-tabs flex-grow-1">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              :class="['px-3 py-1 tab', tab === tabActive ? 'active' : '']"
              @click="onChangeTab(tab)"
            >
              {{ tab }}
            </button>
          </div>
          <!-- <div>
            <b-dropdown text="Options" variant="outline-primary">
              <b-dropdown-item v-show="tabActive === 'New'"
                >Processing</b-dropdown-item
              >
              <b-dropdown-item v-show="tabActive === 'Processing'"
                >Done</b-dropdown-item
              >
              <b-dropdown-item>Cancel</b-dropdown-item>
            </b-dropdown>
          </div> -->
        </div>
      </CCardHeader>
      <CCardBody>
        <Table
          :fields="bookingFields"
          :items="bookingsData[tabActive].items || []"
          :loading="loading"
          :headerObject="bookingsData[tabActive].headerObject || originHeaderObject"
          @rowDbClick="onDbClickBooking"
        ></Table>
      </CCardBody>
    </CCard>
  </div>
</template>

<style lang="scss" scoped>
.bookings {
  .card-header {
    cursor: pointer;
  }
  .menu-tabs {
    .tab {
      &:focus {
        outline: 0;
      }
      border: none;
      border-bottom: 5px solid rgba(0, 0, 0, 0);
      background: none;
      &:not(:disabled) {
        color: grey;
      }
      &.active {
        background-color: transparent;
        border-bottom: 5px solid #007bff;
        color: #007bff;
      }
      &.disabled {
        color: #808080;
      }
    }
  }
}
</style>

<script>
import HotelService from "../../services/hotelService";
import Table from "../shared/Table";

export default {
  name: "Bookings",
  components: { Table },
  async mounted() {
    this.loading = true;
    await this.getBookingsByStatus(this.tabActive);
    this.loading = false;
  },
  data() {
    return {
      hotelService: new HotelService(),
      tabs: ["New", "Processing", "Done", "Cancel"],
      tabActive: "New",
      bookingsData: {
        New: { items: null, headerObject: this.originHeaderObject},
        Processing: { items: null, headerObject: this.originHeaderObject},
        Done: { items: null, headerObject: this.originHeaderObject},
        Cancel: { items: null, headerObject: this.originHeaderObject},
      },
      bookingFields: [
        { key: "nameCustomer", label: "Name Customer", sortable: true },
        { key: "phoneNumber", label: "Phone Number", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "hotelName", label: "Booked Hotel", sortable: true },
        { key: "roomName", label: "Booked Room", sortable: true },
        { key: "bookingDate", label: "Booking Date", sortable: true },
      ],
      loading: false,
      originHeaderObject: {
        sort: { label: "", key: "", sort: "" },
        filters: [],
        filteredCount: "",
        additionalFilters: [],
      },
    };
  },
  methods: {
    onChangeTab(tab) {
      this.tabActive = tab;
      this.originHeaderObject = {
        sort: { label: "", key: "", sort: "" },
        filters: [],
        filteredCount: "",
        additionalFilters: [],
      };
      this.getBookingsByStatus(tab);
    },
    mapDataFromAPI(data) {
      if (Array.isArray(data) && data.length > 0) {
        return data.map((booking) => {
          return {
            id: booking.id,
            nameCustomer: booking.nameCustomer,
            phoneNumber: booking.phoneNumber,
            email: booking.email,
            status: booking.status,
            bookingDate: booking.bookingDate,
            hotelId: booking.hotel.id,
            hotelName: booking.hotel.name,
            roomId: booking.room.id,
            roomName: booking.room.name,
            isSelected: false,
          };
        });
      }
    },
    async getBookingsByStatus(status) {
      this.loading = true;
      if (this.bookingsData[status].items === null) {
        const res = await this.hotelService.getBookingsByStatus(status);
        this.bookingsData[status].items = this.mapDataFromAPI(res);
        this.bookingsData[status].headerObject = this.originHeaderObject;
      }
      this.loading = false;
    },
    onDbClickBooking(booking) {
      this.$router.push({ name: "Booking", params: { id: booking.id } });
    },
  },
};
</script>