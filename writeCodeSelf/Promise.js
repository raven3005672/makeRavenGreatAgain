// 三种状态pending、fulfilled（resolved）、rejected
// pending状态的时候，可以转移到fulfilled（resolved）或者rejected状态
// 当处于fulfilled（resolved）状态或者rejected状态的时候，就不可变。
// 必须有一个then异步执行方法，then接受两个参数且必须返回一个promise
// onFulfilled用来接收promise成功的值，onRejected用来接收promise失败的原因
// promise1 = promise.then(onFulfilled, onRejected);

// 正常Promise用法
var promise = new Promise((resolve, reject) => {
    if (true) {
        resolve('value');
    } else {
        reject('err');
    }
})
promise.then(function(value) {
    // success
}, function(value) {
    // failure
});

// 基本实践
function myPromise(constructor) {
    let self = this;
    self.status = "pending";        // 定义状态改变前的初始状态
    self.value = undefined;         // 定义状态为resolved的时候的状态
    self.reason = undefined;        // 定义状态为rejected和时候的状态
    function resolve(value) {
        // 两个 === 'pengding'，保证了状态的改变是不可逆的
        if (self.status === "pending") {
            self.value = value;
            self.status = "resolved";
        }
    }
    function reject(reason) {
        // 两个 === 'pending'，保证了状态的改变时不可逆的
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = "rejected";
        }
    }
    // 捕获构造异常
    try {
        constructor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
myPromise.prototype.then = function(onFulfilled, onRejected) {
    let self = this;
    switch(self.status) {
        case "resolved":
            onFulfilled(self.value);
            break;
        case "rejected":
            onRejected(self.reason);
            break;
        default:
    }
}
// 测试
var p = new myPromise(function(resolve, reject) {
    resolve(1);
});
p.then(function(x) {
    console.log(x);
});


// 大场专供版
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
function Promise(excutor) {
    let that = this;            // 缓存当前promise实例对象
    that.status = PENDING;      // 初始状态
    that.value = undefined;     // fulfilled状态时返回的信息
    that.reason = undefined;    // rejected状态时拒绝的原因
    that.onFulfilledCallbacks = [];     // 存储fulfilled状态对应的onFulfilled函数
    that.onRejectedCallbacks = [];      // 存储rejected状态对应的onRejected函数
    // value成功状态时接受的终值
    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }
        // 实践中要确保onFulfilled和onRejected方法异步执行，且应该在then方法被调用的那一轮事件循环之后的新执行栈中执行。
        setTimeout(() => {
            // 调用resolve回调对应onFulfilled函数
            if (that.status === PENDING) {
                // 只能由pending状态 => fulfilled状态（避免调用多次resolve reject）
                that.status = FULFILLED;
                that.value = value;
                that.onFulfilledCallbacks.forEach(cb => cb(that.value));
            }
        });
    }
    // reason失败时接收的拒因
    function reject(reason) {
        setTimeout(() => {
            // 调用reject回调对应onRejected函数
            if (that.status === PENDING) {
                // 只能由pending状态 => rejected状态（避免调用多次resolve reject）
                that.status = REJECTED;
                that.reason = reason;
                that.onRejectedCallbacks.forEach(cb => cb(that.reason));
            }
        });
    }
    // 捕获在excutor执行器中抛出的异常
    // new Promise((resolve, reject) => {
    //     throw new Error('error in excutor')
    // });
    try {
        excutor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// todo 写的也有问题
Promise.prototype.then = function(onFulfilled, onRejected) {
    const that = this;
    let newPromise;
    // 处理参数默认值，保证参数后续能够继续执行
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected = typeof onRejected === "function" ? onRejected : reason => {
        throw reason;
    };
    // 成功
    if (that.status === FULFILLED) {
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(that.value);
                    // 新的Promise，resolve上一个onFulfilled的返回值
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected)
                    reject(e);
                }
            });
        })
    }
    // 失败
    if (that.status === REJECTED) {
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(that.reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
    // 等待
    if (that.status === PENDING) {
        // 当异步调用resolve/rejected时，将onFulfilled/onRejected收集暂存到集合中
        return newPromise = new Promise((resolve, reject) => {
            that.onFulfilledCallbacks.push((value) => {
                try {
                    let x = onFulfilled(value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            that.onRejectedCallbacks.push((reason) => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
















