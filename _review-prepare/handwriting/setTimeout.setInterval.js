// setTimeout模拟setInterval
const simulateSetInterval = (func, timeout) => {
  let timer = null;
  const interval = () => {
    timer = setTimeout(() => {
      func();
      interval();
    }, timeout);
  }
  interval();
  return () => clearInterval(timer);
}


// setInterval模拟setTimeout
const simulateSetTimeout = (func, timeout) => {
  let timer = null;
  timer = setInterval(() => {
    clearInterval(timer);
    func();
  }, timeout);
  return () => clearInterval(timer);
}