# React组件更新原理

<!-- https://zhuanlan.zhihu.com/p/59831684 -->

```js
class App extends React.Componet {
    constructor() {
        super();
        this.state = {
            text1: 1,
            text2: 1
        }
    }
    render() {
        return (
            <div id='a1'>
                <p>curr Data1: {this.state.text1}</p>
                <p>curr Data2: {this.state.text2}</p>
                <button onClick={() => {
                    this.setState({text1: 2})
                }}>setState</button>
            </div>
        )
    }
}
```

接下来我们快速简单的过一下setState的大概流程：

1. 触发setState函数，将触发setState的this和setState的参数传入enqueueSetState函数中。
2. enqueueSetState函数，提取当前触发setState的Fiber节点并将传入的setState的参数创建一个update对象，update对象中的payload就是传入的state对象。
3. enqueueUpdate函数，将当前Fiber的state和需要修改的state创建一个对象传入当前Fiber节点的updateQueue对象中。updateQueue对象有几个关键值，baseState（当前Fiber节点的state）、firstUpdate（首个更新任务）、lastUpdate（最后一个更新任务，防止多次重复setState）。
4. scheduleWork函数，更新子组件的时间戳
5. requestWork函数调用addRootToSchedule，并判断当前是否在渲染中，和是否批量更新。
6. addRootToSchedule，将root赋值到全局的firstScheduledRoot，lastScheduledRoot函数中。

经过上面的setState调用栈，最终我们得出的整个Fiber树中，已经包含了本次更新的任务在App的Fiber节点的updateQueue对象中了。因为我们现在是通过合成事件触发setState的，所以并不会立即触发performWorkOnRoot函数。然后会一层一层回到interactiveUpdates$1函数的调用栈中，最终执行performWork函数。

## performWork

在performWork函数中，会先通过findHighestPriorityRoot函数，将之前lastScheduledRoot变量赋值到nextFlushedRoot变量中（就是root）。通过将nextFlushedRoot传入到performWorkOnRoot函数中进行渲染。

