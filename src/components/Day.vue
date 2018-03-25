<template>
  <div
    :class="[day, { selected: day === selectedDay, today: day.today }]"
    @click="selectDay(day)"
  >
    <span>{{day.day}}</span>
    <div class="events_circles" v-if="events">
      <span v-if="events.length > 0" v-for="event in events.slice(0, 5)" :key="event.id"
        :style="{ backgroundColor: event.labelColor }"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Day',
  props: ['day'], // Day object
  computed: {
    ...mapGetters({
      selectedDay: 'getSelectedDay',
    }),
    events() {
      return this.$store.getters.getEventByDay(this.day);
    },
  },
  methods: {
    ...mapActions([
      'selectDay',
    ]),
  },
};
</script>

<style scoped>
.day {
  height: calc(100vw/7);
  max-height: 80px;
  min-height: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.selected span,
.today span {
  color: #f7f7f7;
  z-index: 3;
}

.today::after,
.selected::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  z-index: 2;
}

.today::after {
  background-color: #51B562;
  box-shadow: 0 5px 12px -4px #51B562;
}

.selected::after {
  background-color: #124559;
  box-shadow: 0 5px 12px -4px #124559;
}

.events_circles {
  position: absolute;
  top: 53%;
  z-index: 4;
}

.events_circles span {
  display: inline-block;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  margin: 0 2px;
}

@media screen and (min-width: 480px) {
  .today::after,
  .selected::after {
    width: 50px;
    height: 50px;
  }
}

@media screen and (min-width: 480px) and (orientation: landscape) {
  .day {
    height: calc(100vw/10);
  }
}

@media screen and (min-width: 768px) and (orientation: portrait) {
  .today::after,
  .selected::after {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  span {
    font-size: 1.3rem;
  }
}

@media screen and (min-width: 1024px) {
  .day {
    max-height: initial;
  }

  .today::after,
  .selected::after {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  span {
    font-size: 1.3rem;
  }
}
</style>
