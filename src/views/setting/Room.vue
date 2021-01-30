<template>
  <div class="room">
    <div class="title mb-3">
      <b-button variant="outline-primary" @click="back"
        ><i class="fas fa-angle-left"></i> Back</b-button
      >
      <h2 class="text-center text-uppercase">{{ title }}</h2>
      <b-button variant="outline-danger" @click="onDeleteRoom" v-if="isEdit"
        >Delete</b-button
      >
    </div>

    <!-- Detail of hotel -->
    <CCard>
      <CCardHeader>
        <h3>Detail</h3>
      </CCardHeader>
      <CCardBody class="form">
        <div class="row">
          <div class="col-2 align-middle">Name:</div>
          <div class="col-10">
            <b-form-input
              v-model="name"
              placeholder="Name of room"
            ></b-form-input>
          </div>
        </div>
        <div class="row">
          <div class="col-2">Image:</div>
          <div class="col-10">
            <!-- <b-form-file v-model="srcImg" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." accept=".jpg, .png"></b-form-file> -->
            <b-form-input
              v-model="srcImg"
              placeholder="Url image of room"
            ></b-form-input>
          </div>
        </div>
        <div class="row">
          <div class="col-2">Price:</div>
          <div class="col-10">
            <b-form-input
              v-model="price"
              type="number"
              placeholder="Price of room"
            ></b-form-input>
          </div>
        </div>
        <div class="row">
          <div class="col-2">Capacity:</div>
          <div class="col-10">
            <div
              v-for="(capacity, indexC) in capacities"
              :key="indexC"
              class="w-100 d-flex mb-2"
            >
              <b-form-input
                v-model="capacities[indexC]"
                placeholder="Capacity of room"
              ></b-form-input>
              <b-button
                variant="outline-primary"
                v-show="indexC === capacities.length - 1"
                @click="onAddService(capacities)"
                ><i class="fas fa-plus"></i
              ></b-button>
              <b-button
                variant="outline-danger"
                v-show="checkShowMinusSign(indexC, capacities)"
                @click="onDeleteService(indexC, capacities)"
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
    </CCard>
  </div>
</template>

<style lang="scss" scoped>
.room {
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

export default {
  name: "Room",
  data() {
    return {
      hotelService: new HotelService(),
      isEdit: false,
      originDataRoom: null,
      hotelId: 0,
      roomId: 0,
      name: null,
      srcImg: null,
      price: null,
      freeServices: [''],
      capacities: [''],
    };
  },
  created() {
    if (this.$route.params.hotelId && this.$route.params.hotelId !== "0") {
      this.hotelId = this.$route.params.hotelId;
    }
    if (this.$route.params.roomId && this.$route.params.roomId !== "0") {
      this.isEdit = true;
      this.roomId = this.$route.params.roomId;
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
      return this.isEdit ? "Edit Room" : "Add a new room";
    },
    isDisableSave() {
      return (
        !this.name ||
        !this.srcImg ||
        !this.price ||
        this.freeServices.filter((val) => val !== "").length == 0 ||
        this.capacities.filter((val) => val !== "").length == 0
      );
    },
  },
  methods: {
    async getData() {
      const dataRoom = await this.hotelService.getRoomById(this.roomId);
      if (dataRoom) {
        this.originDataRoom = JSON.parse(JSON.stringify(dataRoom));
        this.mapDataFromAPI(dataRoom);
      }
    },
    mapDataFromAPI(data) {
      this.name = data.name;
      this.srcImg = data.srcImg;
      this.price = parseInt(data.price);
      this.freeServices = data.freeServices.split(",");
      this.capacities = data.capacity.split(",");
    },
    buildDataForAPI() {
      return {
        id: this.isEdit ? this.originDataRoom.id : 0,
        name: this.name,
        srcImg: this.srcImg,
        price: this.price,
        freeServices: this.freeServices.filter((val) => val !== "").toString(),
        capacity: this.capacities.filter((val) => val !== "").toString(),
        hotelId: this.hotelId,
      };
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
    onReset() {
      if (this.isEdit) {
        this.mapDataFromAPI(this.originDataHotel);
      } else {
        this.name = null;
        this.srcImg = null;
        this.price = null;
        this.freeServices = [""];
        this.capacities = [""];
      }
    },
    async onSave() {
      this.$root["loading"] = true;
      const model = this.buildDataForAPI();
      if (this.isEdit) {
        await this.hotelService.updateRoom(model);
        this.$bvToast.toast("Update room successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
      } else {
        const newRoom = await this.hotelService.createRoom(model);
        if (newRoom) {
          new Vue().$bvToast.toast("Create room successfully!", {
            title: "Success",
            variant: "success",
            solid: true,
          });
          this.$router.replace({ name: "Room", params: { hotelId: this.hotelId, roomId: newRoom.id } });
        }
      }
      this.$root["loading"] = false;
    },
    async onDeleteRoom() {
      const message = "Do you confirm to delete this room?";
      const confirm = await Popup.confirmYesNo(message);
      if (confirm) {
        this.$root["loading"] = true;
        await this.hotelService.deleteRoom(this.roomId);
        new Vue().$bvToast.toast("Delete room successfully!", {
          title: "Success",
          variant: "success",
          solid: true,
        });
        this.$root["loading"] = false;
      }
      this.back();
    },
    back() {
      this.$router.back();
      //this.$router.push({ name: "Hotel", params: { id: this.hotelId } });
    },
  },
};
</script>