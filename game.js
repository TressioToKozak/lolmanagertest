window.gameClock = {
  day: 1,
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
  },
  nextDay() {
    this.day += 1;
    this.listeners.forEach((listener) => listener(this.day));
  },
};
