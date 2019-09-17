<!-- https://segmentfault.com/a/1190000013102056 -->
# node中的事件循环机制

```
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
```

每个阶段都有一个先进先出的回调队列要执行。而每个阶段都有自己的特殊之处。简单来说，就是当事件循环进入某个阶段后，会执行该阶段特定的任意操作，然后才会执行这个阶段里的回调。当队列被执行完，或者执行的回调数量达到上限后，事件循环才会进入下一个阶段。

## timers

一个timer指定一个下限时间而不是准确时间，在达到这个下限时间后执行回调。在指定的时间过后，timers会尽早的回调，但是系统调度或者其他回调的执行可能会延迟它们。

从技术上来说，poll阶段控制timers什么时候执行，而执行的具体位置在timers。

下限的时间有一个范围：[1, 2147483647]，如果设定的时间不在这个范围，将被设置为1。

## I/O callbacks

这个阶段执行一些系统操作的回调，比如说TCP连接发生错误。

## idle, prepare

系统内部的一些调用。

## poll

这是最复杂的一个阶段。

poll阶段有两个主要的功能：一是执行下限时间已经达到的timers的回调，一是处理poll队列里的事件。

注：node很多API都是基于事件订阅完成的，这些API的回调应该都在poll阶段完成。

当事件循环进入poll阶段：

* poll队列不为空的时候，事件循环肯定是先遍历队列并同步执行回调，直到队列清空或执行回调数达到系统上限。
* poll队列为空的时候，这里有两种情况：
  * 如果代码已经被setImmediate设定了回调，那么事件循环直接结束poll阶段进入check阶段来执行check队列里的回调
  * 如果代码没有被setImmediate设定回调
    * 如果有被设定的timers，那么此时事件循环会检查timers，如果有一个或多个timers下限时间已经到达，那么事件循环将绕回timers阶段，并执行timers的有效回调队列。
    * 如果没有被设定timers，这个时候事件循环是阻塞在poll阶段等待回调被假如poll队列

## check

这个阶段允许在poll阶段结束后立即执行回调。如果poll阶段空闲，并且有被setImmediate设定的回调，那么事件循环直接跳到check执行而不是阻塞在poll阶段等待回调被加入。

setImmediate实际上是一个特殊的timer，跑在事件循环中的一个独立的极端。它使用libuv的API来设定在poll阶段结束后立即执行回调。

注：setImmediate具有最高优先级，只要poll队列为空，代码被setImmediate，无论是否有timers达到下限时间，setImmediate的代码都优先执行。

## close callbacks

如果一个socket或handle被突然关掉（比如socket.destroy()），close事件将在这个阶段被触发，否则将通过process.nextTick()触发。

## 关于setImmediate和setTimeout

setImmediate：当poll阶段完成后执行；
setTimeout：当事件到达后，有机会就执行。

首先进入的是timers阶段，如果我们的机器性能一般，那么进入timers阶段，一毫秒已经过去了（setTimeout(fn, 0)等价于setTimeout(fn, 1)），那么setTimeout的回调会首先执行。

如果没有到一毫秒，那么在timers阶段的时候，下限时间没到，setTimeout回调不执行，事件循环来到了poll阶段，这个时候队列为空，此时有代码被setImmediate，于是限制性了setImmediate的回调函数，之后再下个事件循环再执行setTimeout的回调函数。

而我们在执行代码的时候，进入timers的时间延迟其实是随机的，并不是确定的，所以会出现两个函数执行顺序随机的情况。

```
// 主模块-随机顺序
setTimeout(function timeout () {
  console.log('timeout');
},0);

setImmediate(function immediate () {
  console.log('immediate');
});
```

