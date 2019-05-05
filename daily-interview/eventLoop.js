// 浏览器
// 执行一个task【宏任务】
// 执行完micro-task队列【微任务】

// node
// 大体的task宏任务执行顺序
// timers定时器：本阶段执行已经安排的setTimeout和setInterval回调函数
// pending callbacks待定回调：执行延迟到下一个循环迭代的I/O回调
// idle，prepare：仅系统内部使用
// poll轮询：检索新的IO事件，执行与IO相关的回调，其余情况node将在此处阻塞
// check检测：setImmediate回调函数在这里执行
// close callbacks关闭的回调函数：一些准备关闭的回调函数，如socket.on('close', ...)


// node10以前
// 执行完一个阶段的所有任务
// 执行完nextTick队列里面的内容
// 然后执行玩微任务队列里的内容

// node11之后
// 和浏览器行为统一，每执行一个宏任务就执行完微任务队列
