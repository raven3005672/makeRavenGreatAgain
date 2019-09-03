// 字符串填充
// padStart()/padEnd()
// (sring).padStart(targetLength [, padString])


// Object.values()
// Object.entries()


// Object.getOwnPropertyDescriptors()
// 返回自己(非继承)的所有属性描述符
// 如果只有一个setter，那么它就不会正确的复制到一个新对象上
const person1 = {
    set name(newName) {
        console.log(newName)
    }
}
const person2 = {}
Object.assign(perons2, person1)     // 不起作用
const person3 = {}
Object.defineProperties(person3,
    Object.getOwnPropertyDescriptors(person1))      // 生效


// 尾逗号


// 异步函数
// async/await基于Promise简历的，是比Promise更高级的抽象
const doSomethingAsync = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve('I did something'), 3000)
    })
}
const doSomething = async () => {
    console.log(await doSomethingAsync())
}
console.log('before')
doSomething()
console.log('after')
// before => after => I did something
// async关键字标记在任何函数上，意味着这个函数都将返回一个Promise
const aFunction = async () => {
    return 'test'
    // 等价于
    // return Promise.resolve('test')
}
aFunction().then(alert)


// 共享内存和原子
// webWorkers相关，可以在浏览器中创建多线程程序，通过事件的方式来传递消息
// ES2017开始，可以使用SharedArrayBuffer在每一个Worker中和它们的创建者之间共享内存数据

