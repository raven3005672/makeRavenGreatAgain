// # promise

// - 实现resolve、reject
//   - 保存结果与状态
// - 状态不可变
//   - 状态变更前判断当前状态
// - throw
//  try catch
// - 实现then
//   - 根据状态执行传入的回调函数
// - 定时器情况
//   - 回调用数组保存
// - 链式调用
//   - 改写then方法，cb的执行改为传入状态变更回调
// - 微任务
//   - resolvePromise函数异步执行
// - all
// - race
// - allSettled
// - any

class MyPromise {
  // 构造方法
  constructor(executor) {
    // 初始化值
    this.initValue();
    // 初始化this指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (e) {
      // 捕捉到错误直接执行reject
      this.reject(e);
    }
  }
  initBind() {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  initValue() {
    // 初始化值
    this.PromiseResult = null;  // 终值
    this.PromiseState = 'pending';  // 状态
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = [];  // 保存失败回调
  }
  resolve(value) {
    // state是不可变的
    if (this.PromiseState !== 'pending') return;
    // 如果执行resolve，状态变为fulfilled
    this.PromiseState = 'fulfilled';
    // 终值为传进来的值
    this.PromiseResult = value;
    // 执行保存的成功回调
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult);
    }
  }
  reject(reason) {
    // state是不可变的
    if (this.PromiseState !== 'pending') return;
    // 如果执行reject，状态变为rejected
    this.PromiseState = 'rejected';
    // 终值为传进来的reason
    this.PromiseResult = reason;
    // 执行保存的失败回调
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult);
    }
  }
  then(onFulfilled, onRejected) {
    // 接受两个回调 onFulfilled, onRejected
    // 参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    var thenPromise = new Promise((resolve, reject) => {
      const resolvePromise = cb => {
        setTimeout(() => {  // 这里不应该用setTimeout，仅做示意
          try {
            const x = cb(this.PromiseResult);
            if (x === thenPromise) {
              // 不能返回自身
              throw new Error('不能反悔自身。。。');
            }
            if (x instanceof MyPromise) {
              // 如果返回值是Promise
              // 如果返回值是Promise对象，返回值为成功，新promise就是成功
              // 如果返回值是Promise对象，返回值为失败，新promise就是失败
              x.then(resolve, reject);
            } else {
              // 非Promise就直接成功
              resolve(x);
            }
          } catch (err) {
            // 处理报错
            reject(err)
          }
        })
      };

      if (this.PromiseState === 'fulfilled') {
        // 如果当前为成功状态，执行第一个回调
        // onFulfilled(this.PromiseResult);
        resolvePromise(onFulfilled);  // 链式调用
      } else if (this.PromiseState === 'rejected') {
        // 如果当前为失败状态，执行第二个回调
        // onRejected(this.PromiseResult);
        resolvePromise(onRejected); // 链式调用
      } else if (this.PromiseState === 'pending') {
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(onFulfilled.bind(this));
        this.onRejectedCallbacks.push(onRejected.bind(this));
      }
    });

    // 返回这个包装的Promise
    return thenPromise;
  }

  static all(promises) {
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value;
        count++;
        if (count === promises.length) resolve(result);
      }
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData(index, res);
          }, err => reject(err));
        } else {
          addData(index, promise)
        }
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            resolve(res);
          }, err => {
            reject(err)
          });
        } else {
          resolve(promise)
        }
      })
    })
  }

  // 接收一个Promise数组，数组中如有非Promise项，则此项当做成功
  // 把每一个Promise的结果，集合成数组返回
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      const res = [];
      let count = 0;
      const addData = (status, value, i) => {
        res[i] = {
          status,
          value
        }
        count++;
        if (count === promises.length) {
          resolve(res);
        }
      }
      promises.forEach((promise, i) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            addData('fulfilled', res, i);
          }, err => {
            addData('rejected', err, i);
          });
        } else {
          addData('fulfilled', promise, i);
        }
      })
    })
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0;
      promises.forEach((promise) => {
        promise.then(val => {
          resolve(val);
        }, err => {
          count++;
          if (count === promises.length) {
            reject(new AggregateError('All promises were rejected'));
          }
        })
      })
    })
  }

}