// let、const
// 具有块级作用域的，不会提升
// const 不能重新赋值，实质是引用地址不被变更


// 箭头函数
// 隐式返回
// 箭头函数中的this【重要】this的作用域继承自执行上下文，箭头函数自身不绑定this，因此this的值将在调用堆栈中查找
// 箭头函数不适合作为构造函数


// class类
// javaScript使用原型继承
// 初始化对象时，调用constructor方法，并将参数传递给此方法
// class继承
// extend 通过子类实例化的对象可以继承这两个类的所有方法
// 在子类中，可以通过调用super()引用父类
// static 静态方法直接使用类名来调用
// getters、setters
// 通过增加方法前缀get或者set创建，会在你去获取特定值或者修改特定值的时候执行get或者set内部的相关方法


// 默认参数


// 模板字符串


// 解构赋值


// 增强的对象字面量
// 简化了包含变量的语法 {something}
// 原型/super/动态属性
const anObject = {y: 'y'}
const x = {
    __proto__: anObject,
    test() {
        return super.test() + 'x'
    },
    ['a' + '_' + 'b']: 'z'
}


// for...of循环
// 在forEach的基础上加上了break的功能
// 和for...in的区别在于：in遍历属性名，of遍历属性值


// Promises
// pending => resolved/rejected
// 创建一个promise
let done = true;
const isItDoneYet = new Promise((resolve, reject) => {
    if (done) {
        const workDone = 'Here is the thing I built';
        resolve(workDone);
    } else {
        const why = 'Still working on something else';
        reject(why);
    }
})
// 使用Promise
const checkIfItsDone = () => {
    isItDoneYet.then(ok => {
        console.log(ok)
    }).catch(err => {
        console.log(err)
    })
}
// 链式promise
const status = response => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
}
const json = response => response.json();
fetch('/todos.json')
    .then(status)
    .then(json)
    .then(data => {
        console.log('Request succeeded with JSON response', data)
    })
    .catch(error => {
        console.log('Request failed', error)
    })
// 多个promise
// Promise.all()，全部resolve的时候再执行一些操作
const f1 = fetch('/something.json');
const f2 = fetch('/something2.json');
Promise.all([f1, f2])
    .then(res => {
        console.log('Array of results', res);
    })
    .catch(err => {
        console.log(err);
    })
// Promise.race()，只要有一个resolve了，就会运行回调，并且只执行一次
const promiseOne = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
})
const promiseTwo = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two');
})
Promise.race([promiseOne, promiseTwo]).then(result => {
    console.log(result);    // two
})


// 模块
// node => CommonJS(require)
// ES6 module
// export default str => str.toUpperCase()
// import toUpperCase from './uppercase.js'
// export {a,b,c}
// import * from 'module'
// import {a,b as two} from 'module'


// 新的字符串方法
// repeat()
// 'Ho'.repeat(3) //'HoHoHo'
// codePointAt()
// 这个方法能用在处理那些需要 2 个 UTF-16 单元表示的字符上。
// 使用 charCodeAt 的话，你需要先分别得到两个 UTF-16 的编码然后结合它们。但是使用 codePointAt() 你可以直接得到整个字符。
"𠮷".charCodeAt(0).toString(16) //d842
"𠮷".charCodeAt(1).toString(16) //dfb7
"\ud842\udfb7" //"𠮷"
"𠮷".codePointAt(0) //20bb7
"\u{20bb7}" //"𠮷"


// 新的对象方法
// Object.is()确定两个值是不是同一个
// Object.assign()用来浅拷贝一个对象
// Object.setPrototypeOf设置一个对象的原型
Object.is(a,b)
// 返回值在下列情况之外一直是false：
// a和b是同一个对象
// a和b是相等的字符串
// a和b是相等的数字
// a和b都是undefined，null，NaN，true或者都是false
Object.assign()
// 浅拷贝，内部引用的对象是相同的，修改原值可能造成新值的修改
Object.setPrototypeOf()
// 设置对象的原型，可以接受两个参数：对象以及原型
Object.setPrototypeOf(object, prototype)
const animal = {
    isAnimal: true
}
const mammal = {
    isMammal: true
}
mammal.__proto__ = animal;
mammal.isAnimal // true
const dog = Object.create(animal)
dog.isAnimal    // true
console.log(dog.isMammal)   // undefined
Object.setPrototypeOf(dog, mammal)
dog.isAnimal    // true
dog.isMammal    // true


// 展开操作符
// [...]


// Set
const s = new Set()
s.add('one')    // 重复会被忽略
s.has('one')    // true
s.delete('one') // 删除单个
s.size          // 个数
s.clear()       // 清空
for (const k of s.keys()) {}
for (const v of s.values()) {}
const i = s.entries();
console.log(i.next())       // 之前返回{value, done = false} 最后以{value, done = true}结束
const ss = new Set([1, 2, 3, 4])
const a = [...s.keys()]     // [...s.values()]
// WeakSet
// weakSet内的元素会被垃圾回收
// weakSet不可迭代，不能清空，不能得到size，仅暴露add/has/delete方法


// Map
const m = new Map()
m.set('color', 'red')
m.set('age', 2)
const color = m.get('color')
const age = m.get('age')
m.delete('color')
m.clear()
m.has('color')
m.size
const mm = new Map([['color', 'red'], ['owner', 'Flavio'], ['age', 2]])
for (const [k, v] of m.entries) {} 
// WeakMap
// 定义在上面的数据会被垃圾回收
// 不能迭代遍历，不能清空，不能得到size，仅暴露get/set/has/delete


// Generators生成器
function *calculator(input) {
    var doubleThat = 2 * (yield (input / 2))
    var another = yield (doubleThat)
    return (input * doubleThat * another)
}
const calc = calculator(10)
calc.next()         // {done: false, value: 5}
calc.next(7)        // {done: false, value: 14}
calc.next(100)      // {done: true, value: 14000}
