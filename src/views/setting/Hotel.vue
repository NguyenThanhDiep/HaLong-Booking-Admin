<template>
    <div class="hotel">
        <div class="d-flex mb-3">
            <b-button variant="outline-primary" @click="backToList"><i class="fas fa-angle-left"></i> Back to list hotels</b-button>
            <h2 class="text-center text-uppercase flex-grow-1">{{ title }}</h2>
            <b-button variant="outline-danger" @click="onDeleteHotel">Delete</b-button>
        </div>
        <CCard>
            <CCardBody class="form">
                <div class="row">
                    <div class="col-2 align-middle">Name:</div>
                    <div class="col-10">
                        <b-form-input v-model="name" placeholder="Name of the hotel"></b-form-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">Image:</div>
                    <div class="col-10">
                        <!-- <b-form-file v-model="srcImg" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." accept=".jpg, .png"></b-form-file> -->
                        <b-form-input v-model="srcImg" placeholder="Url image of the hotel"></b-form-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">Price:</div>
                    <div class="col-10">
                        <b-form-input v-model="price" type="number" placeholder="Price of the hotel"></b-form-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">Address:</div>
                    <div class="col-10">
                        <b-form-input v-model="address" placeholder="Address of the hotel"></b-form-input>
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
                        <div v-for="(service, indexS) in services" :key="indexS" class="w-100 d-flex mb-2">
                            <b-form-input v-model="services[indexS]" placeholder="Service of the hotel"></b-form-input>
                            <b-button variant="outline-primary" v-show="indexS === services.length - 1" @click="onAddService(services)"><i class="fas fa-plus"></i></b-button>
                            <b-button variant="outline-danger" v-show="checkShowMinusSign(indexS, services)" @click="onDeleteService(indexS, services)"><i class="fas fa-minus"></i></b-button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">FreeServices:</div>
                    <div class="col-10">
                        <div v-for="(service, indexF) in freeServices" :key="indexF" class="w-100 d-flex mb-2">
                            <b-form-input v-model="freeServices[indexF]" placeholder="FreeServices of the hotel"></b-form-input>
                            <b-button variant="outline-primary" v-show="indexF === freeServices.length - 1" @click="onAddService(freeServices)"><i class="fas fa-plus"></i></b-button>
                            <b-button variant="outline-danger" v-show="checkShowMinusSign(indexF, freeServices)" @click="onDeleteService(indexF, freeServices)"><i class="fas fa-minus"></i></b-button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">On Sale:</div>
                    <div class="col-10">
                        <b-form-checkbox v-model="isSale" placeholder="isSale of the hotel" switch required></b-form-checkbox>
                    </div>
                </div>
                <div class="text-center">
                    <b-button type="submit" variant="primary" class="mr-3" :disabled="isDisableSave" @click="onSave">{{ isEdit ? 'Save' : 'Create' }}</b-button>
                    <b-button type="reset" variant="danger" @click="onReset">Reset</b-button>
                </div>
            </CCardBody>
        </CCard>
        
        <!-- <b-form @submit="onSave" @reset="onReset" v-if="isShowForm">
            <div class="mb-3">
                <div class="mb-2">Name: </div>
                <b-form-input v-model="name" placeholder="Name of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Image: </div>
                <b-form-file v-model="srcImg" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." accept=".jpg, .png" required></b-form-file>
            </div>
            <div class="mb-3">
                <div class="mb-2">Price: </div>
                <b-form-input v-model="price" type="number" placeholder="Price of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Address: </div>
                <b-form-input v-model="address" placeholder="Address of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">Star: </div>
                <b-form-rating v-model="star" variant="warning"></b-form-rating>
            </div>
            <div class="mb-3">
                <div class="mb-2">Services: </div>
                <b-form-input v-model="services" placeholder="services of the hotel" required></b-form-input>
            </div>
            <div class="mb-3">
                <div class="mb-2">FreeServices: </div>
                <b-form-input v-model="freeServices" placeholder="freeServices of the hotel" required></b-form-input>
            </div>
            <div class="mb-3 d-flex">
                <div class="mr-3">On Sale: </div>
                <b-form-checkbox v-model="isSale" placeholder="isSale of the hotel" switch required></b-form-checkbox>
            </div>
            <div class="text-center">
                <b-button type="submit" variant="primary" class="mr-3">Save</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </div>
        </b-form> -->

    </div>
