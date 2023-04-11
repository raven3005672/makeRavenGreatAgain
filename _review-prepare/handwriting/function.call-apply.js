// call 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。 所以关键点是指定的this和一个或者多个参数,只要了解了this的基本用法，实现起来就简单多了。

Function.prototype.myCall = function (ctx, ...args) {
  // 简单处理未传ctx上下文，或者传的是null和undefined等场景
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }
  // 暴力处理 ctx有可能传非对象
  ctx = Object(ctx);
  // 用Symbol生成唯一的key
  const fnName = Symbol();
  // 这里的this，即要调用的函数
  ctx[fnName] = this;
  // 将args展开，并且调用fnName函数，此时fnName函数内部的this也就是ctx了
  const result = ctx[fnName](...args)
  // 用完之后，将fnName从上下文ctx中删除
  delete ctx[fnName];

  return result;
}

// call 方法接受的是一个参数列表，而 apply 方法接受的是一个包含多个参数的数组。

Function.prototype.myCall = function (ctx, args) {
  if (!ctx) {
    ctx = typeof window !== 'undefined' ? window : global;
  }

  ctx = Object(ctx);

  const fnName = Symbol()

  ctx[fnName] = this;
  // 将args参数数组，展开为多个参数，供函数调用
  const result = ctx[fnName](...args);

  delete ctx[fnName];

  return result;
}