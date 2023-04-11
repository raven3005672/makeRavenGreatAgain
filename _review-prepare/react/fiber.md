react 工作流程

template(jsx) => AST => fiber Tree(单链表) => DOM Tree


fiber之前的reconcilation
- 递归对比vdom树，找出需要变动的节点，同步更新。
- 会一直占用浏览器的资源

- requestIdleCallback 可以在浏览器处于闲置状态时调度一个低优先级的函数去执行。
- requestAnimationFrame 调度一个高优先级的函数在下一个动画帧被执行。

通过fiber使reconcilation可中断。


react渲染流程和fiber三个阶段

- 调度scheduleRoot、调和Reconcilation、提交commitRoot
- 只有调和是异步的


diff（17+）
根据老的fiber树和新的JSX对比生成fiber树的过程。

- 只对同级节点进行对比
- 不同类型元素会产出不同的机构
- 可以通过key识别移动的元素


1. 每次 react 更新，fiber tree 都会进行协调，找到发生变化的 fiber node，标记并收集 effect。等 fiber tree 协调结束后，处理收集的 effect；
2. fiber tree 协调时采用的深度优先遍历。
3. workInProgress fiber tree 的节点的生成方式有三种：复用 current fiber node、克隆 current fiber node、新建 fiber node；
4. 协调时，如果组件节点及子组件的 render 方法没有触发，子节点可直接复用 current fiber node，否则要通过 diff 算法来决定如何创建子节点；
5. diff 算法只比较已匹配的父节点的子节点，不跨父节点比较；
6. diff 比较时，如果 react element 和 current fiber node 的 key 和 type 都一致，那么就可以拷贝 current fiber node，否则要重新创建一个 fiber node；
7. fiber tree 协调结束以后，会使用一个单链表收集标记 effect 的 fiber node。链表中 fiber node 的顺序为子节点、子节点的兄弟节点、父节点。





