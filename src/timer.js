let seconds = document.querySelector('.seconds');
let minutes = document.querySelector('.minutes');
let hours = document.querySelector('.hours');
let total = 0;

let interval;

export function clearCount() {
  clearInterval(interval);
  interval = null;
  seconds.innerHTML = '00';
  minutes.innerHTML = '00';
  hours.innerHTML = '00';
  total = 0;
}

export function startCount() {
  if (!interval) {
    interval = setInterval(count, 1000);
    count();
  } else {
    clearCount();
    interval = setInterval(count, 1000);
    count();
  }
}

export function getTimerValue(params) {
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
  ++total;
}

function show(current) {
  const str = current + '';
  if (str.length < 2) {
    return '0' + str;
  } else {
    return str;
  }
}
