<template>
  <div>
    <div class="row mb-3">
      <h2 class="text-center flex-grow-1 text-upppercase">Manage Hotels</h2>
      <b-button variant="outline-info" @click="onAddHotel"
        >Add a new hotel</b-button
      >
    </div>
    <!-- <b-table :items="hotels" :fields="fields" striped responsive="sm">
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(services)="data">
        <div v-for="(service, index) in data.value.split(',')" :key="index">
          {{ service }}
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
      <template #cell(isSale)="data">
        <b-form-checkbox switch v-model="data.value" disabled></b-form-checkbox>
      </template>
      <template #cell(srcImg)="data">
        <b-img :src="data.value" fluid alt="Responsive image" height="200" width="200"></b-img>
      </template>
      <template #cell(actions)="data">
        <div>
          <b-button variant="outline-primary" class="mr-1" @click="onEditHotel(data.item.id)">Edit</b-button>
          <b-button variant="outline-danger" @click="onDeleteHotel(data.item.id)">Delete</b-button>
        </div>
      </template>
    </b-table> -->
    <CCard>
      <CCardBody>
        <Table
          :fields="fields"
          :items="hotels || []"
          :loading="loading"
          :isShowSelectCol="isShowSelectCol"
          @rowDbClick="onDbClickHotel"
        ></Table>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import HotelService from "../../services/hotelService";
import Table from "../shared/Table";

export default {
  name: "Hotels",
  components: { Table },
  data() {
    return {
      hotelService: new HotelService(),
      hotels: [],
      loading: false,
      isShowSelectCol: false,
      fields: [
        { key: "name", label: "Name", sortable: true },
        { key: "address", label: "Address", sortable: true },
        // { key: "services", label: "Services", sortable: true },
        // { key: "freeServices", label: "Free Services", sortable: true },
        // { key: "srcImg", label: "Image", sortable: true },
        { key: "price", label: "Price (vnd)", sortable: true },
        { key: "isSale", label: "On Sale", sortable: true },
        { key: "star", label: "Star", sortable: true },
        { key: "numberOfBookings", label: "Number Bookings", sortable: true },
        // { key: "actions", label: "" },
      ],
    };
  },
  async mounted() {
    this.loading = true;
    const resHotels = await this.hotelService.getAllHotels();
    this.hotels = this.mapDataFromAPI(resHotels);
    this.loading = false;
  },
  methods: {
    mapDataFromAPI(data){
      if(Array.isArray(data) && data.length > 0){
        return data.map((hotel) => {
          return {
            ...hotel,
            numberOfBookings: hotel.bookings.length
          }
        })
      }
    },
    onEditHotel(hotelId) {
      this.$router.push({ name: "Hotel", params: { id: hotelId } });
    },
    async onDeleteHotel(hotelId) {
      this.$root["loading"] = true;
      await this.hotelService.deleteHotel(hotelId);
      this.$bvToast.toast("Delete hotel successfully!", {
        title: "Success",
        variant: "success",
        solid: true,
      });
      this.hotels = await this.hotelService.getAllHotels();
      this.$root["loading"] = false;
    },
    onAddHotel() {
      this.$router.push({ name: "Hotel", params: { id: 0 } });
    },
    onDbClickHotel(hotel) {
      this.$router.push({ name: "Hotel", params: { id: hotel.id } });
    },
  },
};
</script>