```
// IO模块内-setImmediate优先
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

fs.readFile的回调是在poll阶段执行的，当其回调执行完毕之后，poll队列为空，而setTimeout入了timers的队列，此时有代码被setImmediate，于是时间循环先进入check阶段执行回调，之后在下一个事件循环再在timers阶段中执行有效回调。

```
// timers内-setImmediate优先
setTimeout(() => {
  setImmediate(() => {
    console.log('setImmediate');
  });
  setTimeout(() => {
    console.log('setTimeout')
  }, 0);
}, 0);
```

以上的代码在timers阶段执行外部的setTimeout回调后，内层的setTimeout和setImmediate入队，之后事件循环继续往后面的阶段走，走到poll阶段的时候发现队列为空，此时有代码被setImmediate，所以直接进入check阶段执行响应回调（注意这里没有去检测timers队列中是否有成员到达下限事件，因为setImmediate优先）。之后在第二个事件循环的timers阶段再去执行相应的回调。

综上，我们可以总结：

* 如果两者都在主模块中调用，那么执行先后取决于进程性能，随机。
* 如果两者都不在主模块调用（被一个异步操作包裹），那么setImmediate的回调永远先执行。

# process.nextTick()与Promise

对于这两个，我们可以把他们理解成一个微任务。也就是说，它其实不属于事件循环的一部分。

那么它们是在什么时候执行呢？

不管在什么地方调用，他们都会在其所处的事件循环最后，事件循环进入下一个循环的阶段前执行。

```
setTimeout(() => {
    console.log('timeout0');
    Promise.resolve().then(() => {
        console.log('p1')
    });
    process.nextTick(() => {
        console.log('nextTick1');
        process.nextTick(() => {
            console.log('nextTick2');
        });
    });
    Promise.resolve().then(() => {
        console.log('p2')
    });
    process.nextTick(() => {
        console.log('nextTick3');
    });
    console.log('sync');
    setTimeout(() => {
        console.log('timeout2');
    }, 0);
}, 0);
// timeout0 => sync
// nextTick1 => nextTick3 => nextTick2
// p1 => p2
// timeout2
```

最后练习

```
setImmediate(function() {
  console.log('setImmediate');
  setImmediate(function() {
    console.log('嵌套setImmediate');
  });
  process.nextTick(function() {
    console.log('neextTick');
  });
});
// setImmediate
// nextTick
// 嵌套setImmediate
```

事件循环check阶段执行回调函数输出setImmediate，之后输出nextTick。嵌套的setImmediate在下一个事件循环的check阶段执行回调输出嵌套的setImmediate。

```
var fs = require('fs');
function someAsyncOperation(callback) {
  // 假设这个任务要消耗95ms
  fs.readFile('/path/to/file', callback);
}
var timeoutScheduled = Date.now();
setTimeout(function() {
  var delay = Date.now() - timeoutScheduled;
  console.log(delay + "ms have passed since i was scheduled");
}, 100);
// someAsyncOperation要消耗95ms才能完成
someAsyncOperation(function() {
  var startCallback = Date.now();
  // 消耗10ms...
  while(Date.now() - startCallback < 10) {
    // do nothing...
  }
});
```

事件循环进入poll阶段发现队列为空，并且没有代码被setImmediate。于是在poll阶段等待timers下限时间到达。当等到95ms时，fs.readFile首先执行了，它的回调被添加进poll队列并同步执行，耗时10ms。此时总共时间累积105ms。等到poll队列为空的时候，事件循环会查看最近到达的timer的下限时间，发现已经到达，再回到timers阶段，执行timer的回调。

## nextTick[待定]

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

直接event.emit('some_event')的时候，node不断的把收集到的事件塞到I/O callbacks这个队列，如果有大量事件塞入就会导致溢出，就是上面的Maximum call stack size exceeded错误。

如果加了process.nextTick则会不断的把emit的事件回调加到nextTickQueue队列，在各个主队列切换的时候执行，见上图的nextTick(队列执行)。上面的demo的执行顺序为：

1. 发送事件
2. 把事件回调函数添加到nextTickQueue（注意，这个时候nextTickQueue队列里只有一个事件回调函数，如果当前队列尚未执行完毕并且没有发生切换，则nextTickQueue队列里的事件永远不会执行）
3. 执行nextTickQueue里的第一个事件回调（当前队列执行完毕或者执行到一定数量发生切换时，事件回调又会重新创建一个新的nextTickQueue队列并添加一个事件回调）
4. 同上循环

这样就没有阻塞Node的事件循环，无论num多大都不会撑爆I/O callbacks队列。最核心的思想就是将任务拆解到若干次事件循环中，逐步执行。
