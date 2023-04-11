## WeakRef

是ES2021提出来的，用于直接创建对象的弱引用， 不会妨碍原始对象被垃圾回收机制清除。

WeakRef 实例对象有一个deref()方法，如果原始对象存在，该方法返回原始对象；如果原始对象已经被垃圾回收机制清除，该方法返回undefined。

```js
let target = {};
let wr = new WeakRef(target);
let obj = wr.deref();
if (obj) { // target未被垃圾回收机制清除
  // ...
}
```

## 通过现象看本质

事件监听的表象

- DOM事件
- WebSocket, socket.io, ws, mqtt

从本质来看也就是两种

- 基于EventTarget的事件订阅
- 基于EventEmitter的事件订阅

本质 - prototype

## 方法拦截

```js
const ep = EventTarget.prototype;
const rvAdd = Proxy.revocable(ep.addEventListener, this.handler);
ep.addEventListener = rvAdd.proxy;
```

FinalizationRegistry 对象可以让你在对象被垃圾回收时请求一个回调。

```js
const registry = new FinalizationRegistry(name => {
    console.log(name,  " 被回收了");
});
var theObject = {
    name: '测试对象',
}
registry.register(theObject, theObject.name);
setTimeout(() => {
    window.gc();

    theObject = null;
}, 100);
```

## 基于EventTarget的事件订阅

```js
<button id="btn1">点我啊</button>

function onClick(){
    console.log("clicked");
}
const btnEl = document.getElementById("btn");

btnEl.addEventListener("click", onClick);
btnEl.addEventListener("click", onClick);
btnEl.addEventListener("click", onClick);
```

EventTarget有天然去重的本领。**输出一次**

```js
btnEl.addEventListener("click", onClick);
btnEl.addEventListener("click", onClick, false);
btnEl.addEventListener("click", onClick, {
    passive: false,
});
btnEl.addEventListener("click", onClick, {
    capture: false,
});
btnEl.addEventListener("click", onClick, {
    capture: false,
    once: true,
});
```

其裁定是否相同回调函数的标准是：options中的capture的参数值一致。capture默认值是false。**输出一次**
