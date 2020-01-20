# setState

<!-- https://zhuanlan.zhihu.com/p/56507101 -->

1. this.setState是从哪里来的
2. 为什么在短时间内连续setState两次甚至多次只会触发一次render
3. 为什么setState是异步的

```js
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            data: 1
        }
    }
    render() {
        console.log('---render App---');
        return (
            <div>
                <p>text</p>
                <button onClick={() => {this.setState({data: 2})}}>setState</button>
            </div>
        )
    }
}
```

## this.setState是从哪里来的

之前的文章中又说道beginWork这个函数，会对不同类型的组件进行不同处理最终返回出一个Fiber节点，每一个class类型的Fiber节点都会在beginWork这个函数中调用updateClassComponent函数，而updateClassComponent会调用constructClassInstance函数，在constructClassInstance会将当前的class组件实例化出来（class组件就是App组件），因为App组件时继承与React.Component的。所以当实例化的时候，在React.Component的原型上的setState将会被App组件所继承。

```js
Component.prototype.setState = function(partialState, callback) {
    invariant(
        typeof partialState === 'object' || typeof partialState === 'function' || partialState == null,
        'setState(...): takes ana object of state variables to update or a function which returns an object of state variablees.',
    );
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
```

这里说一下updater属性，因为在setState中调用的就是updater中的enqueueSetState函数。enqueueSetState函数是从constructClassInstance函数中实例化了class后，执行了一个adoptClassInstance函数，在里面对实例的对象的updater进行了赋值，并且将当前实例的Fiber节点赋值到实例的_reactInternalFiber属性中，留到之后使用。

```js
var calssComponentUpdater = {
    isMounted: isMounted,
    enqueueSetState: function(inst, payload, callback) {
        ...
    },
    enqueueReplaceState: function(inst, payload, callback) {
        ...
    },
    enqueueForceUpdate: function(inst, callback) {
        ...
    }
}
```

## setState批量处理

关于为什么在短时间内setState多次只会触发一次render的问题，其实涉及面比较广，里面包含了一些合成事件（Synethic event）的一些问题，但是本文主要关注setState的内容，这里不会详细去说明合成事件的事情。

当我们点击button按钮触发onClick事件的时候，会通过合成事件分发对应的回调函数，执行onClick中的内容。在onClick函数中，我们进行了一次setState。执行了enqueueSetState函数。在函数内有几个重要的步骤：

1. createUpdate：创建了一个update对象
2. enqueueUpdate：创建updateQueue对象，将update对象存入到当前Fiber节点的updateQueue对象中的firstUpdate和lastUpdate中。
3. scheduleWork：调用requestWork函数

在requestWork函数中有一个很重要的代码，决定这次setState是否会批量处理

```js
function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
    addRootToSchedule(root, expirationTime);
    if (isRendering) {
        // ...
        return;
    }
    if (isBatchingUpdates) {
        // ...
        if (isUnbatchingUpdates) {
            // ...
            nextFlushedRoot = root;
            nextFlushedExpirationTime = Sync;
            performWorkOnRoot(root, Sync, false);
        }
        return;
    }
    // ...
    if (expirationTime === Sync) {
        performSyncWork();
    } else {
        scheduleCallbackWithExpirationTime(root, expirationTime);
    }
}
```

如果这次的setState并不是由合成事件触发的，那么isBatchingUpdates将会为false。如果为false就会直接执行performSyncWork函数了，马上对这次setState进行diff和渲染。

其中如果多次setState的话，enqueueUpdate函数会对多次setState所传入的state进行替换。

从上面的代码解析，也明白之前的两个问题：

1. 为什么在短时间内连续setState两次甚至多次只会触发一次render
2. 为什么setState是异步的

连续setState多次只触发一次render就是因为经过了合成事件的关系，合成事件先执行了onClick函数中的setState，修改了Fiber的updateQueue对象的任务，执行完onClick函数体后，再由合成事件让根Fiber就行渲染（当然这只是简化的说法而已）。所以无论你在一个事件内触发无数次setState，也只会触发一次render。

其实我们在生命周期内进行setState的话，也不会立马进行setState的，React的内部是有处理的，当React的组件还没有渲染完成的时候，isRendering是为true的。

## 为什么setState是异步的

合成事件会先执行onClick中的setState，但是并不会马上进行渲染，所以新的state只存在于Fiber节点的updateQueue中，并不会马上赋值到组件的state中。
