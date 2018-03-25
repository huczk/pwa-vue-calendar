import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import calendar from './modules/calendar';
import events from './modules/events';

Vue.use(Vuex);

// Use VuexPersist for presistent vuex data in local storage
const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
});

export default new Vuex.Store({
  modules: {
    calendar,
    events,
  },
  plugins: [vuexLocalStorage.plugin],
});
