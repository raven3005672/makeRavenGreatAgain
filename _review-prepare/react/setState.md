# setState的执行机制

## setState是同步的还是异步的，为什么有的时候不能立即拿到更新结果儿有的时候可以？

- 钩子函数和React合成事件中的setState。（异步生效）
- 异步函数和原生事件中的setState。（同步生效）
  - 在setTimeout中调用setState

## 为什么有时连续两次setState只有一次生效

- 直接传递对象的setState会被合并成一次
- 使用函数传递state不会被合并

## setState执行过程

![img](https://mmbiz.qpic.cn/mmbiz_png/aDoYvepE5x1LIVajictse1eibOhtyMo0VbZ6tEUBO6WMLelKehKsIuGQt7IviacicR31838rzJ9RXBZ4VyfXJlichhw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

- partialState: setState传入的第一个参数，对象或函数
- _pendingStateQueue: 当前组件等待执行更新的state队列
- isBatchingUpdates: react用于标识当前是否处于批量更新状态，所有组件公用
- dirtyComponent: 当前所有处于待更新状态的组件队列
- transaction: react的事务机制，在被事务调用的方法外包装n个waper对象，并依次执行 waper.init、被调用方法、waper.close
- FLUSH_BATCHED_UPDATES: 用于执行更新的waper，只有一个close方法

执行过程：
1. 将setState传入的partialState参数存储在当前组件实例的state暂存队列中。
2. 判断当前React是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中。
3. 如果未处于批量更新状态，将批量更新状态标识设置为true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
4. 调用事务的waper方法，遍历待更新组件队列依次执行更新。
5. 执行生命周期componentWillReceiveProps。
6. 将组件的state暂存队列的state进行合并，获得最终要更新的state对象，并将队列置为空。
7. 执行生命周期componentShouldUpdate，根据返回值判断是否要继续更新。
8. 执行生命周期componentWillUpdate。
9. 执行真正的更新，render。
10. 执行生命周期componentDidUpdate。

### 钩子函数和合成事件中

isBranchUpdate为true。此时无论调用多少次setState，都不会执行更新，而是将要更新的state存入_pendingStateQueue，将要更新的组件存入dirtyComponent。

当上一次更新机制执行完毕，以生命周期为例，所有组件，即最顶层组件didmount后会将isBranchUpdate设置为false。此时将执行之前积累的setState。

### 异步函数和原生事件中

由执行机制看，setState本身并不是异步的，而是如果在调用setState时，如果react正处于更新过程，当前更新会被暂存，等上一次更新执行后再执行，这个过程给人一种异步的假象。

在生命周期，根据JS的异步机制，会将异步函数先暂存，等所有同步代码执行完毕之后再执行，这时上一次更新过程已经执行完毕，isBranchUpdate被设置为false，根据上面的流程，这时再调用setState即可立即执行更新，拿到更新结果。

### partialState合并机制

```js
_assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
// 如果传入的是对象，会被合并成一次
Object.assign(
  nextState,
  { index: state.index + 1 },
  { index: state.index + 1 }
)
```

### componentDidMount调用setState

componentDidMount本身处于一次更新中，我们又调用了一次setState，就会在未来再进行一次render，造成不必要的性能浪费，大多数情况可以设置初始值来搞定。

调用接口，再回调中去修改state，这是正确的做法。在state初始值依赖dom属性时，在componentDidMount中setState是无法避免的。

### componentWillUpdate、componentDidUpdate

不能调用setState，会造成死循环

## 推荐

在setState时使用函数传递state值，在回调函数中获取最新更新后的state。