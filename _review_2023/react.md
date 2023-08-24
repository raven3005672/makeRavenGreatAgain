# React

## react事件

react会将所有的事件都绑定到document上，而不是某个元素上面，统一的使用事件监听，并在冒泡阶段处理事件，当挂载和卸载组件的时候 只需在统一的事件监听位置，增加或删除对象，因此极大的提高效率；当事件触发的时候，我们的组件会生成一个合成事件，然后传递到document中，document会通过DispatchEvent回调函数依次执行DispatchEvent中同类型的事件监听函数，事件注册是在组件生成的时候，我们将vDom中所有的事件的原生事件document中的一个监听器当中，也就是所有的事件处理函数都存在ListenerBank中 并以key作为索引，这样的好处是将可能要触发的事件分门别类。

react事件要素

- react事件是合成事件，不是DOM原生事件(addEventListener)
- 在document监听所有支持的事件
- 使用统一的分发函数dispatchEvent

React基于浏览器的事件机制自身实现了一套事件机制。包括事件注册、事件的合成、事件冒泡、事件派发等
React 上注册的事件最终会绑定在document这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)
如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 nativeEvent 属性来获取即可。
React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation()无效的原因。
React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
React 有一套自己的合成事件 SyntheticEvent

捕获是向下，到目标，冒泡是向上

16：绑定document
17：绑定root

16：原生事件先执行，冒泡到document时候统一执行合成事件
17：原生事件执行前限制性合成事件捕获阶段，原生事件执行后执行冒泡阶段的合成事件




其他答案
React 根据 W3C 规范定义了每个事件处理函数的参数，即合成事件。
所有事件都挂在到document上
event不是原生的，是合成事件对象
如果因为某些原因，当你需要使用浏览器的底层事件时，只需要使用 nativeEvent 属性来获取即可。

react为何要合成事件机制？

更好的兼容性和跨平台
挂在到document，减少内存消耗，避免频繁解绑 document，减少内存消耗，避免频繁解绑
方便事件统一管理（如事务机制）

## react hooks原理

修改核心是将useState，useEffect按照调用的顺序放入memoizedState中,每次更新时，按照顺序进行取值和判断逻辑，我们根据调用hook顺序，将hook依次存入数组memoizedState中，每次存入时都是将当前的currentcursor作为数组的下标，将其传入的值作为数组的值，然后在累加current cursor，所以hook的状态值都被存入数组中memoizedState。先将旧数组memoizedState中对应的值取出来重新赋值，从而生成新数组memoizedState。对于是否执行useEffect通过判断其第二个参数是否发生变化而决定的。
这里我们就知道了为啥不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们。因为我们是根据调用hook的顺序依次将值存入数组中，如果在判断逻辑循环嵌套中，就有可能导致更新时不能获取到对应的值，从而导致取值混乱。同时useEffect第二个参数是数组，也是因为它就是以数组的形式存入的。

## use(Layout)Effect区别

hooks是链表，next指向下一个hooks。所以不能在条件判断语句里处理

单个的effect对象包括以下几个属性：
- create: 传入useEffect or useLayoutEffect函数的第一个参数，即回调函数；
- destroy: 回调函数return的函数，在该effect销毁的时候执行，渲染阶段为undefined；
- deps: 依赖项，改变重新执行副作用；
- next: 指向下一个effect；
- tag: effect的类型，区分是useEffect还是useLayoutEffect；

use(Layout)Effect
- render阶段：函数组件开始渲染的时候，创建出对应的hook链表挂载到workInProgress的memoizedState上，并创建effect链表，也就是挂载到对应的fiber节点上，但是基于上次和本次依赖项的比较结果，创建的effect是有差异的。这一点暂且可以理解为：依赖项有变化，effect可以被处理，否则不会被处理。
- commit阶段：异步调度useEffect或者同步处理useLayoutEffect的effect。等到commit阶段完成后，更新应用到页面上之后，开始处理useEffect产生的effect，或是直接处理commit阶段同步执行阻塞页面更新的useLayoutEffect产生的effect。

第二点提到了一个重点，就是useEffect和useLayoutEffect的执行时机不一样，**前者被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。 后者是在commit阶段新的DOM准备完成，但还未渲染到屏幕之前，同步执行。**

useEffect的callback放到requestIdleCallback中执行（由浏览器调度）。useLayoutEffect会在条件判断时候直接直接执行。

## fiber

