<template>
<transition name="details">
  <div class="dayDetails__container">
    <span class="close" @click="selectDay('')">&times;</span>
    <span class="addEvent" @click="showForm(day)">+</span>
      <div class="header">
        <h3>{{day.day}} {{months[day.month]}} {{day.year}}</h3>
      </div>
    <div class="dayDetails">
      <h4>Events:</h4>
      <div v-if="events" v-for="(event, key) in eventsSorted" :key="key"
        class="dayDetails__event" data-event="true" @click.stop="focusEvent"
      >
        <span class="dayDetails__label" :style="{backgroundColor: event.labelColor}"></span>
        <b>{{event.allDay ? 'All day' : event.time}}</b>
        <span>{{event.name}}</span>
        <p>{{event.description}}</p>
        <span class="dayDetails__closeEvent" @click="handleDelete({ event, day })">&times;</span>
      </div>
      <div v-else>No events</div>
    </div>
  </div>
</transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'DayDetails',
  props: [
    'day', // Day object
    'events', // Array with events on day which was passed above
  ],
  computed: {
    ...mapGetters({
      months: 'getMonthsNames',
    }),
    eventsSorted() {
      const arr = this.events || [];
      return arr.sort((a, b) => a.time > b.time);
    },
  },
  methods: {
    ...mapActions([
      'selectDay',
      'showForm',
      'deleteEvent',
      'initCalendar',
    ]),
    // When user click/tap on event - show button to delete this event
    focusEvent(e) {
      if (e.target.dataset.event) {
        e.target.classList.toggle('dayDetails__event--focus');
      } else {
        e.target.parentNode.classList.toggle('dayDetails__event--focus');
      }
    },
    // Delete choosen event, init calendar to display it without deleted event
    handleDelete(object) {
      this.deleteEvent(object);
      this.initCalendar();

      // Set selected to null and again to this day - for component rerender with current vuex data
      this.selectDay('');
      this.selectDay(this.day);
    },
  },
};
</script>

<style scoped>
.dayDetails__container {
  width: 100%;
  height: 100vh;
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
}

.header {
  position: fixed;
  top: 0;
  padding-top: 10px;
  background-color: white;
  z-index: 2000;
  left: 50%;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 35px 15px white;
  transform: translateX(-50%);
}

.header::after {
  content: '';
  position: fixed;
  display: block;
  top: 100vh;
  background-color: white;
  z-index: 2000;
  left: 50%;
  height: 20px;
  width: 100%;
  box-shadow: 0 -10px 35px 15px white;
  transform: translateX(-50%);
  z-index: 2000;
}

.dayDetails {
  position: fixed;
  z-index: 1000;
  left: 50%;
  top: 50%;
  width: 95%;
  height: 100%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  transition: all .3s ease;
}

.dayDetails h4 {
  padding-top: 90px;
  text-align: initial;
  font-size: 18px;
  margin: 5px 20px 15px;
}

.dayDetails > div {
  position: relative;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 5px;
}

.dayDetails > div:last-of-type {
  margin-bottom: 50px;
}

.dayDetails > div > span:not(.dayDetails__label) {
  margin-left: 10px;
}

.dayDetails > div > p {
  margin: 5px 25px;
  font-size: 0.8rem;
  color: gray;
}

.dayDetails__label {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.dayDetails__event {
  cursor: pointer;
}

.dayDetails__event--focus {
  background-color: #f7f7f7;
  transition: all .3s;
  cursor: initial;
}

.dayDetails__closeEvent {
  position: absolute;
  right: 10px;
  top: 20px;
  font-size: 24px;
  line-height: 24px;
  color: #ed6d88;
  cursor: pointer;
  display: none;
}

.dayDetails__event--focus > .dayDetails__closeEvent {
  display: inline-block;
}

.close {
  position: fixed;
  color: #ed6d88;
  right: 20px;
  top: 18px;
  font-size: 35px;
  cursor: pointer;
  z-index: 2001;
}

.addEvent {
  position: fixed;
  display: inline-block;
  background-color: #51B562;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 35px;
  color: white;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px -2px #51B562;
  cursor: pointer;
  z-index: 2001;
}

.details-enter-active, .details-leave-active {
  transition: all .5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.details-enter, .details-leave-to {
  box-shadow: 0 30px 50px 15px #8d8d8d;
  transform: translateY(200px) scale(0.3);
  opacity: 0;
}

::-webkit-scrollbar {
  display: none;
}

@media screen and (min-width: 768px) and (orientation: portrait),
screen and (min-width: 1024px) {
  .dayDetails__container {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 50vh;
  }

  .header {
    position: relative;
    background-color: white;
    z-index: initial;
    width: 100%;
    box-shadow: 0 10px 35px 15px white;
    transform: translateX(-50%);
  }

  .dayDetails {
    position: initial;
    z-index: initial;
    width: 100%;
    max-height: 43vh;
    transform: none;
  }

  .dayDetails h4 {
    padding-top: 20px;
  }

  .close {
    position: absolute;
  }

  .addEvent {
    position: absolute;
  }

  .details-enter-active, .details-leave-active {
    transition: all .3s ease;
  }
  .details-enter, .details-leave-to {
    box-shadow: none;
    transform: translateY(0) scale(1);
    opacity: 0;
  }
}

@media screen and (min-width: 1024px) {
  .header {
    box-shadow: none;
  }

  .header::after {
    display: none;
  }

  .dayDetails__container {
    max-height: 100vh !important;
  }

  .dayDetails {
    max-height: 90vh;
  }

  .dayDetails__event {
    margin: 10px 20px !important;
  }
}
</style>
