import Vue from 'vue';
import moment from 'moment';
import App from './App';
import store from './store';

moment.locale('pl');

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  data: {
    // Notifications options
    notificationOptions: {
      icon: '/static/img/icons/calendar_64.png',
      badge: '/static/img/icons/calendar_64.png',
      vibrate: [100, 50, 200],
    },
  },
  // Ask for notification permission
  created() {
    const notificationPermission = this.$store.getters.notificationPermission;

    if ('serviceWorker' in navigator || 'Notification' in window) {
      // If notification is not granted - ask for them, then show today events count notification
      if (!notificationPermission) {
        this.askForPermission().then(this.showEventNotification);
      } else {
        this.showEventNotification();
      }
    }
  },
  methods: {
    // Ask for permission, if granted than show success notification
    askForPermission() {
      return Notification.requestPermission((result) => {
        if (result !== 'granted') {
          this.$store.dispatch('grantNotification', false);
          return;
        }
        this.confirmNotification();
      });
    },
    // Confirmation notification
    confirmNotification() {
      return this.notification(
        'You have successfully subscribed to notifications',
        'grantNotification',
        true,
      );
    },
    // Show notification of how many events user have today. Max in 12 hours interval
    showEventNotification() {
      const now = new Date();
      const miliseconds12Hours = 43200000;
      const lastNotify = this.$store.getters.getLastNotification;
      const eventsCount = this.$store.getters.getEventByDay({
        year: moment().year(),
        month: moment().month(),
        day: moment().date(),
      }).length || 0;

      const eventsSingular = eventsCount === 1 ? 'event' : 'events';

      if (!lastNotify || now - lastNotify >= miliseconds12Hours) {
        return this.notification(
          `Today You have ${eventsCount} ${eventsSingular} 😃`,
          'setNofificationTime',
          now,
        );
      }
      return 0;
    },

    // return new notification, then dispach action to vuex
    notification(title, commitType, commitValue) {
      const self = this;
      return navigator.serviceWorker.ready
        .then(swreg => swreg.showNotification(title, self.notificationOptions))
        .then(() => self.$store.dispatch(commitType, commitValue));
    },
  },
});
