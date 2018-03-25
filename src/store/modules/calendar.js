import moment from 'moment';
import types from '../types';
import getMonth from '../helpers/calendarHelper';

moment.locale('pl');

// initial state
const state = {
  today: '',
  selectedDay: '',
  currMonth: {},
  year: '',
  month: '',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
};

// getters
const getters = {
  getCalendar: state => state,
  getSelectedDay: state => state.selectedDay,
  getMonthsNames: state => state.months,
  getWeekDaysNames: state => state.weekDays,
};

// actions
const actions = {
  selectDay({ commit }, day) {
    commit(types.SET_SELECTED_DAY, day);
  },

  initToday({ commit }) {
    const today = moment();
    commit(types.SET_TODAY, today);
  },

  initCalendar({ commit }, { year = moment().year(), month = moment().month() } = {}) {
    const currMonth = getMonth(year, month, state.today);
    commit(types.SET_CALENDAR, { year, month, currMonth });
  },

};

// mutations
const mutations = {
  [types.SET_SELECTED_DAY](state, day) {
    state.selectedDay = day;
  },

  [types.SET_TODAY](state, today) {
    state.today = today;
  },

  [types.SET_CALENDAR](state, { year, month, currMonth }) {
    state.year = year;
    state.month = month;
    state.currMonth = currMonth;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
