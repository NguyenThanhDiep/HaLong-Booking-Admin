<template>
  <div class="bookings">
    <CCard>
      <CCardHeader>
        <div class="d-flex">
          <h4 class="flex-grow-1">Filter Area</h4>
          <div><i class="fas fa-caret-up"></i><i class="fas fa-caret-down"></i></div>
        </div>
      </CCardHeader>
      <CCardBody></CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <div class="d-flex menu-tabs">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['px-3 py-1 tab', tab === tabActive ? 'active' : '']"
            @click="onChangeTab(tab)"
          >
            {{ tab }}
          </button>
        </div>
      </CCardHeader>
      <CCardBody>
        <b-table :items="bookingsData[tabActive]" :fields="bookingFields">
        </b-table>
      </CCardBody>
    </CCard>
  </div>
</template>

<style lang="scss" scoped>
.bookings {
  .menu-tabs {
    .tab {
      &:focus {
        outline: 0;
      }
      border: none;
      border-bottom: 5px solid rgba(0, 0, 0, 0);;
      background: none;
      &:not(:disabled) {
        color: grey;
      }
      &.active {
        background-color: transparent;
        border-bottom: 5px solid #007bff;
        color: #007bff;
      }
      &.disabled {
        color: #808080;
      }
    }
  }
}
</style>

<script>
export default {
  name: "Bookings",
  mounted() {
    console.log("Bookings");
  },
  data() {
    return {
      tabs: ["New", "Processing", "Done", "Cancel"],
      tabActive: "New",
      bookingsData: {
        New: [],
        Processing: [],
        Done: [],
        Cancel: []
      },
      bookingFields: [
        "index",
        []
      ]
    };
  },
  methods: {
    onChangeTab(tab) {
      this.tabActive = tab;
    },
  },
};
</script>