</template>

<style lang="scss" scoped>
.hotel {
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
import HotelService from '../../services/hotelService';
import Vue from 'vue';

export default {
    name: 'Hotels',
    data() {
        return  {
            hotelService: new HotelService(),
            originDataHotel: null,
            isEdit: false,

            name: null,
            srcImg: null,
            price: null,
            star: 0,
            address: null,
            freeServices: [""],
            services: [""],
            isSale: false,
        }
    },
    created(){
        if(this.$route.params.id && this.$route.params.id !== '0'){
            this.isEdit = true;
        }
    },
    async mounted() {
        this.$root['loading'] = true;
        if(this.isEdit){
            const dataHotel = await this.hotelService.getHotelById(this.$route.params.id);
            if(dataHotel){
                this.originDataHotel = JSON.parse(JSON.stringify(dataHotel));
                this.mapDataFromAPI(dataHotel);
            }
        }
        this.$root['loading'] = false;
    },
    computed: {
        title(){
            return this.isEdit ? 'Edit Hotel' : 'Add a new hotel';
        },
        isDisableSave(){
            return !this.name || !this.srcImg || !this.price || !this.star 
            || !this.address || this.freeServices.filter(val => val !== "").length == 0
            || this.services.filter(val => val !== "").length == 0;
        }
    },
    methods: {
        mapDataFromAPI(data){
            this.name = data.name;
            this.address = data.address;
            this.price = parseInt(data.price);
            this.srcImg = data.srcImg;
            this.services = data.services.split(',');
            this.freeServices = data.freeServices.split(',');
            this.star = data.star;
            this.isSale = data.isSale;
        },
        buildDataForAPI(){
            return {
                id: this.isEdit ? this.originDataHotel.id : 0,
                name: this.name,
                srcImg: this.srcImg,
                price: this.price,
                star: this.star,
                address: this.address,
                freeServices: this.freeServices.filter(val => val !== "").toString(),
                services: this.services.filter(val => val !== "").toString(),
                isSale: this.isSale,
                rooms: this.originDataHotel && this.originDataHotel.rooms ? this.originDataHotel.rooms : []
            }
        },
        async onSave(){
            this.$root['loading'] = true;
            const model = this.buildDataForAPI();
            if(this.isEdit) {
                await this.hotelService.updateHotel(model);
                this.$bvToast.toast('Update hotel successfully!', {
                    title: 'Success',
                    variant: "success",
                    solid: true
                })
            }
            else {
                const newHotel = await this.hotelService.createHotel(model);
                new Vue().$bvToast.toast('Create hotel successfully!', {
                    title: 'Success',
                    variant: "success",
                    solid: true
                });
                this.$router.push({ name: 'Hotel', params: { id: newHotel.id }});
            }
            this.$root['loading'] = false;
        },
        onReset(){
            if(this.isEdit){
                this.mapDataFromAPI(this.originDataHotel);
            }
            else {
                this.name = null;
                this.srcImg = null;
                this.price = 0;
                this.address = null;
                this.services = [""];
                this.freeServices = [""];
                this.star = 0;
                this.isSale = false;
            }
        },
        onAddService(array){
            array.push("");
        },
        onDeleteService(index, array){
            array.splice(index, 1);
        },
        checkShowMinusSign(index, array){
            let isShow = false;
            if(Array.isArray(array) && array.length > 0){
                isShow = index !== array.length - 1;
            }
            return isShow;
        },
        backToList(){
            this.$router.push({ name: 'Hotels' });
        },
        async onDeleteHotel(){
            this.$root['loading'] = true;
            if(this.originDataHotel && this.originDataHotel.id){
                await this.hotelService.deleteHotel(this.originDataHotel.id);
            }
            new Vue().$bvToast.toast('Delete hotel successfully!', {
                title: 'Success',
                variant: "success",
                solid: true
            })
            this.$root['loading'] = false;
            this.backToList();
        }
    }
};
</script>