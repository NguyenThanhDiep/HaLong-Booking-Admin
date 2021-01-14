<template>
    <div>
        <h2 class="text-center text-uppercase">{{ title }}</h2>
        <b-form @submit="onSave" @reset="onReset" v-if="isShowForm">
            <div class="mb-3">
                <div class="mb-2">Name: </div>
                <b-form-input v-model="hotel.name" placeholder="Name of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Image: </div>
                <b-form-file v-model="hotel.srcImg" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." accept=".jpg, .png" required></b-form-file>
            </div>
            <div class="mb-3">
                <div class="mb-2">Price: </div>
                <b-form-input v-model="hotel.price" type="number" placeholder="Price of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Address: </div>
                <b-form-input v-model="hotel.address" placeholder="Address of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Star: </div>
                <b-form-input v-model="hotel.star" placeholder="star of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Services: </div>
                <b-form-input v-model="hotel.services" placeholder="services of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">FreeServices: </div>
                <b-form-input v-model="hotel.freeServices" placeholder="freeServices of the hotel" required></b-form-input>
            </div>
            <div class="mb-3 d-flex">
                <div class="mr-3">On Sale: </div>
                <b-form-checkbox v-model="hotel.isSale" placeholder="isSale of the hotel" switch required></b-form-checkbox>
            </div>
            <div class="text-center">
                <b-button type="submit" variant="primary" class="mr-3">Save</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </div>
        </b-form>

    </div>
</template>

<script>
import HotelService from '../../services/hotelService';

export default {
    name: 'Hotels',
    data() {
        return  {
            hotelService: new HotelService(),
            hotel: {
                id: 0,
                name: null,
                srcImg: null,
                price: null,
                star: 0,
                address: null,
                freeServices: [],
                services: [],
                isSale: false
            },
            isShowForm: true
        }
    },
    async mounted() {
        
    },
    computed: {
        title(){
            return this.$route.params.id && this.$route.params.id !== '0' ? 'Edit Hotel' : 'Add a new hotel';
        }
    },
    methods: {
        onSave(event){
            event.preventDefault()
            console.log('save hotel: ', this.hotel)
        },
        onReset(event){
            event.preventDefault();
            this.hotel.name = null;
            this.hotel.srcImg = null;
            this.hotel.price = 0;
            this.hotel.address = null;
            this.hotel.services = [];
            this.hotel.freeServices = [];
            this.hotel.isSale = false;

            this.isShowForm = false;
            this.$nextTick(() => {
                this.isShowForm = true;
            });
        }
    }
};
</script>