# React

## 受控组件和非受控组件的区别

由React控制的输入表单元素元素而改变其值的方式，称为受控组件。

```js
// 受控
<input type="text" value={this.state.value} onChange={this.change} />
// 不受控
<input type="text" ref={input => this.input = input}/>
```

## 新旧生命周期

* 旧：will，did，mount，update
* 新：16版本之后
    * getDerivedStateFromProps：虚拟dom之后，实际dom挂载之前，每次获取新的props或state之后，返回新的state，配合didUpdate可以期待willReceiveProps
    * getSnapshotBeforeUpdate：update发生的时候，组件更新前触发，在render之后，在组件dom渲染之前；返回一个值，作为componentDidUpdate的第三个参数，配合componentDidUpdate可以覆盖componentWillUpdate的所有用法
    * componentDidCatch：错误处理
* 对比：弃用了三个will，新增了两个get来代替will，不能混用，17版本会彻底删除，新增错误处理

## react核心

* 虚拟dom，diff算法，遍历key值
* react-dom：提供了针对DOM的方法，比如：把创建的虚拟DOM，渲染到页面上 或 配合ref来操作DOM
* react-router

## fiber核心（react16）

* 旧：浏览器渲染引擎单线程，计算DOM树时会锁住整个县城，所有行为同步发生，有效率问题，期间react会一直占用浏览器主线程，如果组件层级比较深，相应的对战也会很深，长时间占用浏览器主线程，任何其他的操作都无法执行。
* 新：重写底层算法逻辑，引入fiber事件片，异步渲染，react会在渲染一部分树后检查是否有更高优先级的任务需要处理（如用户操作或绘图），处理完后再继续渲染，并可以更新优先级，以此管理渲染任务，加入fiber的react将组件更新分为两个时期（phase1和phase2），render前的生命周期为phase1，render后的生命周期为phase2，1可以打断，2不能打断一次性能更新。三个will生命周期可能会重复执行，尽量避免使用。

## 渲染一个react

* 分为首次渲染和更新渲染
* 生命周期，建立虚拟DOM，进行diff算法
* 对比新旧DOM，节点对比，将算法复杂度从O(n^3)降低到O(n)
* key值优化，避免用index作为key值，兄弟节点中唯一就行

## 高阶组件

高阶组件就是一个函数，该函数（wrapper）接受一个组件作为参数，并返回一个新的组件。
高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。

## hook

在无状态组件（函数式组件）中也能操作state以及其他react特性。

## redux、vuex、dva

* redux：通过store存储，通过action唯一更改，reducer描述如何更改，dispatch一个action
* dva：基于redux，结合redux-saga等中间件进行封装
* vuex：类似dva，集成化，action异步，mutation非异步

## react和vue的区别

* 数据不可变-数据可变
* js操作一切-各自处理
* 类式的写法-声明式的写法
* HOC扩展-mixins扩展

## 单向数据流怎么理解

数据主要从父节点传递到子节点（通过props），如果顶层（父级）的某个props改变了，react会重新渲染所有的子节点。

## react算法复杂度优化

react树对比是按照层级去对比的，他会给树编号0，1，2，3，4.。。然后相同的编号进行比较，所以复杂度是n。

传统diff的算法，除了上面的比较之外，还需要跨级比较。它会将两个树的节点，两两比较，这就有n^2的复杂度了，然后还需要编辑树，编辑树可能发生在任何节点，需要对树进行再一次遍历操作，因此复杂度为n，加起来就是n^3复杂度了。

## redux工作流，原理

## createStore源码

## hook

## HOC

## diff算法

## context

## react-router

## Fiber架构，调度原理

## 事件委托

## setState异步

为了性能优化做的批量更新。

