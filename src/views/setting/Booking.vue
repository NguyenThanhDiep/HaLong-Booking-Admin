<template>
  <div class="booking">
    <div class="title mb-3">
      <b-button variant="outline-primary" @click="back"
        ><i class="fas fa-angle-left"></i> Back</b-button
      >
    </div>
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
            v-if="status !== 'Cancel' && status !== 'Done'"
            @click="$bvModal.show('modal-cancel')"
          >
            Cancel
          </button>
          <!-- Modal to Cancel Order -->
          <b-modal
            id="modal-cancel"
            header-bg-variant="danger"
            header-text-variant="light"
          >
            <template #modal-header="">
              <h5 class="w-100 text-center">Confirm Cancel Booking</h5>
            </template>
            <template #default="">
              <div>Do you want to cancel this booking?</div>
              <div>Reason:</div>
              <b-form-textarea
                v-model="reasonCancel"
                placeholder="Why you cancel this booking?"
              ></b-form-textarea>
            </template>
            <template #modal-footer="">
              <div class="w-100 d-flex justify-content-center">
                <b-button
                  variant="secondary"
                  class="mr-1"
                  @click="$bvModal.hide('modal-cancel')"
                  >No, thanks</b-button
                >
                <b-button
                  variant="danger"
                  @click="onCancelOrder"
                  :disabled="!reasonCancel"
                  >Cancel Order</b-button
                >
              </div>
            </template>
          </b-modal>
        </div>
      </CCardHeader>
      <b-collapse id="time-line" v-model="isShowTimeLine">
        <CCardBody class="timeline-v2">
          <div
            class="timeline-item"
            v-for="(item, index) in timelines"
            :key="index"
            :class="[item.status]"
          >
            <div class="timeline-content">
              <div class="title">
                {{ item.userName }}
              </div>
              <div class="m-0 text-small">
                {{ item.statusDate | formatDateTime }}
              </div>
            </div>
            <div class="timeline-status">
              <div class="status-icon" :id="'status-icon-' + item.statusName">
                <div class="status-name">
                  {{ item.statusName }}
                </div>
              </div>
              <b-tooltip
                :target="'status-icon-' + item.statusName"
                triggeres="hover"
                v-if="item.description"
                >Reason: {{ item.description }}</b-tooltip
              >
              <div class="custom-line"></div>
            </div>
          </div>
        </CCardBody>
      </b-collapse>
    </CCard>
    <CCard>
      <CCardHeader
        class="d-flex"
        aria-controls="detail-booking"
        @click="isShowDetailBooking = !isShowDetailBooking"
      >
        <h5 class="flex-grow-1">Detail</h5>
      </CCardHeader>
      <b-collapse id="detail-booking" v-model="isShowDetailBooking">
        <CCardBody class="px-5">
          <b-card
            class="text-center"
            v-if="bookingData && bookingData.status == 'Cancel' && cancelData"
          >
            <div class="bg-danger text-light font-weight-bold py-2">
              This booking was cancel by {{ cancelData.userName }} with the
              reason: {{ cancelData.description }}
            </div>
          </b-card>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Name Customer</div>
            <div class="col-8">
              {{ bookingData ? bookingData.nameCustomer : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Phone Number</div>
            <div class="col-8">
              {{ bookingData ? bookingData.phoneNumber : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Email</div>
            <div class="col-8">{{ bookingData ? bookingData.email : "" }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Check In Date</div>
            <div class="col-8">
              {{ bookingData ? bookingData.checkInDate : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Check Out Date</div>
            <div class="col-8">
              {{ bookingData ? bookingData.checkOutDate : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Number Adult</div>
            <div class="col-8">
              {{ bookingData ? bookingData.numberAdult : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Number Children</div>
            <div class="col-8">
              {{ bookingData ? bookingData.numberChildren : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Number Baby</div>
            <div class="col-8">
              {{ bookingData ? bookingData.numberBaby : "" }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Note</div>
            <div class="col-8">{{ bookingData ? bookingData.note : "" }}</div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Booking Date</div>
            <div class="col-8">
              {{ bookingData ? bookingData.bookingDate : "" | formatDateTime }}
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Hotel Booked</div>
            <div class="col-8">
              <button
                type="button"
                class="btn btn-link p-0"
                @click="goToHotel(bookingData.hotel.id)"
              >
                {{ bookingData ? bookingData.hotel.name : "" }}
              </button>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-4 font-weight-bold pl-5">Room Booked</div>
            <div class="col-8">
              <button
                type="button"
                class="btn btn-link p-0"
                @click="goToRoom(bookingData.hotel.id, bookingData.room.id)"
              >
                {{ bookingData ? bookingData.room.name : "" }}
              </button>
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
  .timeline-v2 {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    .text-small {
      font-size: 13px;
    }
    .timeline-item {
      display: inline-block;
      margin: 1rem 8px;
      width: 240px;
      max-width: 100%;
      position: relative;

      .timeline-content {
        padding: 0.25rem 0.5rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
        position: relative;
        margin-bottom: 0.5rem;
        font-size: 14px;
        max-width: 90%;
        background: #ffffff;
        min-height: 48px;
        &.hidden {
          opacity: 0;
        }
        .title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 25px;
        }
        &::after {
          content: "";
          width: 4px;
          height: 100%;
          right: 0;
          top: 0;
          background-color: #6c757d;
          position: absolute;
        }
      }
      .timeline-status {
        width: 100%;
        position: relative;
        display: flex;
        flex-grow: 1;
      }
      .status-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 50%;
        border: 4px solid;
        border-color: #6c757d;
        color: #6c757d;
        font-size: 20px;
        position: relative;
        z-index: 9;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        background: #edebf0;
        &::before {
          position: absolute;
        }
      }
      .status-name {
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 700;
        color: #6c757d;
        padding-top: 84px;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        & > span {
          font-size: 12px;
          text-transform: capitalize;
        }
      }

      &.success {
        .timeline-content::after {
          background-color: #28a745;
        }
        .status-name {
          color: #28a745;
        }
        .status-icon {
          color: #28a745;
          border-radius: #6c757d;
          border-color: #28a745;
          &::before {
            content: "\f00c";
          }
        }
        .custom-line {
          background: #28a745;
          &.topright {
            &:after {
              background: #28a745;
            }
          }
          &.bottomright {
            &:after {
              background: #28a745;
            }
          }
        }
      }

      &.inprogress {
        .timeline-content::after {
          background-color: #df7f1d;
        }
        .status-name {
          color: #df7f1d;
          transform: rotateZ(45deg);
        }
        .status-icon {
          color: #df7f1d;
          border-color: #6c757d;
          border-left: 4px dashed #df7f1d;
          border-top: 4px dashed #df7f1d;
          transform: rotateZ(-45deg);
          &::before {
            content: "\f252";
            transform: rotateZ(45deg);
          }
        }
      }

      &.failed {
        .timeline-content::after {
          background-color: #eb4641;
        }
        .status-name {
          color: #eb4641;
        }
        .status-icon {
          color: #eb4641;
          border-radius: #eb4641;
          border-color: #eb4641;
          &::before {
            content: "\f00d";
          }
        }
        .custom-line {
          background: #28a745;
          &.topright {
            &:after {
              background: #28a745;
            }
          }
          &.bottomright {
            &:after {
              background: #28a745;
            }
          }
        }
      }

      &.canceled {
        .timeline-content::after {
          background-color: #eb4641;
        }
        .status-name {
          color: #eb4641;
        }
        .status-icon {
          color: #ffffff;
          border-radius: #eb4641;
          border-color: #eb4641;
          background-color: #eb4641;
          font-size: 2rem;
          &::before {
            content: "\f057";
          }
        }
        .custom-line {
          background: #28a745;
          &.topright {
            &:after {
              background: #28a745;
            }
          }
          &.bottomright {
            &:after {
              background: #28a745;
            }
          }
        }
      }

      .custom-line {
        &.active {
          background: #28a745 !important;
        }

        &.no-active {
          background: #6c757d !important;
        }
      }
    }
    & > .timeline-item:last-child {
      min-width: auto;
      .timeline-status > .custom-line {
        display: none;
      }
    }

    .custom-line {
      height: 4px;
      width: 220px;
      position: absolute;
      background: #6c757d;
      left: 36px;
      top: calc(50% - 2px);
      max-width: 100%;
      &.topright,
      &.bottomright {
        width: 75%;
      }
      &.topright {
        &:after {
          height: 4px;
          width: 70px;
          position: absolute;
          background: #6c757d;
          content: "";
          transform: rotateZ(-45deg);
          top: -24px !important;
          right: calc(-70px + 12px);
          z-index: 0;
        }
      }
      &.bottomright {
        &:after {
          height: 4px;
          width: 70px;
          position: absolute;
          background: #6c757d;
          content: "";
          transform: rotateZ(45deg);
          top: 24px !important;
          right: calc(-70px + 12px);
        }
      }
    }
  }
}
</style>

<script>
import HotelService from "../../services/hotelService";
import { StatusBooking } from "../../services/const";
import Popup from "../../services/popup";

export default {
  components: {},
  name: "Booking",
  data() {
    return {
      hotelService: new HotelService(),
      isShowTimeLine: true,
      isShowDetailBooking: true,
      bookingId: 0,
      bookingData: null,
      timelines: [],
      reasonCancel: null,
    };
  },
  created() {
    this.bookingId = this.$route.params.id;
  },
  async mounted() {
    this.$root["loading"] = true;
    this.bookingData = await this.hotelService.getBookingById(this.bookingId);
    const timelineData = await this.hotelService.getTimelinesByBookingId(
      this.bookingId
    );
    this.buildDataForTimeline(timelineData);
    this.$root["loading"] = false;
  },
  computed: {
    status() {
      return this.bookingData ? this.bookingData.status : "Unknow";
    },
    cancelData() {
      return this.timelines.find((t) => t.statusName == StatusBooking.Cancel);
    },
  },
  methods: {
    buildDataForTimeline(data) {
      this.timelines = [];
      if (Array.isArray(data) && data.length > 0) {
        const cancelStatus = data.find(
          (t) => t.status === StatusBooking.Cancel
        );
        if (cancelStatus) {
          this.timelines = data.map((t) => {
            return {
              status: t.status === StatusBooking.Cancel ? "failed" : "success",
              statusDate: t.modifiedDate,
              statusName: t.status,
              userName: t.admin.userName,
              description: t.description,
            };
          });
        } else {
          const newStatus = data.find((t) => t.status === StatusBooking.New);
          if (newStatus) {
            this.timelines.push({
              status: "success",
              statusDate: newStatus.modifiedDate,
              statusName: newStatus.status,
              userName: newStatus.admin.userName,
            });
          } else {
            this.timelines.push({
              status: null,
              statusDate: null,
              statusName: StatusBooking.New,
              userName: null,
            });
          }

          const processingStatus = data.find(
            (t) => t.status === StatusBooking.Processing
          );
          if (processingStatus) {
            this.timelines.push({
              status: "success",
              statusDate: processingStatus.modifiedDate,
              statusName: processingStatus.status,
              userName: processingStatus.admin.userName,
            });
          } else {
            this.timelines.push({
              status: null,
              statusDate: null,
              statusName: StatusBooking.Processing,
              userName: null,
            });
          }

          const doneStatus = data.find((t) => t.status === StatusBooking.Done);
          if (doneStatus) {
            this.timelines.push({
              status: "success",
              statusDate: doneStatus.modifiedDate,
              statusName: doneStatus.status,
              userName: doneStatus.admin.userName,
            });
          } else {
            this.timelines.push({
              status: null,
              statusDate: null,
              statusName: StatusBooking.Done,
              userName: null,
            });
          }
        }
      }
    },
    async onChangeStatus(status) {
      const confirm = await Popup.confirmYesNo(
        `Do you want to change status of this booking to ${status}`
      );
      if (confirm) {
        this.$root["loading"] = true;
        switch (status) {
          case StatusBooking.Processing:
            this.bookingData.status = StatusBooking.Processing;
            break;
          case StatusBooking.Done:
            this.bookingData.status = StatusBooking.Done;
            break;
        }
        const newBookingData = await this.hotelService.changeStatusBooking(
          this.bookingData,
          this.$store.state.adminId
        );
        this.bookingData = newBookingData;
        const timelineData = await this.hotelService.getTimelinesByBookingId(
          this.bookingId
        );
        this.buildDataForTimeline(timelineData);
        this.$root["loading"] = false;
      }
    },
    async onCancelOrder() {
      this.$bvModal.hide("modal-cancel");
      this.$root["loading"] = true;
      this.bookingData.status = StatusBooking.Cancel;
      this.bookingData.description = this.reasonCancel;
      const newBookingData = await this.hotelService.changeStatusBooking(
        this.bookingData,
        this.$store.state.adminId
      );
      this.bookingData = newBookingData;
      const timelineData = await this.hotelService.getTimelinesByBookingId(
        this.bookingId
      );
      this.buildDataForTimeline(timelineData);
      this.$root["loading"] = false;
    },
    goToHotel(hotelId) {
      this.$router.push({ name: "Hotel", params: { id: hotelId } });
    },
    goToRoom(hotelId, roomId) {
      this.$router.push({
        name: "Room",
        params: { hotelId: hotelId, roomId: roomId },
      });
    },
    back() {
      this.$router.back();
      //this.$router.push({ name: 'Bookings' });
    },
  },
};
</script>