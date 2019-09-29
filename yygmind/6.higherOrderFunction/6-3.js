Array.prototype.map
// 完整的结构是Array.prototype.map(callbackfn[, thisArg]), map函数接受两个参数，一个是必填项回调函数，另一个是可选项callbackfn函数执行时的this值。
// map方法的主要功能就是把原数组中的每个元素按顺序执行一次callbackfn函数，并且把所有返回的结果组合在一起生成一个新的数组，map方法的返回值就是这个新数组。
// 模拟实现
Array.prototype.map = function(callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
        throw new TypeError('Cannot read property "map" of null or undefined');
    }
    // step 1. 转成数组对象，有length属性和k-v键值对
    let O = Object(this);
    // step 2. 无符号右移0位，左侧用0填充，结果非负
    let len = O.length >>> 0;
    // step 3. callbackfn不是函数时抛出异常
    if (typeof callbackfn !== 'function') {
        throw new TypeError(callbackfn + ' is not a function');
    }
    // step 4.
    let T = thisArg;
    // step 5.
    let A = new Array(len);
    // step 6.
    let k = 0;
    // step 7.
    while (k < len) {
        // Step 7.1/7.2/7.3
        // 检查O机器原型链是否包含属性k
        if (k in O) {
            // step 7.3.1
            let kValue = O[k];
            // step 7.3.2
            // 传入this，当前元素element，索引index，原数组对象O
            let mappedValue = callbackfn.call(T, kValue, k, O);
            // step 7.3.3 返回结果赋值给新生成数组
            A[k] = mappedValue;
        }
        // step 7.4
        k++;
    }
    // step 7.5 返回新数组
    return A;
}

// 核心就是在一个while循环中执行callbackfn，并传入4个参数，回调函数具体的执行逻辑这里并不关心，只需要拿到返回结果并赋值给新数组就好了。
// 只有O机器原型链上包含属性k时才会执行callbackfn函数，所以对于稀疏数组empty元素或者使用delete删除后的索引则不会被调用
let arr = [1, , 3, , 5]
console.log(0 in arr) // true
delete arr[0]
console.log(0 in arr) // false
console.log(arr) // [empty × 2, 3, empty, 5]
arr.map(ele => {
  console.log(ele) // 3, 5
})
// map并不会修改原数组，不过也不是绝对的，如果你在callbackfn中修改了原数组，那还是会改变。并且有可能影响到map自身的执行。
// 原数组新增元素：因为map第一次执行时length已经确定了，所以不影响。
// 原数组修改元素：传递给callbackfn的元素时map遍历到它们那一瞬间的值，所以可能受影响
//      修改当前索引之前的元素，不受影响
//      修改当前索引之后的元素，受影响
// 原数组删除元素：被删除的元素无法被访问到，所以可能受影响
//      删除当前索引之前的元素，已经访问过了，所以不受影响
//      删除当前索引之后的元素，受影响

// 例子
// 1、原数组新增元素，不受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  array.push(4);
  return ele * 2
})
console.log(result) 
// 2, 4, 6
// ----------- 完美分割线 -----------
// 2、原数组修改当前索引之前的元素，不受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  if (index === 1) {
    array[0] = 4
  }
  return ele * 2
})
console.log(result) 
// 2, 4, 6
// ----------- 完美分割线 -----------
// 3、原数组修改当前索引之后的元素，受影响
let arr = [1, 2, 3]
let result = arr.map((ele, index, array) => {
  if (index === 1) {
    array[2] = 4
  }
  return ele * 2
})
console.log(result) 
// 2, 4, 8

// 源码中callbackfn.call(T, kValue, k, O)，其中T就是thisArg值，如果没有设置，那就是undefined。
// 对于call方法，传入undefined时，非严格模式下指向window，严格模式下为undefined。记住这时候回调函数不能用箭头函数，因为箭头函数是没有自己的this的。

// 1、传入 thisArg 但使用箭头函数
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: (ele) => {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback, obj);
console.log(result) 
// ["1", "2", "3"]，此时 this 指向 window
// 那为啥不是 "Muyiy1" 这样呢，不急，第 3 步介绍
// ----------- 完美分割线 -----------
// 2、传入 thisArg，使用普通函数
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback, obj);
console.log(result) 
// ["Hello1", "Hello2", "Hello3"]，完美
// ----------- 完美分割线 -----------
// 3、不传入 thisArg，name 使用 let 声明
let name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// ["1", "2", "3"]
// 为什么呢，因为 let 和 const 声明的变量不会挂载到 window 上
// ----------- 完美分割线 -----------
// 4、不传入 thisArg，name 使用 var 声明
var name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// ["Muyiy1", "Muyiy2", "Muyiy3"]
// 看看，改成 var 就好了
// ----------- 完美分割线 -----------
// 5、严格模式
'use strict'
var name = 'Muyiy'
let obj = {
    name: 'Hello',
    callback: function (ele) {
        return this.name + ele
    }
}
let arr = [1, 2, 3]
let result = arr.map(obj.callback);
console.log(result)
// TypeError: Cannot read property 'name' of undefined
// 因为严格模式下 this 指向 undefined



Array.prototype.filter
// 完整的结构是Array.prototype.filter(callbackfn[, thisArg])，和map是一样的。
// filter字如其名，它的主要功能就是过滤，callbackfn执行结果如果是true就返回当前元素，false则不返回，返回的所有元素组合在一起生成新数组，并返回。如果没有任何元素通过测试，则返回空数组。
// 这部分源码相比map而言，多了一步判断callbackfn的返回值。
// 模拟实现
Array.prototype.filter = function(callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
        throw new TypeError('Cannot read property "map" of null or undefined');
    }
    if (typeof callbackfn !== 'function') {
        throw new TypeError(callbackfn + ' is not a function');
    }
    let O = Object(this), len = O.length >>> 0,
        T = thisArg, A = new Array(len), k = 0;
    // 新增，返回数组的索引
    let to = 0;
    while (k < len) {
        if (k in O) {
            let kValue = O[k];
            // 新增
            if (callbackfn.call(T, kValue, k, O)) {
                A[to++] = kValue;
            }
        }
        k++;
    }
    // 新增，修改length，初始值为len
    A.length = to;
    return A;
}
