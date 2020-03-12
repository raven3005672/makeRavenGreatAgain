# JS原理相关

## new的实现原理是什么

1. 创建一个空对象obj
2. 将该对象 obj 的原型链 __proto__ 指向构造函数的原型 prototype，
    并且在原型链 __proto__ 上设置 构造函数 constructor 为要实例化的 Fn
3. 执行构造函数方法，属性和方法被添加到this引用的对象中
4. 如果构造函数没有返回其他对象，那么返回 obj ，否则返回构造函数中返回的对象

```js
function _new(Fn) {
    let target = {};
    // let [constructor, ...args] = [...arguments];
    // target.__proto__ = constructor.prototype;
    target.__proto__ = Fn.prototype;
    target.__proto__.constructor = Fn;
    let args = Array.prototype.slice.call(arguments, 1);
    let result = Fn.apply(target, args);
    if (result && (typeof result == 'object' || typeof result == 'function')) {
        return result;
    }
    return target;
}
```