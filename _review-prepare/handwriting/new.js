// 创建一个空的简单JavaScript对象（即 {} ）；
// 为步骤1新创建的对象添加属性 proto ，将该属性链接至构造函数的原型对象
// 将步骤1新创建的对象作为this的上下文,执行该函数 ；
// 如果该函数没有返回对象，则返回this。

const _new = function(func, ...args) {
  let obj = Object.create(func.prototype);
  let result = func.apply(obj, args);
  if (typeof result === 'object' && result !== null || typeof result === 'function') {
    return result;
  } else {
    return obj;
  }
}