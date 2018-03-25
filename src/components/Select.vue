<template>
  <div @click="toogleSelectMode" class="select">
    <div :class="{selectBackground: selectMode}"></div>

    <div class="elemList" v-if="listMode">
      <div v-for="(item, index) in data" :key="index">
        <transition name="fade">
          <div :class="{active: currValue === index, item}"
            :style="{color: item}"
            v-if="index === currValue || selectMode === true"
            @click="selectMode && select(index)"
          >{{item}}</div>
        </transition>
      </div>
    </div>

    <div class="elemList" v-if="colorPicker">
      <div v-for="(item, index) in data" :key="index">
        <transition name="fade">
          <div :class="{active: currValue === index, colorCircle: true}"
            :style="{backgroundColor: item}"
            v-if="index === currValue || selectMode === true"
            @click="selectMode && select(index)"
          ></div>
        </transition>
      </div>
    </div>

    <div v-if="infiniteScroll" :class="{open: selectMode, infiniteScroll}" @scroll="loadMore">
      <div v-for="(value, index) in infiniteDataNumbers" :key="index"
         :class="{active: value === currValue, current: !selectMode}"
         v-if="value === currValue || selectMode === true"
         @click="select(value)"
      >
        {{value}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: [
    'infiniteScroll', // Comnponent mode
    'colorPicker', // Comnponent mode
    'listMode', // Comnponent mode
    'data', // Data to be rendered which user choose from
    'currValue', // Current choosen value - initial
    'select', // Function from parent - when user choose some value call it
    'step', // In infinite scroll mode - how many new values we append on scroll
  ],
  data() {
    return {
      selectMode: false,
      infiniteDataNumbers: [],
      current: this.currValue,
      previousScroll: 0,
      loadFlag: false,
    };
  },
  // Add initial data for infinite scoll picker
  beforeMount() {
    if (this.infiniteScroll) {
      const lowerThanCurrent = [...Array(19)]
        .map((value, index) => this.currValue - index - 1)
        .reverse();

      this.infiniteDataNumbers = [...lowerThanCurrent, ...[...Array(20)]
        .map((value, index) => this.currValue + index)];
    }
  },
  // On click component - show or chide select mode
  methods: {
    toogleSelectMode() {
      this.selectMode = !this.selectMode;

      // If picker is infinite scroll - scroll into view initial selected value
      if (this.selectMode) {
        setTimeout(() => {
          this.$el.querySelector('.active').scrollIntoView({});
        }, 10);
      }
    },
    // Load more data for infinite picker
    loadMore(e) {
      const containerMiddle = (e.target.clientHeight / 2) + e.target.getBoundingClientRect().top;
      const containerScrollHeight = e.target.scrollHeight;
      const containerHeight = e.target.clientHeight;
      const childHeight = e.target.childNodes[0].clientHeight;
      const containerScrollTop = e.target.scrollTop;

      this.activeClass(e.target.childNodes, containerMiddle);

      // Handle scroll direction - load data lower than current or higher
      if (containerScrollTop <= 20 && containerScrollTop < this.previousScroll) {
        this.addData('up');
        // When we append data lower than current - change position in scroll component to previous
        // Which was before mounting new data
        e.target.scrollTop = (childHeight * this.step) + this.previousScroll;
      }
      if (containerScrollHeight <= containerScrollTop + containerHeight + 20) {
        this.addData('down');
      }

      this.previousScroll = e.target.scrollTop;
    },
    // Add active class to element on the middle of component
    activeClass(nodes, containerMiddle) {
      nodes.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.clientHeight;
        element.classList.remove('active');

        if (elementTop <= containerMiddle && elementTop + elementHeight > containerMiddle) {
          element.classList.add('active');
        }
      });
    },
    // Create values to be added and add them to aray which is rendered to view
    addData(operator) {
      if (operator === 'up') {
        const newValues = [...Array(this.step)]
          .map((value, index) => this.infiniteDataNumbers[0] - index - 1)
          .reverse();

        this.infiniteDataNumbers.unshift(...newValues);
      } else if (operator === 'down') {
        const addValues = [...Array(this.step)]
          .map((value, index) => (
            this.infiniteDataNumbers[this.infiniteDataNumbers.length - 1] + index + 1
          ));

        this.infiniteDataNumbers.push(...addValues);
      }
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 0;
}

::-webkit-scrollbar-track-piece {
    background-color: transparent;
    border-radius: 6px;
    width: 0;
}

.select {
  width: 100%;
  display: flex;
  justify-content: center;
}

.active,
.currValue {
  font-size: 30px;
  color: #51B562;
}

.elemList {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  text-align: center;
  z-index: 300;
  position: absolute;
}

.item {
  padding: 3px 0;
}

.colorCircle {
  position: relative;
  height: 25px;
  transition: all .3s;
}

.colorCircle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: inherit;
  border-radius: 50%;
}

.fade-enter-active, .fade-leave-active {
  height: 30px;
  padding: 3px 0;
  transition: all .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  padding: 0;
  height: 0;
}

.infiniteScroll.open {
  height: 95vh;
  position: fixed;
  z-index: 30;
}

.selectBackground {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(255, 255, 255, 0.8);
  top: 0;
  left: 0;
  z-index: 10;
}

.infiniteScroll {
  height: auto;
  width: 80px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 300;
  text-align: center;
}

.infiniteScroll > div {
  height: 30px;
  padding: 3px 0;
  transition: all 0.1s;
}

.middle {
  color: #51B562;
  font-size: 24px;
}
</style>
