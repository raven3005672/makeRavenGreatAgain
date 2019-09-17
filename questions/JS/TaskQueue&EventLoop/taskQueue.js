// 基本问题

async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setImmediate(() => {console.log(100)})
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

// script start => async1 start => async2 => promise1 => script end
// async1 end => promise2
// setTimeout

// 宏任务
// (macro)task，每次执行栈执行的代码就是一个宏任务，包括每次从事件队列中获取一个事件回调并放到执行栈中执行。
// 浏览器机制 => 一个(macro)task执行之后，先重新渲染，再执行下一个(macro)task => (macro)task -> 渲染 -> (marco)task -> ...
// (macro)task主要包括：script, setTimeout, setInterval, I/O, UI交互事件, postMessage, MessageChannel, setImmediate(node环境)

// 微任务
// microtask，在当前task执行结束后立即执行的任务，也就是说，在当前task任务后，渲染之前。所以它的响应速度比setTimeout更快，因为无需等待渲染。
// microtask主要包括：Promise.then, MutaionObserver(创建并返回一个新的MutationObserver，它会在指定的DOM发生变化时调用), process.nextTick(node环境)

// 运行机制
// 每一次循环称为tick，关键步骤如下：
// 1、执行一个宏任务，栈中没有就从事件队列中获取
// 2、执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
// 3、宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
// 4、当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
// 5、渲染完毕后，js线程继续接管，开始下一个宏任务

// Promise和aysnc立即执行，then和await做异步处理
// await是一个让出线程的标志。await后面的表达式会执行一遍，将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码。
// async await本身是语法糖，await后面的代码就是microtask
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('async1 end');
}
// 等价于
async function async1() {
	console.log('async1 start');
	Promise.resolve(async2()).then(() => {
        console.log('async1 end');
    })
}

// 尝试按步骤确认执行顺序
// macrotask           执行栈      microtask
// script
// setTimeout队列
// setTimeout
//                     global

// macrotask           执行栈      microtask
// script                          promise队列
// setTimeout队列                  async1 end promise2
// setTimeout
//                     global

// 之后检查微任务，执行async1 end和promise2，第一轮循环结束。
// 开始第二轮循环，只有setTimeout，取出直接输出。


// 变化1
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    //async2做出如下更改：
    new Promise(function(resolve) {
        console.log('promise1');
        resolve();
    }).then(function() {
        console.log('promise2');
    });
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise3');
    resolve();
}).then(function() {
    console.log('promise4');
});
console.log('script end');

// script start => async1 start => promise1 => promise3 => script end
// promise2 => async1 end => promise 4
// setTimeout


// 变化2
async function async1() {
    console.log('async1 start');
    await async2();
    //更改如下：
    setTimeout(function() {
        console.log('setTimeout1')
    },0)
}
async function async2() {
    //更改如下：
	setTimeout(function() {
		console.log('setTimeout2')
	},0)
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

// script start => async1 start => promise1 => script end
// promise2
// setTimeout3
// setTimeout2
// setTimeout1


// 变化3
async function a1 () {
    console.log('a1 start')
    await a2()
    console.log('a1 end')
}
async function a2 () {
    console.log('a2')
}
console.log('script start')
setTimeout(() => {
    console.log('setTimeout')
}, 0)
Promise.resolve().then(() => {
    console.log('promise1')
})
a1()
let promise2 = new Promise((resolve) => {
    resolve('promise2.then')
    console.log('promise2')
})
promise2.then((res) => {
    console.log(res)
    Promise.resolve().then(() => {
        console.log('promise3')
    })
})
console.log('script end')

// script start => a1 start => a2 => promise2 => script end
// promise1 => a1 end => promise2.then => promise3
// setTimeout


// 思考1
function foo1() {
    // console.log(1)
    return Promise.resolve().then(foo1)
}
foo1();

// 思考2
function foo2() {
    // console.log(1);
    setTimeout(foo2, 0)
};
foo2()