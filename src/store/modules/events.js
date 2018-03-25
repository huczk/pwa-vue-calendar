import Vue from 'vue';
import types from '../types';

// initial state
const state = {
  events: {},
  eventForm: {
    show: false,
    day: {},
  },
  lastNotification: '',
  permissionGranted: false,
};

// getters
const getters = {
  getEvents: () => state.events,
  getEventByDay: () => ({ year, month, day }) => {
    try {
      return state.events[year][month][day];
    } catch (e) {
      return '';
    }
  },

  getForm: () => state.eventForm,
  getLastNotification: () => state.lastNotification,
  notificationPermission: () => state.permissionGranted,
};

// actions
const actions = {
  addEvent({ commit }, event) {
    commit(types.ADD_EVENT, event);
  },

  showForm({ commit }, day) {
    commit(types.SHOW_FORM, day);
  },

  closeForm({ commit }) {
    commit(types.CLOSE_FORM);
  },

  deleteEvent({ commit }, details) {
    commit(types.DELETE_EVENT, details);
  },

  setNofificationTime({ commit }, time) {
    commit(types.SET_NOTIFICATION_TIME, time);
  },

  grantNotification({ commit }, grant) {
    commit(types.GRANT_NOTIFICATION, grant);
  },
};

// mutations
const mutations = {
  [types.ADD_EVENT](state, event) {
    const { year, month, day } = event.day;

    // Check if multi nested value for notification on this day exist
    // when in some level nested value does'nt exist - create and add event
    if ((((state.events || {})[year] || {})[month] || {})[day]) {
      state.events[year][month][day].push(event.details);
    } else if (((state.events || {})[year] || {})[month]) {
      Vue.set(state.events[year][month], [day], [event.details]);
    } else if ((state.events || {})[year]) {
      Vue.set(state.events[year], [month], {
        [day]: [event.details],
      });
    } else {
      Vue.set(state.events, [year], {
        [month]: {
          [day]: [event.details],
        },
      });
    }
  },

  [types.SHOW_FORM](state, day) {
    state.eventForm = {
      show: true,
      day,
    };
  },

  [types.CLOSE_FORM](state) {
    state.eventForm = {
      show: false,
    };
  },

  [types.DELETE_EVENT](state, details) {
    const { year, month, day } = details.day;
    const filteredEvents = state.events[year][month][day]
      .filter(event => (
        event.name !== details.event.name ||
        event.description !== details.event.description
      ));

    state.events[year][month][day] = filteredEvents;
  },

  [types.SET_NOTIFICATION_TIME](state, time) {
    state.lastNotification = time;
  },

  [types.GRANT_NOTIFICATION](state, grant) {
    state.permissionGranted = grant;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