基于浏览器的单线程调度算法。

作为架构来说，在旧的架构中，Reconciler（协调器）采用递归的方式执行，无法中断，节点数据保存在递归的调用栈中，被称为 Stack Reconciler，stack 就是调用栈；在新的架构中，Reconciler（协调器）是基于 fiber 实现的，节点数据保存在 fiber 中，所以被称为 fiber Reconciler。

作为静态数据结构来说，每个 fiber 对应一个组件，保存了这个组件的类型对应的 dom 节点信息，这个时候，fiber 节点就是我们所说的虚拟 DOM。

作为动态工作单元来说，fiber 节点保存了该节点需要更新的状态，以及需要执行的副作用。

多个fiber是**链表**

fiber节点拥有parent，child，sibling三个属性。

reconciliation可以打断 —— 找到需要更新哪些dom
commit不能打断 —— 一口气更新完

首次构建，创建一个fiberRoot。render渲染会创建一个rootFiber。当一次挂载完成时，fiberRoot的current属性会指向rootFiber，挂载完成后制造一个workInProgress树（更新中的操作发生在workInProgress树上，更新完成后将变成current树用于渲染视图），当前的current树的alternate会作为新的workInProgress。

## diff

react：双指针算法
vue：双端队列算法

- tree diff：同级比较
- component diff：type不同整体替换
- element diff：唯一性key

## useEffect浅比较

内部是for循环配合Object.is

## setState同步异步

v18之前，只在事件处理函数中实现了批处理

- 合成事件和钩子函数中是异步的，原生事件和setTimeout中是同步的。
- 原因是合成事件和钩子函数的调用顺序在更新之前，导致其中没法拿到更新后的值，形成了异步。
- 批量更新优化也是建立在异步之上，原生事件和setTimeout中不会批量更新。
- 在异步中如果对同一个值进行多次setState，批量更新策略会对其进行覆盖，取最后一次执行，如果是不同的值，在更新时会对其进行合并批量更新。

v18之后

- 所有更新都是自动批处理（异步）
- 想要立即更新的话使用flushSync

## v16-v18

- v16：async Mode 异步模式
- v17：concurrent Mode 并发模式
- v18：concurrent Render 并发更新

render - commit

- async下render一次性完成
- concurrent下render阶段可以被拆解中断
- commit阶段有DOM更新，必须一次性完成

- useSyncExternalStore
- useTransition降低渲染优先级 —— 给一个状态
- useDeferredValue允许变量延时更新 —— 给一个值
- useInsertionEffect 同步更新 》useLayoutEffect》useEffect（仅css-in-js库使用）
- useId 唯一id，避免 hydration 不匹配的hook

## 组件的一些设计模式

- Mixin
  - Mixin 可能会相互依赖，相互耦合，不利于代码维护;
  - 不同的 Mixin 中的方法可能会相互冲突;
  - Mixin非常多时，组件是可以感知到的，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性;
- 装饰器模式
- HOC高阶组件，可以视作是装饰器模式的一种实现
  - 复用逻辑: 高阶组件就像是一个加工 React 组件的工厂,你需要向该工厂提供一个坯子,它可以批量地对你送进来的组件进行加工,包装处理,还可以根据你的需求定制不同的产品;
  - 强化props: 高阶组件返回的组件,可以劫持上一层传过来的 props,染回混入新的 props,来增强组件的功能;
  - 控制渲染: 劫持渲染是 hoc 中的一个特性,在高阶组件中,你可以对原来的组件进行条件渲染,节流渲染,懒加载等功能;
- render props 模式
- 提供者模式

## antd的form

使用useContext + Provider实现的

## 单测

@testing-library/react
fireEvent测onClick等
act包装组件模拟浏览器内工作方式
renderHook测hooks

## react-router

- history是react-router的核心，popState，pushState
- react-router是react-router-dom的核心，Router，Route，Switch
- react-router-dom，添加了Link，BrowserRouter，HashRouter（history.createXXXHistory）

## 单页面实现

- history
  - history.pushState(state, title, path)
  - window.addEventListener('popstate', () => {});
- hash
  - location.hash变化
  - window.addEventListener('hashchange', () => {})

## CSR/SSR/SSG

- CSR - 常用
- SSR - seo效果好
  - node引入
  - 响应时间长
  - 首屏交互不佳（首屏不可交互）
- SSG - 构建时生成
  - 服务端托管构建生成的静态页面
