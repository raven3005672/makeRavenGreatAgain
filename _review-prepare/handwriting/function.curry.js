function curry(func, ...args) {
  const fnLen = func.length;
  return function(...innerArgs) {
    innerArgs = args.concat(innerArgs);
    if (innerArgs.length < fnLen) {
      return curry.call(this, func, ...innerArgs);
    } else {
      return func.apply(this, innerArgs);
    }
  }
}