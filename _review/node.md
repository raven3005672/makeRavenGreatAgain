# node

默认单线程多进程。

## node支持多线程么？

v10.5新增多线程（实验性质），v11以上可直接使用

```js
const {
  isMainThread,
  Worker,
  workerData // 在主线程为null，工作线程中为主线程传递的值
} = require('worker_threads');

// 主线程
const worker = new Worker(__filename, {
    workerData: script// 传递的数据，可以是任意合法js值，会深拷贝一份过去
});

// 工作线程
const {
  Worker,
  parentPort, // 表示父进程的 MessagePort 类型的对象，在主线程里为 null
  workerData // 主线程传递过来的数据
} = require('worker_threads');

// 线程通信
// 主线程
const worker = new Worker(__filename, {
    workerData: script
    });
worker.on('message', （data）=>{
    console.log(data) // 接收工作线程数据并打印
});
parentPort.postMessage('hello') // 向工作线程发送数据
// 工作线程
parentPort.postMessage('hello') // 向父线程发送数据
parentPort.on('message', （data）=>{
    console.log(data) // 接收主线程数据并打印
});
```

## Node开启多进程cluster.fork()

```js
"use strict";
const cluster = require('cluster');
const cpus = require('os').cpus();
const accessLogger = require("../logger").accessLogger();

accessLogger.info('master ' + process.pid + ' is starting.');

cluster.setupMaster({
    /* 应用进程启动文件 */
    exec: 'bin/www'
});

/* 启动应用进程个数和服务器CPU核数一样 */
for (let i = 0; i < cpus.length; i++) {
    cluster.fork();
}

cluster.on('online', function (worker) {
    /* 进程启动成功 */
    accessLogger.info('worker ' + worker.process.pid + ' is online.');
});

cluster.on('exit', function (worker, code, signal) {
    /* 应用进程退出时，记录日志并重启 */
    accessLogger.info('worker ' + worker.process.pid + ' died.');
    cluster.fork();
});
```

## 多进程消息通信

监听子进程的message消息

## express和koa的区别

一个团队开发的，express主要使用es5语法，处理异步用的是回调函数。
koa采用es6中的generator+yeild+promise处理异步
koa2采用es7中的async/await+promise处理异步

## koa解决跨域

cors设置跨域头，通过中间件方式调用

```js
const httpCors = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
};
app.use(httpCors)
```

## npm是什么

node package manager