![img](https://pic4.zhimg.com/80/v2-fb0e532722c7f42c1dbd2256e9e65d13_hd.jpg)

## performWorkOnRoot

在进入performWorkOnRoot函数时，会判断一个全局变量isRendering是否为true，如果为true代表当前正在执行performWorkOnRoot中，将会跳出本次渲染，等待下次，如果当前没有进行渲染，那么就会将全局的isRendering改为true。

最后就将当前的root对象传入renderRoot函数中进行render阶段。

改变state触发render，在updateClassinstance函数中会有如下逻辑

```js
var oldState = workInProgress.memoizedState;
var newState = instance.state = oldState;
var updateQueue = workInProgress.updateQueue;
if (updateQueue !== null) {
    processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
    newState = workInProgress.memoizedState;
}
```

1. workInProgress.memoizedState是当前组件的state
2. newState是新的state值

在setState的时候，将新的state作为一个任务存到updateQueue对象中。然后传入processUpdateQueue函数中，在processUpdateQueue函数中最终通过getStateFromUpdate函数返回新的state值。

在getStateFromUpdate中，会获取updateQueue中的firstUpdate的payload（setState传入的对象），如果本次触发render阶段的有传入state，那么将会和旧的state进行浅合并，范泽返回旧的state。

```js
if (typeof _payload2 === 'function') {
// Updater function
{
    if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
        _payload2.call(instance, prevState, nextProps);
    }
}
    partialState = _payload2.call(instance, prevState, nextProps);
} else {
    // Partial state object
    partialState = _payload2;
}
if (partialState === null || partialState === undefined) {
    // Null and undefined are treated as no-ops.
    return prevState;
}
// Merge the partial state and the previous state.
return _assign({}, prevState, partialState);
```

最终updateQueue本来的baseState会被新的state替换，并将Fiber中的memoizedState替换为新的state。现在的Fiber节点中已经不存在旧的state，在执行processUpdateQueue函数钱，updateClassInstance函数内已经将旧的state保存在old_state变量中。

如果newProps === oldProps && newState === oldState的话，将会return false；

```js
if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
    // If an update was already in progress, we should schedule an Update
    // effect even though we're bailing out, so that cWU/cDU are called.
    if (typeof instance.componentDidUpdate === 'function') {
        if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.effectTag |= Update;
        }
    }
    if (typeof instance.getSnapshotBeforeUpdate === 'function') {
        if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
            workInProgress.effectTag |= Snapshot;
        }
    }
    return false;
}
```

这里可以知道为什么我们state有时候不会触发更新，例如text1是一个对象，我们修改它里面的值，因为最终我们修改的只是对象内部的属性，state.text1是没有改变内存地址，导致两个state对比是没有变化的。

当前我们触发了setState并且将text1的值从1改为2，所以state将不相等，所以将会跳入后面的代码。

之后会调用checkShouldComponentUpdate函数，该函数就是检测当前的Fiber节点中，是否有注册shouldComponentUpdate函数，如果有，就会调用它将其返回结果return到updateClassInstance函数中，没有则返回true到后续调用流程中。

## updateClassInstance

```js
function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
    var instance = workInProgress.stateNode;
    if (typeof instance.shouldComponentUpdate === 'function') {
        startPhaseTimer(workInProgress, 'shouldComponentUpdate');
        var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
        stopPhaseTimer();
        {
            !(shouldUpdate !== undefined) ? warningWithoutStack$1(false, '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', getComponentName(ctor) || 'Component') : void 0;
        }
        return shouldUpdate;
    }
    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
    return true;
}
```

因为当前demo中没有注册shouldComponentUpdate函数，所以会直接return true。

最终将新的props和state赋值到Fiber中的stateNode属性的props和state中，stateNode就是不同类型组件的实体类型，如果是一个class的Fiber，那么stateNode就是class本身，如果是html组件，那么stateNode就是实际的dom节点。

最终updateClassInstance函数返回shouldUpdate到updateClassInstance函数中。

## finishClassComponent

```js
finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime)
```

在finishClassComponent函数中，无论是否更新，都会更新refs的值（触发refs的回调函数）。

如果传入的shouldUpdate为false的话，会执行bailoutOnAlreadyFinishedWork函数。当前我们的shouldUpdate是true，所以继续往下看。

之后会触发当前Fiber的stateNode的render方式将class实例化出一个reactElement出来。这个时候reactElement因为外层的class的state变化，已经有所不同。之前是1，现在是2。

之后通过调用reconcileChildren函数，将实例化后的reactElement转换为Fiber节点保存到当前Fiber节点的child属性中。

因为现在在render阶段，那么workLoop会一直递归查找整个Fiber树的每一个Fiber节点的变化。回到我们的demo里，这次的setState影响的是其中一个p标签的值，所以我们直接跳到workLoop对受影响的p标签有什么操作。

可以从断点中发现，原生html标签的Fiber节点描述标签内的任何东西是通过props来描述的。

在p标签中显示text1变量在Fiber节点中就是p标签的Fiber节点的props是1，下一个text的值是2.

* memoizedProps -> 当前props
* pendingProps -> 下一个props

在调用performUnitOfWork函数时，将pengdingProps赋值到memoizedProps中，然后继续workLoop去render新的Fiber树。

直到完成workLoop，返回出renderRoot函数中的时候，更新state的render阶段就已经结束了。

接下来我们图解一下整个阶段发生了什么事情。

![img](https://pic2.zhimg.com/80/v2-d674e97951f737bfc3e711c9c9cc7c8d_hd.jpg)

在render阶段，react还需要知道它需要更新的是什么，其中有几个关键的变量。

1. effectTag -> 决定如何赋值firstEffect、lastEffect和nextEffect
2. firstEffect -> 首次更改效果
3. lastEffect -> 最后一次更改效果
4. nextEffect -> 下一次更改效果

## Fiber树其实有两颗

在每一次的renderRoot阶段，都会建立nextUnitOfWork变量。而这个变量是通过createWorkInProgress函数创建的（传入root）。

createWorkInProgress函数中会判断当前的RootFiber节点是否已经存在laternate节点（备用节点）。如果有则将RootFiber中的一些值更新到备用节点上，如果没有就新建一个备用节点。

在renderRoot函数中会将当前的Fiber节点传入createWorkInProgress函数中，最终返回备用节点，并赋值到nextUnitOfWork。然后整个workLoop的工作都将会在备用节点完成，最终形成一个备用树。包括上面说到的一切操作，都是在当前节点的备用节点上进行的，并不会改变当前节点的任何信息。

每个节点中的备用节点和当前节点的关系

![img](https://pic2.zhimg.com/80/v2-072b4eea75efd337e694380ffb0f64cd_hd.jpg)

经过render阶段后的两个树的状态

![img](https://pic4.zhimg.com/80/v2-4528e637c60e9947538ab2c8933e0e53_hd.jpg)

备用树和当前树的alternate是刚好相反的。而在setState后，备用树的所有需要改变的值都已经更新了。

## commit阶段

经过render阶段对state和props的更新判断后，已经建立好了两个不一样的Fiber树了，接下来就去commit阶段了。

```js
onComplete(root, rootWorkInProgress, expirationTime);
```

其中root是当前的root节点对象，rootWorkInProgress备用树。

因为是通过setState触发了更新，最终生成的备用树中，受影响的节点只有一个p标签的一个内容，那么在进入到commitRoot函数中的时候，获取到的firstEffect就是Text组件的Fiber，因为触发state修改了p标签内的Text组件。

在commitRoot函数中，会根据当前firstEffect类型执行不同的更新方式，现在我们是属于一个Text组件，那么最终触发的是commitAllHostEffects函数。在commitAllHostEffects函数中会根据effectTag的标识来决定更新方式，将会执行update的方式进行更新，进入commitWork函数。

commitWork函数会根据当前的组件类型选择不同更新方式，现在是一个Text组件，所以会执行commitTextUpdate函数进行更新。

```js
function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
}
```

到此，基本上整个更新的流程已经跑过一遍了，但是这个只是最简单的更新。稍微复杂的有两个例子：

1. 如果更新的组件会涉及多个会如何更新
2. 如果更新后组件不是改变文字内容，而是渲染不同的组件

### 如果更新的组件会涉及多个会如何更新

```js
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            text1: 1,
            text2: 1
        }
    }

    render() {
        return (
            <div id='a1'>
                <p>{this.state.text1}</p>
                <p>{this.state.text1}</p>
                <button onClick={() => {
                    this.setState({text1: 2})
                }}>setState</button>
            </div>
        )
    }
}
```

在触发setState的时候，在render阶段，两个p标签因为内容需要更新，所以两个p标签的Fiber节点的effectTag都为4。

那么在completeUnitOfWork函数决定更新的顺序就有变化了。

第一个的p标签Fiber节点执行完completeUnitOfWork后，父级div的Fiber节点的更新顺序如下

![img](https://pic4.zhimg.com/80/v2-4b80b192549a673b7f78ab1a9dcc6347_hd.jpg)

第二个的p标签Fiber节点执行完completeUnitOfWork后，父级div的Fiber节点的更新顺序如下

![img](https://pic2.zhimg.com/80/v2-aff6e44ab3807075afe0e39b69aa53cd_hd.jpg)

第三个button标签Fiber节点执行完completeUnitOfWork后，父级div的Fiber节点的更新顺序如下

![img](https://pic3.zhimg.com/80/v2-87c3c1e1be04ec74b299130f4632977e_hd.jpg)

button没有改变也会更新的原因，是在diff对比中，因为button中存在onClick属性，所以diff算法会对它特殊处理，会判断需要重新渲染。

最终在commitWork函数中，会循环根Fiber节点，因为这次是修改多个属性，所以渲染完firstEffect的Fiber后，会找firstEffect的Fiber节点是否存在nextEffect，如果存在则继续递归完成所有渲染。

### 更新state渲染不同的组件

```js
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            text1: 1,
            text2: 1
        }
    }

    render() {
        return (
            <div id='a1'>
                {this.state.text1 == 1 ? <p>curr text 1</p> : <p>curr text 2</p>}
                <button onClick={() => {
                    this.setState({text1: 2})
                }}>setState</button>
            </div>
        )
    }
}
```

在render阶段的时候，当监理div的Fiber节点的时候，需要循环divFiber节点的children属性。这个时候children是两个reactElement，分别为p和button。

在updateElement函数中，有这么一段逻辑，如果当前传入的reactElement的类型和当前对应节点的类型是同样的话，会复用Fiber节点，只需要修改当前节点的备用节点（alternate）。否则会新建一个FIber节点，并且将当前父级几点的firstEffect和lastEffect设置为旧的Fiber节点，并设置父级Fiber节点的effectTag为8。

```js
function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    var last = returnFiber.lastEffect;
    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.effectTag = Deletion;
  }
```

这里有一个优化的点，就是如果对不同state进行判断渲染不同的组件的时候，应该尽量使用相同的HTML标签，减少react写在元素和重新创建Fiber节点的操作。使用同样的HTML标签能让react对需要改变的标签替换内容即可。

## diff

整个更新流程下来了，其实决定如何更新的是通过firstEffect、lastEffect、nextEffect和effectTag。那么diff在哪里呢？

diffProperties函数就是diff算法的函数。

在render的最后阶段，会对比新旧Fiber节点的不一样，去决定是否更新Fiber节点。

diff算法网上有很多教学，大概就是新旧的props会根据不同的参数，例如style、children、dangerouslySetInnerHTML等等不同的参数会有不同的对比方式。最终返回更新内容的一个数组，然后为对应Fiber节点的effectTag打上标记，然后在commit阶段就知道应该如何更新组件了。
