class Scheduler {
  constructor() {
    this.queue = [];
    this.maxCount = 2;  // 最多同时两个任务
    this.runCount = 0;
  }
  // promiseCreator执行后返回的是一个Promise
  add(promiseCreator) {
    // 小于等于2，直接执行
    this.queue.push(promiseCreator);
    // 每次添加的时候都会尝试去执行任务
    this.runQueue();
  }
  runQueue() {
    // 队列中还有任务才会被执行
    if (this.queue.length && this.runCount <= this.maxCount) {
      // 执行现金爱如队列的函数
      const promiseCreator = this.queue.shift();
      // 开始执行任务 计数+1
      this.runCount += 1;
      // 假设任务都执行成功，当然也可以做一下catch
      promiseCreator().then(() => {
        // 任务执行完毕，计数-1
        this.runCount -= 1;
        // 尝试进行下一次任务
        this.runQueue();
      })
    }
  }
}


const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
