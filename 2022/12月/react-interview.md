## 声明周期（类组件）

- 挂载
  - constructor
  - getDerivedStateFromProps
  - render
  - componentDidMount
- 更新
  - getDerivedStateFromProps
  - shouldComponentUpdate
  - render
  - getSnapShotBeforeUpdate
  - componentDidUpdate
- 卸载
  - componentWillUnmount
- 错误捕捉
  - getDerivedStateFromError（errorBoundary中使用）
  - componentDidCatch

## 合成事件

React基于浏览器的事件机制实现了一套自身的事件机制，它符合W3C规范，包括事件触发、事件冒泡、事件捕获、事件合成和事件派发等

- 在底层磨平不同浏览器的差异，React实现了统一的事件机制，我们不再需要处理浏览器事件机制方面的兼容问题，在上层面向开发者暴露稳定、统一的、与原生事件相同的事件接口
- React把握了事件机制的主动权，实现了对所有事件的中心化管控
- React引入事件池避免垃圾回收，在事件池中获取或释放事件对象，避免频繁的创建和销毁

虽然合成事件不是原生DOM事件，但它包含了原生DOM事件的引用，可以通过e.nativeEvent访问。

事件委托

React16的事件绑定在document上， React17以后事件绑定在container上,ReactDOM.render(app,container)

## dispatchEvent事件分发

事件触发 =》 dispatchEvent =》 创建合成事件对象SyntheticEvent =》 收集捕获阶段的回调函数和节点实例 =》 收集冒泡阶段的回调函数和节点实例 =》 按顺序执行合成事件对象SyntheticEvent

## 手动绑定this

react组件会被编译为react.createElement，this丢失，不是组件实例了

## 阻止事件冒泡

- 阻止合成事件的冒泡用e.stopPropagation()
- 阻止合成事件和最外层document事件冒泡，使用e.nativeEvent.stopImmediatePropagation()
- 阻止合成事件和除了最外层document事件冒泡，通过判断e.target避免







