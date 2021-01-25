import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.prototype.$log = console.log.bind(console)
Vue.directive('click-outside', {
	bind: function (el, binding, vnode) {
		el.clickOutsideEvent = function (event) {
			// here I check that click was outside the el and his childrens
			if (!(el == event.target || el.contains(event.target))) {
				// and if it did, call method provided in attribute value
				vnode.context[binding.expression](event);
			}
		};
		document.body.addEventListener('click', el.clickOutsideEvent)
	},
	unbind: function (el) {
		document.body.removeEventListener('click', el.clickOutsideEvent)
	}
});

new Vue({
  el: '#app',
  data() {
    return {
      loading: false
    }
  },
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
