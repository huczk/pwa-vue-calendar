<template>
  <div id="app">
    <Calendar />
  </div>
</template>

<script>
import Calendar from './components/Calendar';

export default {
  name: 'App',
  components: {
    Calendar,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');

#app {
  font-family: 'Roboto', sans-serif;
  color: #394053;
}
</style>
