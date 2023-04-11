Array.prototype.reduce2 = function(callback, initValue) {
  if (typeof callback !== 'function') {
    throw `${callback} is not a function`;
  }
  let pre = initValue;
  let i = 0;
  const length = this.length;
  if (typeof pre === 'undefined') {
    pre = this[0];
    i = 1;
  }
  while (i < length) {
    if (i in this) {
      pre = callback(pre, this[i], i, this);
    }
    i++;
  }
  return pre;
}