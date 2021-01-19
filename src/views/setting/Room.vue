<template>
  <div>
    <div>Room ntd:</div>
  </div>
</template>

<script>
import HotelService from "../../services/hotelService";

export default {
  name: "Room",
  data() {
    return {
      hotelService: new HotelService(),
      isEdit: false,
      originDataRoom: null,
      roomId: 0,
      name: null,
      srcImg: null,
      price: null,
      freeServices: [],
      capacity: [],
    };
  },
  created() {
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
  methods: {
    async getData() {
      const dataRoom = await this.hotelService.getRoomById(this.roomId);
      if(dataRoom){
        this.originDataRoom = JSON.parse(JSON.stringify(dataRoom));
        this.mapDataFromApi(dataRoom);
      }
    },
    mapDataFromApi(data){
      this.name = data.name;
      this.srcImg = data.srcImg;
      this.price = parseInt(data.price);
      this.freeServices = data.freeServices.split(',');
      this.capacity = data.capacity.split(',');
    }
  },
};
</script>