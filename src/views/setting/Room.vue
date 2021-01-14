<template>
  <div>
      <div>{{$route}}</div>
  </div>
</template>

<script>
import HotelService from '../../services/hotelService';

export default {
  name: 'Hotels',
  data() {
    return {
      hotelService: new HotelService(),
      title: ''
      };
    },
    async mounted() {
        
    },
};
</script>