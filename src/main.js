import 'onsenui/css/onsenui.css'; // Onsen UI basic CSS
import './onsen-css-components.css'; // Onsen UI CSS components source for custom themes (requires cssnext)

import Vue from 'vue';
import Vuex from 'vuex';
import VueOnsen from 'vue-onsenui'; // For UMD
import storeLike from './store.js';
import CustomToolbar from './partials/CustomToolbar.vue';
import AppNavigator from './AppNavigator.vue';
import Howl from 'howler';

Vue.use(Vuex);
Vue.use(VueOnsen);
Vue.use(Howl);

Vue.component('custom-toolbar', CustomToolbar);

new Vue({
  el: '#app',
  render: h => h(AppNavigator),
  store: new Vuex.Store(storeLike),
  beforeCreate() {
    // Shortcut for Material Design
    Vue.prototype.md = this.$ons.platform.isAndroid();

    // Set iPhoneX flag based on URL
    if (window.location.search.match(/iphonex/i)) {
      document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
      document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
    }
  }
});
