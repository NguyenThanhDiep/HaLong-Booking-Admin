<template>
  <div class="bookings">
    <CCard>
      <CCardHeader>
        <div
          class="d-flex"
          aria-controls="filter-area"
          @click="isShowFilterArea = !isShowFilterArea"
        >
          <h5 class="flex-grow-1">Filter Area</h5>
          <div>
            <i class="fas fa-caret-down"></i>
          </div>
        </div>
      </CCardHeader>
      <b-collapse id="filter-area" v-model="isShowFilterArea">
        <CCardBody>
          <div class="d-flex">
            <div class="mr-5">Filter</div>
            <b-form-input v-model="stringFilter" class="w-50"></b-form-input>
            <b-button class="ml-3" @click="stringFilter = ''">Clear</b-button>
          </div>
          <div class="d-flex my-3">
            <div class="mr-5">Filter On</div>
            <div>
              <b-form-checkbox-group v-model="filterOn">
                <b-form-checkbox value="nameCustomer"
                  >Name Customer</b-form-checkbox
                >
                <b-form-checkbox value="phoneNumber"
                  >Phone Number</b-form-checkbox
                >
                <b-form-checkbox value="email">Email</b-form-checkbox>
                <b-form-checkbox value="hotelName">Hotel</b-form-checkbox>
                <b-form-checkbox value="roomName">Room</b-form-checkbox>
              </b-form-checkbox-group>
              <div class="font-weight-light font-italic">
                Leave all unchecked to filter on all data
              </div>
            </div>
          </div>
          <div class="d-flex">
            <div class="mr-5">Booking Date</div>
            <div class="d-flex mr-3">
              <div class="mr-3">From</div>
              <b-form-datepicker v-model="bookingDateFrom"></b-form-datepicker>
            </div>
            <div class="d-flex">
              <div class="mr-3">To</div>
              <b-form-datepicker v-model="bookingDateTo"></b-form-datepicker>
            </div>
          </div>
        </CCardBody>
      </b-collapse>
    </CCard>
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
          <div>
            <b-dropdown text="Options" variant="outline-primary">
              <b-dropdown-item v-show="tabActive === 'New'"
                >Processing</b-dropdown-item
              >
              <b-dropdown-item v-show="tabActive === 'Processing'"
                >Done</b-dropdown-item
              >
              <b-dropdown-item>Cancel</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <b-table
          :items="bookingsData[tabActive] || []"
          :fields="bookingFields"
          @row-dblclicked="onGoToDetailBooking"
        >
          <template #cell(isSelected)="data">
            <b-form-checkbox v-model="data.value"></b-form-checkbox>
          </template>
        </b-table>
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

export default {
  name: "Bookings",
  async mounted() {
    this.$root["loading"] = true;
    await this.getBookingsByStatus(this.tabActive);
    this.$root["loading"] = false;
  },
  data() {
    return {
      hotelService: new HotelService(),
      isShowFilterArea: false,
      tabs: ["New", "Processing", "Done", "Cancel"],
      tabActive: "New",
      bookingsData: {
        New: null,
        Processing: null,
        Done: null,
        Cancel: null,
      },
      bookingFields: [
        { key: "isSelected", label: "" },
        { key: "nameCustomer", label: "Name Customer", sortable: true },
        { key: "phoneNumber", label: "Phone Number", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "hotelName", label: "Booked Hotel", sortable: true },
        { key: "roomName", label: "Booked Room", sortable: true },
        { key: "bookingDate", label: "Booking Date", sortable: true },
      ],
      stringFilter: "",
      filterOn: [],
      bookingDateFrom: null,
      bookingDateTo: null,
    };
  },
  methods: {
    onChangeTab(tab) {
      this.tabActive = tab;
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
      if (this.bookingsData[status] === null) {
        const res = await this.hotelService.getBookingsByStatus(status);
        this.bookingsData[status] = this.mapDataFromAPI(res);
      }
    },
    onGoToDetailBooking(booking) {
      this.$router.push({ name: "Booking", params: { id: booking.id } });
    },
  },
};
</script>