react的渲染流程
- render阶段
  - vdom => fiber
  - schedule
  - reconcile
- commit阶段
  - fiber => dom

渲染流程的入口是performSyncWorkOnRoot函数。

setState会创建update对象挂到fiber对象上，然后调度performSyncWorkOnRoot重新渲染。

react17中，setState是批量执行的，因为执行前会设置executionContext，但是如果再setTimeout、事件监听器等函数里，就不会设置executionContext了，这时候setState会同步执行。可以在外面包一层batchUpdates函数，手动设置下executionContext来切换成异步批量执行。

react18，如果用createRoot的api，就不会有这种问题了。

在18普及之后，所有的setState都是异步批量执行了。