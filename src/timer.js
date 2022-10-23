export class Timer {
  interval = null;
  constructor(callback) {
    this.total = 0;
    this.interval = null;
    this.callback = callback;
  }

  getIntervalState() {
    // console.log('_________interval', this.interval);
    return this.interval !== null;
  }

  clearCount() {
    clearInterval(this.interval);
    this.interval = null;
    this.total = 0;
    const time = this.getEndTime();
    // console.log('call', this.total);
    this.callback(time);
  }

  newTimer = () => {
    this.total = 0;
    this.interval = setInterval(this.count.bind(this), 1000);
    this.count();
  };

  fireCount = () => {
    this.count();
    this.interval = setInterval(this.count.bind(this), 1000);
    console.log('START');
  };

  startCount = () => {
    if (!this.interval) {
      this.fireCount();
    } else {
      console.log('STOP');
      this.stopCount();
    }
  };

  stopCount() {
    this.total !== 0 ? this.total : 0;
    clearInterval(this.interval);
    this.interval = null;
  }

  getTimerValue() {
    return {
      minutes: this.show(parseInt(this.total / 60)),
      seconds: this.show(this.total % 60),
    };
  }

  count() {
    const time = this.getEndTime();
    // console.log('call', this.total);
    this.callback(time);
    ++this.total;
  }

  getEndTime(shown = false) {
    const count = shown
      ? this.total > 0
        ? this.total - 1
        : this.total
      : this.total;
    return `${this.show(parseInt(count / 60))}:${this.show(count % 60)} `;
  }

  getTotal() {
    return this.total;
  }
  setTotal(count) {
    console.log('COUNT TIME ', count);
    this.total = count;
  }

  show(current) {
    const str = current + '';
    if (str.length < 2) {
      return '0' + str;
    } else {
      return str;
    }
  }
}

let seconds = document.querySelector('.seconds');
let minutes = document.querySelector('.minutes');
let hours = document.querySelector('.hours');
let total = 0;

let interval = null;

export function getIntervalState() {
  return interval;
}

export function clearCount() {
  clearInterval(interval);
  interval = null;
  seconds.innerHTML = '00';
  minutes.innerHTML = '00';
  hours.innerHTML = '00';
  total = 0;
}

export function newTimer() {
  total = 0;
  interval = setInterval(count, 1000);
  count();
}

export function startCount() {
  if (!interval) {
    interval = setInterval(count, 1000);
    count();
    console.log('START');
  } else {
    console.log('STOP');
    stopCount();
  }
}

export function stopCount() {
  total !== 0 ? total-- : 0;
  clearInterval(interval);
  interval = null;
}

export function getTimerValue() {
  return {
    seconds: seconds.innerHTML,
    minutes: minutes.innerHTML,
    hours: hours.innerHTML,
  };
}

function count() {
  seconds.innerHTML = show(total % 60);
  minutes.innerHTML = show(parseInt(total / 60));
  hours.innerHTML = show(parseInt(total / 3600));
  total++;
}

export function getEndTime() {
  return `${show(parseInt(total / 3600))}:${show(parseInt(total / 60))}:${show(
    total % 60
  )} `;
}
export function getTotal() {
  return total;
}

function show(current) {
  const str = current + '';
  if (str.length < 2) {
    return '0' + str;
  } else {
    return str;
  }
}
