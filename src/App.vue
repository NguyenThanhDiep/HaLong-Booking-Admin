<template>
  <div>
    <Loader v-model="$root['loading']" fixed />
    <router-view></router-view>
  </div>
</template>

<script>
import Loader from './views/shared/Loader';

export default {
  name: 'App',
  components: {
    Loader
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
