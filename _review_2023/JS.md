# JS

## 构造函数ES5

```js
function Example(name) {
  'use strict';
  if (!new.target) {
    throw new TypeError('Class constructor cannot be invoked without new');
  }
  this.name = name;
}
Object.defineProperty(Example.prototype, 'init', {
  enumerable: false,
  value: function() {
    'use strict';
    if (new.target) {
      throw new TypeError('init is not a constructor');
    }
    var fun = function() {
      console.log(this.name);
    }
    fun.call(this);
  }
})
```

- new.target用来判断调用方式，必须用 new 调用
- es6的class所有代码处于严格模式
- es6中的原型方法不可被枚举
- 原型上的方法不允许通过new调用

## 说出代码结果

需要注意的点

- let 没有变量提升
- 同步 => 微任务 => 宏任务
- || 运算符只要有一个为真后面的直接短路不需要计算
- 1+'2' => "12", 1-'2' => -1
- var会提前声明变量，function会提升并定义

## 事件循环

浏览器：
宏任务：setTimeout、setInterval、setImmediate、script、IO、UI，postMessage
微任务：process.nextTick、Promise.then()、MutationObserver，requestAnimationFrame，requestIdleCallback

node：
timers - setTimeout、setInterval
IO callbacks
idle/prepare
poll
check - setImmediate
close callbacks

## 箭头函数

- 没有自己的this，arguments，super
- this只会从自己的作用域链的上一层继承this

arguments是实参

## new操作符做了什么

- 创建一个空对象obj
- 将该对象 obj 的原型链 __proto__ 指向构造函数的原型 prototype，
    并且在原型链 __proto__ 上设置 构造函数 constructor 为要实例化的 Fn
- 执行构造函数方法，属性和方法被添加到this引用的对象中
- 如果构造函数没有返回其他对象，那么返回 obj ，否则返回构造函数中返回的对象

```js
function newSelf(func) {
  let target = {};
  res.__proto__ = func.prototype;
  res.__proto__.constructor = func;
  let args = Array.prototype.slice.call(arguments, 1);
  let result = func.apply(target, args);
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result;
  }
  return target;
}
```

## bind/call/apply

- call(obj, arg1, arg2, ...) 直接调用
- apply(obj, [argsArray]) 直接调用
- bind(obj) 创建出新函数

## 柯里化

```js
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, [...args, ...args2])
      }
    }
  }
}
```

## 作用域与作用域链、闭包

一个函数和对其周围状态（词法环境）的引用捆绑在一起的组合。
闭包的作用域链会引用包含它的函数的活动对象，导致这些活动对象不会被销毁，内存溢出。

## 判断变量类型

基础类型：栈
引用类型：堆

基础类型：typeof data
引用类型：Object.prototype.toString.call(data);

## 原型与原型链

每个对象都有一个 __proto__ 属性，该属性指向自己的原型对象
每个构造函数都有一个 prototype 属性，该属性指向实例对象的原型对象
原型对象里的 constructor 指向构造函数本身

## 判断数组或对象

arr instanceof Array
arr.constructor === Array
Object.prototype.toString.call(arr)
Array.isArray(arr)

## instanceof、typeof

instanceof
检测一个对象是否为某个构造函数的实例
基于原型链检查，即B的prototype是否在A的__proto__原型链上

```js
// 传入参数左侧为实例L, 右侧为构造函数R
function my_instanceof(L,R){
    // 处理边界：检测实例类型是否为原始类型
    const baseTypes = ['string','number','boolean','symbol','undefined'];
​
    if(baseTypes.includes(typeof L) || L === null) return false;
​
    // 分别取传入参数的原型
    let Lp = L.__proto__;
    let Rp = R.prototype; // 函数才拥有prototype属性
​
    // 判断原型
    while(true){
        if(Lp === null) return false;
        if(Lp === Rp) return true;
        Lp = Lp.__proto__;
    }
}
```

typeof
返回数据类型number、boolean、symbol、string、object、undefined、function

## Object.assign

把任意多个源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。是浅拷贝。

## 内存泄露

- 新生代
  - from - to
- 老生代
  - 标记清除

标记-清除、引用-计数

## weakMap，weakSet

键必须是对象类型（现在好像改了），不可枚举，容易被回收

## 组合继承

```js
function Parent() {
  this.name = 'aaa',
  this.play = []
}
function Child() {
  P.call(this);
  this.type = 'child'
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child;
```

## 防抖节流

- 防抖，短时间多次触发，只响应最后一次
- 节流，连续触发，在n秒内只执行一次

```js
function debounce(func, wait) {
  let timer = null;
  return function(...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, wait);
  }
}
function throttle(func, wait) {
  let context, args;
  let previous = 0;
  return function() {
    let now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}
```

## esm、commonjs

commonjs是值的拷贝，可以重新赋值，不影响原值
esm是动态引用，不能重新赋值

## 纯函数

输入输出稳定，没有副作用。不会修改外部状态

函数式编程、无状态组件、redux

## sleep

```js
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}
```

## proxy

```js
const model = document.getElementById("model")
const word = document.getElementById("word")
var obj= {};
const newObj = new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log('setting',target, key, value, receiver);
      if (key === "text") {
        model.value = value;
        word.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    }
  });

model.addEventListener("keyup",function(e){
  newObj.text = e.target.value
})
```

defineProperty只能劫持对象的属性，需要对每个属性进行遍历；proxy直接监听对象。
defineProperty无法监控到数组下标的变化；proxy可以。

## promise

```js
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() => {
  console.log(6);
})
```

0 1 2 3 4 5 6

如果没有return那一行的话是0 1 'res' 2 3 5 6

## dfs/bfs

```js
function dfs(node) {
  if (node == null) return;
  console.log(node.value);
  dfs(node.left);
  dfs(node.right);
}

// 广度优先遍历
function bfs(node) {
  const queue = [node];
  while (queue.length) {
    const curr = queue.shift();
    console.log(curr.value);
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }
}
```