// 改变了之前react的组件渲染机制，新的架构使原来同步渲染的组件现在可以异步化，可中途中断渲染，执行更高优先级的任务。释放浏览器主线程。

// 原有的组件生命周期
// 挂载阶段
constructor => componentWillMount => render => componentDidMount
// 更新阶段
componentWillReceiveProps => shouldComponentUpdate => componentWillUpdate => render => componentDidUpdate

// 如果是一个很大，层级很深的组件，react渲染它需要很久，在这期间，react会一直占用浏览器主线程，任何其他的操作(包括用户的点击，鼠标移动等操作)都无法执行。

// Fiber架构就是为了解决这个问题

// 加入fiber的react将组件更新分为两个时期
phase1
phase2
// 这两个时期以render为分界

// phase1的生命周期是可以被打断的，每隔一段时间它会跳出当前渲染进程，去确定是否有其他更重要的任务。
// 此过程，React在workingProgressTree(并不是真是的virtualDomTree)上复用current上的Fiber数据结构来异步地(通过requestIdleCallback)来构建新的tree，标记出需要更新的节点，放入队列中。

// phase2的生命周期是不可被打断的，React将其所有的变更一次性更新到DOM上。

// 对于phase1时期，如果不被打断，那么phase1执行完会直接进入render函数，构建真实的virtualDomTree
// 如果组件在phase1过程中被打断，即当前组件只渲染到一半(也许是在willMount，也许是willUpdate，反正是在render之前的生命周期)，那么react会放弃当前组件所有干到一半的事情，去做更高优先级更重要的任务。
// 当所有高优先级任务执行完之后，react通过callback回到之前渲染到一半的组件，从头开始渲染。(此处放弃了已经渲染完的生命周期)

// 这样一来，所有phase1的生命周期函数都可能被执行多次，因为可能会被打断重来。
// 我们最好保证phase1的生命周期每一次执行的结果都是一样的，最好都是纯函数。

// 可能存在的问题：如果高优先级任务一直存在，那么低优先级的任务则永远无法进行，组件永远无法继续渲染。
