<template>
  <div class="booking">
    <CCard>
      <CCardHeader>
        <div class="d-flex">
          <h5
            class="flex-grow-1"
            aria-controls="time-line"
            @click="isShowTimeLine = !isShowTimeLine"
          >
            Time Line
          </h5>
          <button
            class="btn btn-outline-primary mr-1"
            v-if="status === 'New'"
            @click="onChangeStatus('Processing')"
          >
            Processing
          </button>
          <button
            class="btn btn-outline-success mr-1"
            v-if="status === 'Processing'"
            @click="onChangeStatus('Done')"
          >
            Done
          </button>
          <button
            class="btn btn-outline-danger"
            @click="onChangeStatus('Cancel')"
          >
            Cancel
          </button>
        </div>
      </CCardHeader>
      <b-collapse id="time-line" v-model="isShowTimeLine">
        <CCardBody>Time Line data</CCardBody>
      </b-collapse>
    </CCard>
    <CCard>
      <CCardHeader
        class="d-flex"
        aria-controls="detail-booking"
        @click="isShowDetailBooking = !isShowDetailBooking"
      >
        <h5 class="flex-grow-1">Detail</h5>
        <div>{{ status }}</div>
      </CCardHeader>
      <b-collapse id="detail-booking" v-model="isShowDetailBooking">
        <CCardBody>
          <div class="row">
            <div class="col-3">Name Customer</div>
            <div class="col-9">
              {{ bookingData ? bookingData.nameCustomer : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Phone Number</div>
            <div class="col-9">
              {{ bookingData ? bookingData.phoneNumber : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Email</div>
            <div class="col-9">{{ bookingData ? bookingData.email : "" }}</div>
          </div>
          <div class="row">
            <div class="col-3">Check In Date</div>
            <div class="col-9">
              {{ bookingData ? bookingData.checkInDate : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Check Out Date</div>
            <div class="col-9">
              {{ bookingData ? bookingData.checkOutDate : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Number Adult</div>
            <div class="col-9">
              {{ bookingData ? bookingData.numberAdult : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Number Children</div>
            <div class="col-9">
              {{ bookingData ? bookingData.numberChildren : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Number Baby</div>
            <div class="col-9">
              {{ bookingData ? bookingData.numberBaby : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Note</div>
            <div class="col-9">{{ bookingData ? bookingData.note : "" }}</div>
          </div>
          <div class="row">
            <div class="col-3">Booking Date</div>
            <div class="col-9">
              {{ bookingData ? bookingData.bookingDate : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Hotel</div>
            <div class="col-9">
              {{ bookingData ? bookingData.hotel.name : "" }}
            </div>
          </div>
          <div class="row">
            <div class="col-3">Room</div>
            <div class="col-9">
              {{ bookingData ? bookingData.room.name : "" }}
            </div>
          </div>
        </CCardBody>
      </b-collapse>
    </CCard>
  </div>
</template>

<style lang="scss" scoped>
.booking {
  .card-header {
    cursor: pointer;
  }
}
</style>

<script>
import HotelService from "../../services/hotelService";
import { StatusBooking } from "../../services/const";

export default {
  components: {},
  name: "Booking",
  created() {
    this.bookingId = this.$route.params.id;
  },
  async mounted() {
    this.$root["loading"] = true;
    this.bookingData = await this.hotelService.getBookingById(this.bookingId);
    this.$root["loading"] = false;
  },
  data() {
    return {
      hotelService: new HotelService(),
      isShowTimeLine: true,
      isShowDetailBooking: true,
      bookingId: 0,
      bookingData: null,
    };
  },
  computed: {
    status() {
      return this.bookingData ? this.bookingData.status : "Unknow";
    },
  },
  methods: {
    onChangeStatus(status) {
      switch (status) {
        case StatusBooking.Processing:
          break;
        case StatusBooking.Done:
          break;
        case StatusBooking.Cancel:
          break;
      }
    },
  },
};
</script>