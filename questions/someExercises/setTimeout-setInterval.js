// https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/259
function mySetInterval() {
    mySetInterval.timer = setTimeout(() => {
        arguments[0]()
        mySetInterval(...arguments)
    }, arguments[1])
}
mySetInterval.clear = function() {
    clearTimeout(mySetInterval.timer);
}
mySetInterval(() => {
    console.log(11111)
}, 1000)

setTimeout(() => {
    mySetInterval.clear()
}, 5000);

// 标准中，setInterval如果前一次代码没有执行完，则会跳过此次代码的执行
// 浏览器中，setInterval如果前一次代码没有执行完，不会跳过此次代码，而是将其插在队列中，等待前一次代码执行完后立即执行
// node中，setInterval会严格按照间隔时间执行，一直等待完成上一次代码函数后，再经过时间间隔，才会进行下一次调用
