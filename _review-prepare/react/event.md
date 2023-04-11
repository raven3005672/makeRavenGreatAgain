<!-- https://mp.weixin.qq.com/s/pffJQXw-x09t-46Ek-KYqg -->

react的所有事件都挂载在 document中
当真实dom触发后冒泡到 document后才会对 react事件进行处理
所以原生的事件会先执行
然后执行 react合成事件
最后执行真正在 document上挂载的事件

didmount => domEventChild => domEventParent => reactEventChild => reactEventParent => document

