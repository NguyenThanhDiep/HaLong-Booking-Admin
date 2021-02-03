<template>
  <div class="hotel">
    <div class="title mb-3">
      <b-button variant="outline-primary" @click="back"
        ><i class="fas fa-angle-left"></i> Back</b-button
      >
      <h2 class="text-center text-uppercase">{{ title }}</h2>
      <b-button variant="outline-danger" @click="onDeleteHotel" v-if="isEdit"
        >Delete</b-button
      >
    </div>

    <!-- Detail of hotel -->
    <CCard>
      <CCardHeader @click="isShowDetail = !isShowDetail">
        <h3>Detail</h3>
      </CCardHeader>
      <b-collapse v-model="isShowDetail">
        <CCardBody class="form">
          <div class="row">
            <div class="col-2 align-middle">Name:</div>
            <div class="col-10">
              <b-form-input
                v-model="name"
                placeholder="Name of the hotel"
              ></b-form-input>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Background Image:</div>
            <div class="col-10">
              <!-- <b-form-file v-model="srcImg" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." accept=".jpg, .png"></b-form-file> -->
              <b-form-input
                v-model="srcImg"
                placeholder="Url image of the hotel"
                :state="stateBgImg"
                aria-describedby="bg-img-url-feedback"
              ></b-form-input>
              <b-form-invalid-feedback id="bg-img-url-feedback">
                Please enter a valid url
              </b-form-invalid-feedback>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Detail Images:</div>
            <div class="col-10">
              <div
                v-for="(img, indexI) in srcDetailImgs"
                :key="indexI"
                class="w-100 d-flex flex-column mb-2"
              >
                <div class="w-100 d-flex">
                  <b-form-input
                    v-model="srcDetailImgs[indexI]"
                    placeholder="Url Image of the hotel"
                    :state="stateDetailImgs[indexI]"
                    :aria-describedby="'detail-img-url-feedback-' + indexI"
                  ></b-form-input>
                  <b-button
                    variant="outline-primary"
                    v-show="indexI === srcDetailImgs.length - 1"
                    @click="onAddService(srcDetailImgs)"
                    ><i class="fas fa-plus"></i
                  ></b-button>
                  <b-button
                    variant="outline-danger"
                    v-show="checkShowMinusSign(indexI, srcDetailImgs)"
                    @click="onDeleteService(indexI, srcDetailImgs)"
                    ><i class="fas fa-minus"></i
                  ></b-button>
                </div>
                <div
                  :class="[
                    'invalid-feedback',
                    stateDetailImgs[indexI] === false ? 'd-block' : '',
                  ]"
                >
                  Please enter a valid url
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Price:</div>
            <div class="col-10">
              <b-form-input
                v-model="price"
                type="number"
                placeholder="Price of the hotel"
              ></b-form-input>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Address:</div>
            <div class="col-10">
              <b-form-input
                v-model="address"
                placeholder="Address of the hotel"
              ></b-form-input>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Star:</div>
            <div class="col-10">
              <b-form-rating v-model="star" variant="warning"></b-form-rating>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Services:</div>
            <div class="col-10">
              <div
                v-for="(service, indexS) in services"
                :key="indexS"
                class="w-100 d-flex mb-2"
              >
                <b-form-input
                  v-model="services[indexS]"
                  placeholder="Service of the hotel"
                ></b-form-input>
                <b-button
                  variant="outline-primary"
                  v-show="indexS === services.length - 1"
                  @click="onAddService(services)"
                  ><i class="fas fa-plus"></i
                ></b-button>
                <b-button
                  variant="outline-danger"
                  v-show="checkShowMinusSign(indexS, services)"
                  @click="onDeleteService(indexS, services)"
                  ><i class="fas fa-minus"></i
                ></b-button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">FreeServices:</div>
            <div class="col-10">
              <div
                v-for="(service, indexF) in freeServices"
                :key="indexF"
                class="w-100 d-flex mb-2"
              >
                <b-form-input
                  v-model="freeServices[indexF]"
                  placeholder="FreeServices of the hotel"
                ></b-form-input>
                <b-button
                  variant="outline-primary"
                  v-show="indexF === freeServices.length - 1"
                  @click="onAddService(freeServices)"
                  ><i class="fas fa-plus"></i
                ></b-button>
                <b-button
                  variant="outline-danger"
                  v-show="checkShowMinusSign(indexF, freeServices)"
                  @click="onDeleteService(indexF, freeServices)"
                  ><i class="fas fa-minus"></i
                ></b-button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2">On Sale:</div>
            <div class="col-10">
              <b-form-checkbox
                v-model="isSale"
                placeholder="isSale of the hotel"
                switch
                required
              ></b-form-checkbox>
            </div>
          </div>
          <div class="text-center">
            <b-button
              type="submit"
              variant="outline-primary"
              class="mr-3"
              :disabled="isDisableSave"
              @click="onSave"
              >{{ isEdit ? "Save" : "Create" }}</b-button
            >
            <b-button type="reset" variant="outline-warning" @click="onReset"
              >Reset</b-button
            >
          </div>
        </CCardBody>
      </b-collapse>
    </CCard>

    <!-- List of rooms -->
    <CCard v-if="isEdit">
      <CCardHeader>
        <div class="d-flex">
          <h3 class="flex-grow-1">List of Rooms</h3>
          <b-button variant="outline-success" @click="onAddRoom"
            >Add a new room</b-button
          >
        </div>
      </CCardHeader>
      <CCardBody>
        <b-table
          :items="rooms"
          :fields="roomFields"
          striped
          responsive="sm"
          show-empty
          @row-dblclicked="(item) => onEditRoom(item.id)"
        >
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <template #cell(capacity)="data">
            <div v-for="(cap, index) in data.value.split(',')" :key="index">
              {{ cap }}
            </div>
          </template>
          <template #cell(freeServices)="data">
            <div v-for="(service, index) in data.value.split(',')" :key="index">
              {{ service }}
            </div>
          </template>
          <template #cell(price)="data">
            {{ parseInt(data.value) }}
          </template>
          <template #cell(srcImg)="data">
            <b-img
              :src="data.value"
              fluid
              alt="Responsive image"
              height="200"
              width="200"
            ></b-img>
          </template>
          <template #cell(actions)="data">
            <div>
              <b-button
                variant="outline-primary"
                class="mr-1"
                @click="onEditRoom(data.item.id)"
                >Edit</b-button
              >
              <b-button
                variant="outline-danger"
                @click="onDeleteRoom(data.item.id)"
                >Delete</b-button
              >
            </div>
          </template>
          <template #empty="">
            <h6>This hotel haven't had any rooms yet.</h6>
          </template>
          <template #emptyfiltered="">
            <h6>No result</h6>
          </template>
        </b-table>
      </CCardBody>
    </CCard>
  </div>
