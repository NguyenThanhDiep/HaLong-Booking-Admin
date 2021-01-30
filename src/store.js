import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  userName: null,
  adminId: 0,
  isLogin: false,
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
  plugins: [createPersistedState({
    storage: window.localStorage,
    reducer: (val) => {
      return val;
    }
  })],
});