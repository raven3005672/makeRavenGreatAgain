const fib = (n) => {
  if (typeof fib[n] !== 'undefined') {
    return fib[n];
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }
  const res = fib(n - 2) + fib(n - 1);
  fib[n] = res;
  return res;
}