</template>

<style lang="scss" scoped>
.hotel {
  .card-header {
    cursor: pointer;
  }
  .title {
    position: relative;
    h2 {
      position: absolute;
      width: 100%;
      top: 0;
    }
    button {
      position: relative;
      top: 0;
      z-index: 100;
      &:last-child {
        float: right;
      }
    }
  }
  .form {
    background-color: white;
    color: black;
    div.row {
      margin-bottom: 10px;
    }
    div.col-2 {
      vertical-align: middle;
    }
  }
}
</style>

<script>
import HotelService from "../../services/hotelService";
import Vue from "vue";
import Popup from "../../services/popup";
import { IsValidUrl } from "../../services/common";

export default {
  name: "Hotel",
  data() {
    return {
      hotelService: new HotelService(),
      originDataHotel: null,
      isEdit: false,
      isShowDetail: true,
      hotelId: 0,

      name: null,
      srcImg: null,
      srcDetailImgs: [""],
      price: null,
      star: 0,
      address: null,
      freeServices: [""],
      services: [""],
      isSale: false,
      rooms: [],

      roomFields: [
        "index",
        { key: "name", label: "Name", sortable: true },
        { key: "price", label: "Price (vnd)", sortable: true },
        { key: "capacity", label: "Capacity", sortable: true },
        { key: "freeServices", label: "Free Services", sortable: true },
        { key: "srcImg", label: "Image", sortable: true },
        // { key: "actions", label: "" },
      ],
    };
  },
  created() {
    if (this.$route.params.id && this.$route.params.id !== "0") {
      this.isEdit = true;
      this.hotelId = this.$route.params.id;
    }
  },
  async mounted() {
    this.$root["loading"] = true;
    if (this.isEdit) {
      await this.getData();
    }
    this.$root["loading"] = false;
  },
  computed: {
    title() {
      return this.isEdit ? "Edit Hotel" : "Add a new hotel";
    },
    isDisableSave() {
      return (
        !this.name ||
        !this.srcImg ||
        this.stateBgImg === false ||
        !this.price ||
        !this.star ||
        !this.address ||
        this.freeServices.filter((val) => val !== "").length == 0 ||
        this.services.filter((val) => val !== "").length == 0 ||
        this.srcDetailImgs.filter((val) => val !== "").length == 0 ||
        this.stateDetailImgs.some((state) => state === false)
      );
    },
    stateBgImg() {
      return this.srcImg && this.srcImg.length > 0 && !IsValidUrl(this.srcImg)
        ? false
        : null;
    },
    stateDetailImgs() {
      return this.srcDetailImgs.map((src) => {
        return src && src.length > 0 && !IsValidUrl(src) ? false : null;
      });
    },
  },
  methods: {
    async getData() {
      const dataHotel = await this.hotelService.getHotelById(
        this.$route.params.id
      );
      if (dataHotel) {
        this.originDataHotel = JSON.parse(JSON.stringify(dataHotel));
        this.mapDataFromAPI(dataHotel);
      } else {
        this.$router.replace({ name: "Page404" });
      }
    },
    mapDataFromAPI(data) {
      this.name = data.name;
      this.address = data.address;
      this.price = parseInt(data.price);
      this.srcImg = data.srcImg;
      this.srcDetailImgs = data.srcDetailImgs.split(",");
      this.services = data.services.split(",");
      this.freeServices = data.freeServices.split(",");
      this.star = data.star;
      this.isSale = data.isSale;
      this.rooms = data.rooms;
    },
    buildDataForAPI() {
      return {
        id: this.isEdit ? this.hotelId : 0,
        name: this.name,
        srcImg: this.srcImg,
        srcDetailImgs: this.srcDetailImgs
          .filter((val) => val !== "")
          .toString(),
        price: this.price,
        star: this.star,
        address: this.address,
        freeServices: this.freeServices.filter((val) => val !== "").toString(),
        services: this.services.filter((val) => val !== "").toString(),
        isSale: this.isSale,
        rooms:
          this.originDataHotel && this.originDataHotel.rooms
            ? this.originDataHotel.rooms
            : [],
        bookings:
          this.originDataHotel && this.originDataHotel.bookings
            ? this.originDataHotel.bookings
            : [],
      };
    },
    async onSave() {
      this.$root["loading"] = true;
      const model = this.buildDataForAPI();
      if (this.isEdit) {
        await this.hotelService.updateHotel(model);
        this.$bvToast.toast("Update hotel successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } else {
        const newHotel = await this.hotelService.createHotel(model);
        new Vue().$bvToast.toast("Create hotel successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
        this.$router.replace({ name: "Hotel", params: { id: newHotel.id } });
      }
      this.$root["loading"] = false;
    },
    onReset() {
      if (this.isEdit) {
        this.mapDataFromAPI(this.originDataHotel);
      } else {
        this.name = null;
        this.srcImg = null;
        this.srcDetailImgs = [""];
        this.price = null;
        this.address = null;
        this.services = [""];
        this.freeServices = [""];
        this.star = 0;
        this.isSale = false;
      }
    },
    onAddService(array) {
      array.push("");
    },
    onDeleteService(index, array) {
      array.splice(index, 1);
    },
    checkShowMinusSign(index, array) {
      let isShow = false;
      if (Array.isArray(array) && array.length > 0) {
        isShow = index !== array.length - 1;
      }
      return isShow;
    },
    back() {
      this.$router.back();
      //this.$router.push({ name: "Hotels" });
    },
    async onDeleteHotel() {
      const message = "Do you confirm to delete this hotel?";
      const confirm = await Popup.confirmYesNo(message, new Vue(), {
        headerClass: "bg-danger text-light",
        okTitle: "Delete",
        okVariant: "btn btn-danger",
      });
      if (confirm) {
        this.$root["loading"] = true;
        if (this.hotelId) {
          await this.hotelService.deleteHotel(this.hotelId);
        }
        new Vue().$bvToast.toast("Delete hotel successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
        this.$root["loading"] = false;
        this.back();
      }
    },
    async onAddRoom() {
      this.$router.push({
        name: "Room",
        params: { hotelId: this.hotelId, roomId: 0 },
      });
    },
    async onEditRoom(roomId) {
      this.$router.push({
        name: "Room",
        params: { hotelId: this.originDataHotel.id, roomId: roomId },
      });
    },
    async onDeleteRoom(roomId) {
      const message = "Do you confirm to delete this room?";
      const confirm = await Popup.confirmYesNo(message, new Vue(), {
        headerClass: "bg-danger text-light",
        okTitle: "Delete",
        okVariant: "btn btn-danger",
      });
      if (confirm) {
        this.$root["loading"] = true;
        if (roomId) {
          await this.hotelService.deleteRoom(roomId);
        }
        new Vue().$bvToast.toast("Delete room successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
        await this.getData();
        this.$root["loading"] = false;
      }
    },
  },
};
</script>