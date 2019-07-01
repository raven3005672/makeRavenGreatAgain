// Object.assign原理及其实现
// 浅拷贝Object.assign
// 主要是讲所有可枚举属性的值从一个或多个源对象复制到目标对象，同时返回目标对象。
Object.assign(target, ...sources);
// 其中target是目标对象，sources是源对象，可以有多个，返回修改后的目标对象target。
// 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后来的源对象的属性将类似地覆盖早先的属性。

// Object.assign的模拟实现
// 大致思路如下：
// 1.判断原生Object是否支持该函数，如果不存在的话创建一个函数assign，并使用Object.defineProperty将该函数绑定到Object上。
// 2.判断参数是否正确（目标对象不能为空，我们可以直接设置{}传递进去，但是必须设置值）。
// 3.使用Object()转成对象，并保存为to，最后返回这个对象to。
// 4.使用for...in循环遍历出所有可枚举的自有属性。并复制给新的目标对象（使用hasOwnProperty获取自有属性，即非原型链上的属性）

// 实现代码如下，这里为了验证方便，使用assign2代替assign。注意此模拟实现不支持symbol属性，因为ES5中根本没有symbol
if (typeof Object.assign2 != 'function') {
    Object.defineProperty(Object, 'assign2', {
        value: function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
            }
            return to;
        },
        enumerable: false,
        writable: true,
        configurable: true
    });
}
// 注意1：可枚举性
// 原生挂载的属性不可枚举
// 可以使用Object.getOwnPropertyDescriptor或者Object.propertyIsEnumerable查看是否可枚举
Object.getOwnPropertyDescriptor(Object, 'assign');
Object.propertyIsEnumerable('assign');
// 注意2：判断参数是否正确
// 注意3：原始类型被包装为对象
// 注意4：存在性
// in操作符会检查属性是否在对象及其[[Prototype]]原型链中
// hasOwnProperty只会检查属性是否在myObject对象中，不会检查[[Prototype]]原型链













