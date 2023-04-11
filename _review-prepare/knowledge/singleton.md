```js
function Person() {}

/**
 * constructor: 将需要单例的类 通过参数传递
 */
const singleton = function(constructor) {
  let singleInstance;
  let singleConstructor = function() {
    // 第一次实例化时
    if (!singleInstance) {
      constructor.apply(this, arguments);
      singleInstance = this;
    }
    // 直接返回
    return singleInstance;
  };
  singleConstructor.prototype = Object.create(constructor.prototype);
  return singleConstructor;
};

const createPerson = singleton(Person);
const p = new createPerson();
const p2 = new createPerson();

console.log(p === p2);  // true
```