## axios主动取消请求

**使用**
```js
import { CancelToken } from axios;

// source为一个对象 结构为 { token, cancel }
// token用来表示某个请求，是个promise
// cancel是一个函数，当被调用时，则取消token注入的那个请求
const source = CancelToken.source();

axios
    .get('/user', {
        // 将token注入此次请求
        cancelToken: source.token, 
    })
    .catch(function (thrown) {
        // 判断是否是因为主动取消而导致的
        if (axios.isCancel(thrown)) {
            console.log('主动取消', thrown.message);
        } else {
            console.error(thrown);
        }
    });
// 这里调用cancel方法，则会中断该请求 无论请求是否成功返回
source.cancel('我主动取消请求')
```

**source方法**
```js
// 暴露出token 和 cancel取消方法
CancelToken.source = function source() {
  var cancel;
  // 构造CancelToken 的实例,实例上有两个属性一个promise一个reason
  // 同时把注册的回调函数的参数也是个函数把这个函数的执行权抛使用者调用(cancel)
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};
```

**CancelToken的构造函数**
```js
function CancelToken(executor) {
  // 类型判断
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }
  // 创建一个promise的实例
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
  // 把resolve方法提出来 当resolvePromise执行时，this.promise状态会变为fulfilled
    resolvePromise = resolve;
  });
  // 存一下this
  var token = this;
  // new CancelToken时会立即调用executor方法 也就是 会执行source方法中的cancel = c;
  // 这里也就是把cancel函数暴露出去了，把取消的时机留给了使用者 使用者调用cancel时候也就会执行函数内的逻辑
  executor(function cancel(message) {
    // 请求已经被取消了直接return
    if (token.reason) {
      return;
    }
		// 给token(可就是当前this上)添加参数 调用new Cancel构造出cancel信息实例
    token.reason = new Cancel(message);
    // 这里当主动调用cancel方法时，就会把this.promise实例状态改为fulfilled，resolve出的信息则是reason（new Cancel实例）
    resolvePromise(token.reason);
  });
}
```

**adapter中的操作**
```js
// 判断使用者在改请求中是否配置了取消请求的token
if (config.cancelToken) {
  // 如果配置了则将实例上的promise用.then来处理主动取消调用cancel方法时的逻辑 
  // 也就是说如果ajax请求发送出去之前，这时我们已经给cancelToken的promise注册了.then
  // 当我们调用cancel方法时，cancelToken实例的promise会变为fulfilled状态，.then里的逻辑就会执行
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) {
      return;
    }
    // 调用 原生abort取消请求的方法
    request.abort();
    // axios的promise实例进入rejected状态 这里我们可以看到主动取消的请求是catch可以捕获到
    reject(cancel);
    // request置为null
    request = null;
  });
}
// 真正的请求在这时才发送出去！！！
request.send(requestData);
```
