<!-- https://segmentfault.com/a/1190000013102056 -->

### node--nextTick

```
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var count = 0;
var num = 10;
event.on('some_event', function() {
  count++;
  console.log('some_event 事件触发' + count);
  if (count < num) {
    event.emit('some_event')
  }
});
event.emit('some_event');
console.log('what ?')
```

num设置的非常大就会报错：V8不断的向事件队列里添加任务，最终导致出现溢出。

```
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var count = 0;
var num = 10;
event.on('some_event', function() {
  count++;
  console.log('some_event 事件触发' + count);
  if (count < num) {
    event.emit('some_event')
  }
});
process.nextTick(function() {
    event.emit('some_event');
})
console.log('what ?')
```

what ? 不会被阻塞，而且无论num改成多少，都不会出现栈溢出的错误。

node的Event loop执行流程

   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
|      nextTick（队列执行）
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
|       nextTick（队列执行）
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘
|      nextTick（队列执行）         ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      |               |
|      nextTick（队列执行）         │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
|       nextTick（队列执行）
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘

直接event.emit('some_event')的时候，node不断的把收集到的事件塞到I/O callbacks这个队列，如果有大量事件塞入就会导致溢出，就是上面的Maximum call stack size exceeded错误。

如果加了process.nextTick则会不断的把emit的事件回调加到nextTickQueue队列，在各个主队列切换的时候执行，见上图的nextTick(队列执行)。上面的demo的执行顺序为：

1. 发送事件
2. 把事件回调函数添加到nextTickQueue（注意，这个时候nextTickQueue队列里只有一个事件回调函数，如果当前队列尚未执行完毕并且没有发生切换，则nextTickQueue队列里的事件永远不会执行）
3. 执行nextTickQueue里的第一个事件回调（当前队列执行完毕或者执行到一定数量发生切换时，事件回调又会重新创建一个新的nextTickQueue队列并添加一个事件回调）
4. 同上循环

这样就没有阻塞Node的事件循环，无论num多大都不会撑爆I/O callbacks队列。最核心的思想就是将任务拆解到若干次事件循环中，逐步执行。

### setImmediate和setTimeout

setImmediate：当poll阶段完成后执行
setTimeout：当事件到达后，有机会就执行

在非I/O循环(主模块)中，执行顺序不固定
在I/O循环中，setImmediate回调总是先执行

```
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});
```

```
var fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout')
  }, 0)
  setImmediate(() => {
    console.log('immediate')
  })
})
```

poll阶段有两个主要的功能：一个执行下限时间已经达到的timers的回调，一个是处理poll队列里的事件。

当事件循环进入poll阶段：
* poll队列不为空的时候，事件循环肯定是先遍历队列并同步执行回调，直到队列清空或执行回调数达到系统上限。
* poll队列为空的时候，这里有两种情况
1. 如果代码已经被setImmediate()设定了回调，那么事件循环直接结束poll阶段进入check阶段来执行check队列里的回调。
2. 如果代码没有被设定setImmediate()设定回调：
2.1. 如果有被设定的timers，那么此时事件循环会检查timers，如果有一个或多个timers下限时间已经到达，那么事件循环将绕回timers阶段，并执行timers的有效回调队列。
2.2. 如果没有被设定timers，这个时候事件循环是阻塞在poll阶段等待回调被加入poll队列。
