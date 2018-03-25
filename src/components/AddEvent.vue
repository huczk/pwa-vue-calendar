<template>
<transition name="event">
  <div v-if="getForm.show" class="addEvent">
    <span class="close" @click="closeForm()">&times;</span>
    <div class="addEvent__form" role="form" aria-labelledby="newEvent">
      <legend aria-label="newEvent">
        <h3>New Event</h3>
        <span>{{getForm.day.day}}</span>
        <span>{{getMonthsNames[getForm.day.month]}}</span>
        <span>{{getForm.day.year}}</span>
      </legend>
      <div>
        <input id="name" v-model="name" :class="{hasValue: name}" @change="isEmpty()">
        <label for="name">Title:</label>
      </div>
      <div>
        <textarea id="description" v-model="description"
          :class="{hasValue: description}" @change="isEmpty()"></textarea>
        <label for="description">Description:</label>
      </div>
      <div>
        <input type="checkbox" id="allDay" v-model="allDay" @change="isEmpty()">
        <label for="allDay">All day</label>
      </div>
      <div v-if="!allDay">
        <input type="time" id="time" v-model="time" :class="{hasValue: time}" @select="isEmpty()">
        <label for="time">Time:</label>
      </div>
      <div class="addEvent__pickerContainer">
        <select-component
          :infiniteScroll="false"
          :data="colors"
          :currValue="this.color"
          :select="selectColor"
          :colorPicker="true"
          class="addEvent__pickerComponent"
        ></select-component>
        <span>Label color</span>
      </div>
      <span class="addEvent__error">{{error}}</span>
      <button
        @click="submitEvent()"
      >Add</button>
    </div>
  </div>
</transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SelectComponent from './Select';

export default {
  name: 'AddEvent',
  components: {
    SelectComponent,
  },
  data() {
    return {
      name: '',
      description: '',
      allDay: false,
      time: '',
      color: 1,
      colors: ['#EEC643', '#71F79F', '#D7263D', '#0D3B66'],
      error: '',
    };
  },
  computed: {
    ...mapGetters([
      'getForm',
      'getMonthsNames',
    ]),
  },
  methods: {
    ...mapActions([
      'closeForm',
      'addEvent',
      'initCalendar',
      'selectDay',
    ]),
    selectColor(color) {
      this.color = color;
    },
    // If some fields are empty - show errors, else - submit event
    submitEvent() {
      if (!this.name || !this.description || (!this.allDay && !this.time)) {
        this.error = 'Please fill title, description fields and set time';
        return;
      }
      this.error = '';

      this.addEvent({
        details: {
          name: this.name,
          description: this.description,
          allDay: this.allDay,
          time: this.allDay ? '' : this.time,
          labelColor: this.colors[this.color],
        },
        day: this.getForm.day,
      });

      this.name = '';
      this.description = '';
      this.time = '';

      // Close event form and init calendar with new event
      this.initCalendar();
      this.closeForm();
    },
    // Handle showing error on inputs change
    isEmpty() {
      if (this.name && this.description && (!this.allDay && !this.time)) {
        this.error = '';
      }
    },
  },
};
</script>

<style scoped>
.addEvent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: white;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 35px;
  cursor: pointer;
  color: #ed6d88;
}

.addEvent__form {
  min-height: 95%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 20px 20px;
}

legend {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  padding-top: 10px;
  margin: 20px 0 15px;
}

legend > span {
  color: #8d8d8d;
}

.addEvent__form > div {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  color: #8d8d8d;
}

.addEvent__form input:not([type="checkbox"]):not(.hasValue) + label {
  transition: .3s;
  transform: translate(10px, -40px);
}

.addEvent__form input:not(:focus):not(.hasValue)::-webkit-datetime-edit-hour-field,
.addEvent__form input:not(:focus):not(.hasValue)::-webkit-datetime-edit-minute-field,
.addEvent__form input:not(:focus):not(.hasValue)::-webkit-datetime-edit-text {
  color: transparent;
}

.addEvent__form textarea:not(.hasValue) + label {
  transition: .3s;
  transform: translate(10px, -100px);
}

.addEvent__form input:focus,
.addEvent__form textarea:focus {
  outline: none;
}

.addEvent__form input:not([type="checkbox"]):focus + label {
  color: #51B562;
  transform: translate(0px, -80px);
}

.addEvent__form textarea:focus + label {
  color: #51B562;
  transform: translate(0px, -140px);
}

.addEvent__form textarea.hasValue + label {
  transform: translate(0px, -140px);
}

.addEvent__form input.hasValue + label {
  transform: translate(0px, -80px);
}

.addEvent__form input,
.addEvent__form textarea {
  display: block;
  height: 40px;
  border: none;
  background-color: #f7f7f7;
  border-radius: 5px;
  margin: 5px 0 10px;
  padding: 0 10px;
  font-family: 'Roboto';
  font-size: 1rem;
  -webkit-appearance: none;
  color: #8d8d8d;
}

.addEvent__form input:disabled {
  background-color: 8d8d8d;
}

.addEvent__form textarea {
  height: 80px;
  padding: 10px;
}

.addEvent__form button {
  background-color: #51B562;
  color: white;
  font-size: 18px;
  border: none;
  height: 40px;
  cursor: pointer;
  border-radius: 5px;
}

[type="checkbox"]:checked,
[type="checkbox"]:not(:checked) {
  position: absolute;
  left: -9999px;
}

[type="checkbox"]:checked + label,
[type="checkbox"]:not(:checked) + label {
  position: relative;
  cursor: pointer;
  line-height: 20px;
  padding-left: 30px;
  margin-bottom: 20px;
  display: inline-block;
  color: #8d8d8d;
}

[type="checkbox"]:checked + label:before,
[type="checkbox"]:not(:checked) + label:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #f7f7f7;
}

[type="checkbox"]:checked + label:after,
[type="checkbox"]:not(:checked) + label:after {
  content: '';
  width: 14px;
  height: 14px;
  background: #51B562;
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

[type="checkbox"]:not(:checked) + label:after {
  opacity: 0;
  transform: scale(0);
}

[type="checkbox"]:checked + label:after {
  opacity: 1;
  transform: scale(1);
}

.addEvent__error {
  color: #ed6d88;
  margin-bottom: 10px;
}

.addEvent__pickerContainer {
  height: 40px;
}

.addEvent__pickerContainer span {
  margin-left: 30px;
}

.addEvent__pickerComponent {
  display: initial;
  width: initial;
  cursor: pointer;
  margin-top: -10px;
}

.event-enter-active, .event-leave-active {
  transition: all .5s cubic-bezier(0.23, 1, 0.32, 1);
}

.event-enter, .event-leave-to {
  transform: translatex(100%);
  border: 1px solid #8d8d8d;
}

::-webkit-scrollbar {
  display: none;
}

@media screen and (min-width: 768px) and (orientation: portrait),
screen and (min-width: 1024px) {
  .addEvent {
    position: relative;
    z-index: initial;
    max-height: 50vh;
  }

  .addEvent__form {
    min-height: 90%;
    justify-content: initial;
  }

  .event-enter-active, .event-leave-active {
    transition: all .3s ease;
  }

  .event-enter, .event-leave-to {
    box-shadow: none;
    transform: translateY(0) scale(1);
    opacity: 0;
  }
}

@media screen and (min-width: 1024px) {
  .addEvent {
    max-height: 100vh !important;
  }
}
</style>
