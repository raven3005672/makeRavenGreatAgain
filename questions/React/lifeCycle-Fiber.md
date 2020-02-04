# react16-fiber

<!-- https://zhuanlan.zhihu.com/p/87363431 -->

## 新的生命周期

![img](https://pic1.zhimg.com/v2-6d3a2c3c9c2743ed7c1fed97360e44cc_r.jpg)

### 为什么需要新的生命周期

上面介绍了React16带来的新的生命周期，那么为什么需要修改之前的生命周期呢？

是因为新的react引入了异步渲染机制，主要的功能是，在渲染完成前，可以中断任务，中断之后不会继续执行生命周期，而是重头开始执行生命周期。这导致上述的componentWillMount，componentWillReceiveProps，componentWillUpdate可能会被中断，导致执行多次，带来意想不到的情况。

为什么需要异步渲染？

我们都知道在react16之前，react对virtual dom 的渲染是同步的，即每次将所有操作累加起来，统计对比出所有的变化后，统一更新一次DOM树，随着组件层级的深入，由于渲染更新一旦开始就无法停止，导致主线程长时间被占用，这也是react在动画，布局和手势等区域会有造成掉帧、延迟响应（甚至无响应）等不佳体验。

## React Fiber

### 目的

为了解决这个问题，react推出了Fiber，它能够将渲染工作分割成块并将其分散到多个帧中。同时加入了在新更新进入时暂停，中止或重复工作的能力和为不同类型的更新分配优先级的能力。

### 分割什么

react渲染大抵可以分为 reconciler（调度阶段）和 commit（渲染阶段），前者用于对比，后者用于操作dom，reconciler阶段可以算是一个从顶向下的递归算法，主要工作是对current tree 和 new tree做计算，找出变化部分。commit阶段是对在reconciler阶段获取到的变化部分应用到真实的DOM树中,在绝大部分运用场景中，reconciler阶段的时间远远超过commit，因此fiber选择将reconciler阶段进行分割。

### 分割成什么

Fiber的拆分单位是fiber（fiber tree上的一个节点），这里引入了fiber tree的概念，fiber tree实际上是个单链表树结构，由fiber构成，fiber tree是根据和之前的virtual dom tree的树结构一模一样，只是节点携带的信息有差异。

```js
export type Fiber = {
   return: Fiber|null, // 父节点
   child: Fiber|null, // 子节点
   sibling: Fiber|null, // 兄弟节点
   alternate: Fiber|null, //diff后差异信息
   .....
};
```

而这就是Fiber解决问题的思路，把之前无法中断的diff递归（持续占据主线程）拆分成一系列小任务，每次检查树上的一小部分，由于树上挂载了更多的上下文信息，因此可以选择是否继续下一个任务（时间是否允许当前帧（16ms）），而上面提到的alternate，则是一开始指向一个fiber tree的clone对象，每次任务完成会先将变化更新到这个克隆体上，等到diff结束，在进行commit。

### workInProgress tree是什么？

```js
export function createWorkInProgress(
  current: Fiber,
  pendingProps: any,
  expirationTime: ExpirationTime,
): Fiber {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    if (__DEV__) {
      // DEV-only fields
      workInProgress._debugID = current._debugID;
      workInProgress._debugSource = current._debugSource;
      workInProgress._debugOwner = current._debugOwner;
    }

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.effectTag = NoEffect;
    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
  }

  workInProgress.expirationTime = expirationTime;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
}
}
```

我们通过源码可以看见，这其实就是之前我们提到的那个克隆体，workInProgress tree上每个节点都有一个effect list，用来存放需要更新的内容。而它的alternate则指向当前的fiber节点，这一点很关键，它可以复用之前的fiber树，下一次更新时不用重新创建fiber树，而可以更新fiber树，然后对应到相应的workInProgress tree上，完成了缓存的工作。

### 任务的优先级由什么决定

浏览器提供的requestIdleCallback API中的Cooperative Scheduling可以让浏览器在空闲时间执行回调（开发者传入的方法），在回调参数中可以获取到当前帧剩余的时间。利用这个信息可以合理的安排当前帧需要做的事情，如果时间足够，那继续做下一个任务，如果时间不够就歇一歇，调用requestIdleCallback来获知主线程不忙的时候，再继续做任务。

源码中的computeExpirationForFiber函数，该方法用于计算fiber更新任务的最晚执行时间，进行比较后，决定是否继续做下一个任务。 https://github.com/facebook/react/blob/16.8.4/packages/react-reconciler/src/ReactFiberScheduler.js#L1595

```js
function computeExpirationForFiber(currentTime: ExpirationTime, fiber: Fiber) {
  let expirationTime;
  if (expirationContext !== NoWork) {
    // An explicit expiration context was set;
    expirationTime = expirationContext;
  } else if (isWorking) {
    if (isCommitting) {
      // Updates that occur during the commit phase should have sync priority
      // by default.
      expirationTime = Sync;
    } else {
      // Updates during the render phase should expire at the same time as
      // the work that is being rendered.
      expirationTime = nextRenderExpirationTime;
    }
  } else {
    // No explicit expiration context was set, and we're not currently
    // performing work. Calculate a new expiration time.
    if (fiber.mode & ConcurrentMode) {
      if (isBatchingInteractiveUpdates) {
        // This is an interactive update
        expirationTime = computeInteractiveExpiration(currentTime);
      } else {
        // This is an async update
        expirationTime = computeAsyncExpiration(currentTime);
      }
      // If we're in the middle of rendering a tree, do not update at the same
      // expiration time that is already rendering.
      if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
        expirationTime -= 1;
      }
    } else {
      // This is a sync update
      expirationTime = Sync;
    }
  }
  if (isBatchingInteractiveUpdates) {
    // This is an interactive update. Keep track of the lowest pending
    // interactive expiration time. This allows us to synchronously flush
    // all interactive updates when needed.
    if (
      lowestPriorityPendingInteractiveExpirationTime === NoWork ||
      expirationTime < lowestPriorityPendingInteractiveExpirationTime
    ) {
      lowestPriorityPendingInteractiveExpirationTime = expirationTime;
    }
  }
  return expirationTime;
}
```

源码中的ReactFiberExpirationTime中描述了任务的优先级，用ExpirationTime的到期时间方式表示任务的优先级。

```js
export type ExpirationTime = number;

export const NoWork = 0;
export const Never = 1;
export const Sync = MAX_SIGNED_31_BIT_INT;

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = MAX_SIGNED_31_BIT_INT - 1;

// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - ((ms / UNIT_SIZE) | 0);
}
```

取代了15版本对优先级的简单划分

```js
module.exports = {
  NoWork: 0, // No work is pending.
  SynchronousPriority: 1, // For controlled text inputs. Synchronous side-effects.
  AnimationPriority: 2, // Needs to complete before the next frame.
  HighPriority: 3, // Interaction that needs to complete pretty soon to feel responsive.
  LowPriority: 4, // Data fetching, or result from updating stores.
  OffscreenPriority: 5, // Won't be visible but do the work in case it becomes visible.
};
```

### 更新队列（UpdateQueue）

我们知道如果需要实现组件的异步更新，肯定需要在更新前将更新任务进行存储，然后异步任务开始的时候读取更新并实现组件更新，存储更新任务就需要一个数据结构，最常见的就是栈和队列，Fiber的实现方式就是队列。
这一部分内容在源码ReactUpdateQueue有详细描述，感兴趣的可以继续研究下去，包括如何根据优先级插入和更新队列。
