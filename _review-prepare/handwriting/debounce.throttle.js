// 防抖
const debounce = function (func, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}

// 节流：指定时间间隔内只会触发一次
const throttle1 = function (func, delay) {
  let startTime = Date.now();
  return function (...args) {
    let lastTime = Date.now();
    if (lastTime - startTime > delay) {
      func.apply(this, args);
      startTime = Date.now();
    }
  }
}

const throttle2 = function (func, delay) {
  let timer = null

  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}
