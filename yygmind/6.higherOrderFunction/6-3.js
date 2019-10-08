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
// 改动点在于判断callbackfn返回值，新增索引to，这样主要避免使用k时生成空元素，并在返回之前修改length值。



Array.prototype.reduce
// reduce完整的结构是Array.prototype.reduce(callbackfn[, initialValue]),这里第二个参数并不会thisArg了，而是初始值initialValue，关于初始值之前有介绍过。
// 如果没有提供initialValue，那么第一次调用callback函数时，accumlator使用原数组中的第一个元素，currentValue即时数组中的第二个元素。
// 如果提供了initialValue，accumulator将使用这个初始值，currentValue使用原数组中的第一个元素。
// 在没有初始值的空数组上调用reduce将报错
Array.prototype.reduce = function(callbackfn, initialValue) {
    // 异常处理
    if (this == null) {
        throw new TypeError('Cannot read property "map" of null of undefined');
    }
    if (typeof callbackfn !== 'function') {
        throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this);
    let len = O.length >>> 0;
    let k = 0, accumulator;
    // 新增
    if (initialValue) {
        accumulator = initialValue
    } else {
        if (len === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        let kPresent = false;
        while (!kPresent && (k < len)) {
            kPresent = k in O;
            if (kPresent) {
                accumulator = O[k];
            }
            k++;
        }
    }
    while(k < len) {
        if (k in O) {
            let kValue = O[k];
            accumulator = callbackfn.call(undefined, accumulator, kValue, k, O);
        }
        k++;
    }
    return accumulator;
}
// 这部分源码主要多了对于initialValue的处理，有初始值时比较简单，即accumulator = initialValue，kValue = O[0]
// 无初始值处理，新欢判断当O及其原型链上存在属性k时，accumulator = O[k]并退出循环，因为k++，所以kValue = O[k++]

// 更多的数组方法有find、findIndex、forEach等，其源码实现也是大同小异，无非就是在callbackfn.call这部分做些处理。

// 注意forEach的源码和map很相同，在map的源码基础上做些改造就行了。
Array.prototype.forEach = function(callbackfn, thisArg) {
    // 相同
    // ...
    while (k < len) {
        if (k in O) {
            let kValue = O[k];
            // 这部分是map
            // let mappedValue = callbackfn.call(T, kValue, k, O);
            // A[k] = mappedValue;
            
            // 这部分是forEach
            callbackfn.call(T, kValue, k, O);
        }
        k++;
    }
    // 返回undefined
    return undefined;
}
// 不同之处在于不处理callbackfn执行的结果，也不返回。
// 特意指出来是因为在此之前看到过一种错误的说法，叫做forEach会跳过空，但是map不跳过
// 为什么说map不跳过呢，因为原始数组有empty元素时，map返回的结果也有empty元素，所以不跳过，但是这种说法并不正确。
let arr = [1, , 3, , 5];
console.log(arr);   // [1, empty, 3, empty, 5]
let result = arr.map(ele => {
    console.log(ele)    // 1, 3, 5
    return ele;
})
console.log(result);    // [1, empty, 3, empty, 5]
// 看ele输出就会明白map也是跳空的，原因就在于源码中的k in O，这里是检查O及其原型链是否包含属性k，所以有的实现中庸hasOwnProperty也是不正确的。
// 另外callbackfn中不可以使用break跳出循环，是因为break只能跳出循环，而callbackfn并不是循环体。如果有类似的需求可以使用for...of、for...in、some、every等。



// https://github.com/yygmind/blog/issues/46