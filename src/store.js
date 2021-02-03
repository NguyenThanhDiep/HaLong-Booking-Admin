import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import * as Cookies from "js-cookie";

Vue.use(Vuex);

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  userName: null,
  adminId: 0,
  isLogin: false,
  tabBooking: 'New',
};

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow);
    state.sidebarShow = sidebarOpened ? false : 'responsive';
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow);
    state.sidebarShow = sidebarClosed ? true : 'responsive';
  },
  set(state, [variable, value]) {
    state[variable] = value;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  strict: false,
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  // plugins: [createPersistedState({
  //   storage: {
  //     getItem: (key) => Cookies.get(key),
  //     // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
  //     setItem: (key, value) =>
  //       Cookies.set(key, value, { expires: 1, secure: true }),
  //     removeItem: (key) => Cookies.remove(key),
  //   },
  // })],
});