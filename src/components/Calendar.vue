<template>
  <div class="main">
    <div>
      <div class="calendar__header">
        <span class="calendar__arrow" @click="monthByOne(-1)"><i class="left"></i></span>

        <select-component
          :listMode="true"
          :data="calendar.months"
          :currValue="this.calendar.month"
          :select="chooseMonth"
        ></select-component>

        <select-component
          :infiniteScroll="true"
          :currValue="this.calendar.year"
          :select="chooseYear"
          :step="5"
        ></select-component>

        <span class="calendar__arrow" @click="monthByOne(1)"><i class="right"></i></span>
      </div>

      <div class="calendar">
        <div class="calendar__row calendar__row--names">
          <div v-for="day in calendar.weekDays" :key="day">
            {{day}}
          </div>
        </div>
        <div class="calendar__row" v-for="(week, i) in calendar.currMonth" :key="i">
          <Day v-for="day in week" :key="day.day" :day="day"
            :class="{ otherMonth: day.month !== calendar.month, weekend: day.weekDay >= 5 }"
          ></Day>
        </div>
      </div>
    </div>

    <div class="calendar__details">
      <day-details v-if="selectedDay" :day="selectedDay" :events="events" />
      <add-event />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Day from './Day';
import SelectComponent from './Select';
import DayDetails from './DayDetails';
import AddEvent from './AddEvent';

export default {
  name: 'Calendar',
  components: {
    Day,
    SelectComponent,
    DayDetails,
    AddEvent,
  },
  computed: {
    ...mapGetters({
      calendar: 'getCalendar',
      selectedDay: 'getSelectedDay',
    }),
    events() {
      return this.$store.getters.getEventByDay(this.selectedDay);
    },
  },
  methods: {
    ...mapActions([
      'initToday',
      'initCalendar',
    ]),
    // Handle change month by clicking on lefr/right arrows
    monthByOne(value) {
      let { year, month } = this.calendar;

      if (month === 0 && value < 0) {
        month = 11;
        year -= 1;
      } else if (month === 11 && value > 0) {
        month = 0;
        year += 1;
      } else {
        month += value;
      }

      this.initCalendar({ year, month });
    },
    // Close month picker component, init calendar with picked month
    chooseMonth(value) {
      this.initCalendar({ year: this.calendar.year, month: value });
    },
    // Close year picker component, init calendar with picked year
    chooseYear(value) {
      this.initCalendar({ year: value, month: this.calendar.month });
    },
  },
  created() {
    this.initToday();
    this.initCalendar();
  },
};
</script>

<style>
.main {
  display: grid;
  grid-template-rows: 100px auto;
  grid-template-columns: 96vw;
}

.calendar__header {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 0.5fr 0.5fr;
  align-content: center;
  justify-items: center;
  font-size: 25px;
  height: 100px;
}

.calendar__header > div {
  height: 40px;
}

.calendar__arrow {
  cursor: pointer;
  font-size: 30px;
}

.calendar__arrow > i {
  border: solid black;
  border-width: 0 3px 3px 0;
  border-radius: 2px;
  display: inline-block;
  padding: 6px;
  transition: transform .2s;
}

.right {
  transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
}

.calendar__arrow:active > .left,
.calendar__arrow:focus > .left {
  transform: rotate(135deg) translate(3px, -3px);
}

.calendar__arrow:active > .right,
.calendar__arrow:focus > .right {
  transform: rotate(-45deg) translate(-3px, 3px);
}

.calendar__row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.calendar__row--names {
  font-size: 0.6rem;
  color: #8a8a8a;
  padding-bottom: 5px;
}

.otherMonth {
  color: #d4d4d4;
}

.weekend {
  background-color: #f7f7f7;
}

.calendar__details {
  display: flex;
  width: 100%;
}

.select {
  cursor: pointer;
}

@media screen and (min-width: 768px) and (orientation: portrait) {
  .main {
    height: 100vh;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content 1fr;
  }

  .main > div:first-of-type {
    grid-column: 1/-1;
  }

  .calendar__details {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .dayDetails__container {
    grid-column: 1/2;
  }

  .addEvent {
    grid-column: 2/3;
  }
}

@media screen and (min-width: 1024px) and (orientation: landscape) {
  .main {
    max-width: 1140px;
    max-height: 1200px;
    margin: 0 auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
  }

  .calendar__row:not(.calendar__row--names) {
    grid-template-rows: minmax(50px, 100px);
  }

  .calendar__details {
    grid-column: 2/-1;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .dayDetails__container {
    grid-column: 1/2;
  }

  .addEvent {
    grid-column: 2/3;
  }
}
</style>
