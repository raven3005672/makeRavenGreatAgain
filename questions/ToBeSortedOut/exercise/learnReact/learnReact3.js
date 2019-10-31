// 三、详解事务与更新队列
// 经常看到诸如transaction和UpdateQueue这样的代码，这涉及到React中的两个概念：事务和更新队列

// 1.setState相关
// 通过class声明的组件原型具有setState方法
// 该方法传入两个参数partialState和callBack，前者是新的state值，后者是回调函数。
ReactComponent.prototype.setState = function(partialState, callback) {
    this.updater.enqueueSetState(this, partialState);
    if (callback) {
        this.updater.enqueueCallback(this, callback, 'setState');
    }
};
// updater是在构造函数中进行定义的，找到哪里执行了new ReactComponent，就能找到updater是什么
function ReactComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
};
// 以自定义组件ReactCompositeComponent为例，在_constructComponentWithoutOwner方法中
{
    // ...
    return new Component(publicProps, publicContext, updateQueue);
}
// this.updater.enqueueSetState中的enqueueSetState
enqueueSetState = function(publicInstance, partialState) {
    // getInternalInstanceReadyForUpdate方法的目的是获取当前组件对象，将其赋值给internalInstance变量
    var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

    // 判断当前组件对象的state更新队列是否存在，如果存在则将partialState也就是新的state值加入队列，如果不存在则创建该对象的更新队列，队列以数组形式存在
    if (!internalInstance) {
        return;
    }
    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    queue.push(partialState);

    enqueueUpdate(internalInstance);
}

function enqueueUpdate(component) {
    if (!batchingStrategy.isBatchingUpdates) {
        batchingStrategy.batchedUpdates(enqueueUpdate, component);
        return;
    }
    dirtyComponents.push(component);
}

var ReactDefaultBatchingStrategy = {
    isBatchingUpdates: false,
    // batchedUpdates内部执行传入的回调函数
    batchedUpdates: function(callback, a, b, c, d, e) {
        var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

        ReactDefaultBatchingStrategy.isBatchingUpdates = true;

        if (alreadyBatchingUpdates) {
            callback(a, b, c, d, e);
        } else {
            transaction.perform(callback, null, a, b, c, d, e);
        }
    }
}
// React内部采用了状态机的概念，组件处于不同的状态时，所执行的逻辑并不相同。以组件更新流程为例，React以事务+状态的形式对组件进行更新。

// 2.transaction事务
{/* <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre> */}
// 每一个方法会被wrapper所包裹，必须用perform调用，在被包裹方法前后分别执行initialize和close

// 简单举例wrapper包裹的函数执行
function method() {
    console.log('111')
}
transaction.perform(method);
// 执行initialize方法
// 输出111
// 执行close方法

// wrapper避免可能死循环的问题
var RESET_BATCHED_UPDATES = {
    initialize: emptyFunction,
    close: function() {
        ReactDefaultBatchingStrategy.isBatchingUpdates = false;
    }
}
var FLUSH_BATCHED_UPDATES = {
    initialize: emptyFunction,
    close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
}
// isBatchingUpdates初始值为false，当以事务的形式执行transaction.perform(enqueueUpdate)时，实际上执行流程如下
RESET_BATCHED_UPDATES.initialize()  // 实际为空函数
enqueue()
RESET_BATCHED_UPDATES.close()

// RESET_BATCHED_UPDATES这个wrapper的作用是设置isBatchingUpdates也就是组件更新状态的值，组件有更新要求的话则设置为更新状态，更新结束后重新恢复原状态。
// 这样做的好处是避免组件的重复render，提升性能

var flushBatchedUpdates = function() {
    // flushBatchedUpdates方法循环遍历所有的dirtyComponents，又通过事务的形式调用runBatchedUpdates方法
    // 该方法主要做两件事，一是通过执行updateComponent方法来更新组件，二是若setState方法传入了回调函数则将回调函数存入callbackQueue队列
    while (dirtyComponents.length || asapEnqueued) {
        if (dirtyComponents.length) {
            var transaction = ReactUpdatesFlushTransaction.getPooled();
            transaction.perform(runBatchedUpdates, null, transaction);
            ReactUpdatesFlushTransaction.release(transaction);
        };
        // ...
    }
}

// updateComponent源码
updateComponent = function(transaction, prevParentElement, nextParentElement, prevUnmaskedContext, nextUnmaskedContext) {
    // ...
    if (willReceive && inst.componentWillReceiveProps) {
        if (ProcessingInstruction.env,NODE_ENV !== 'production') {
            measureLifeCyclePerf(function () {
                return inst.componentWillReceiveProps(nextProps, nextContext);
            }, this._debugID, 'componentWillReceiveProps');
        } else {
            inst.componentWillReceiveProps(nextProps, nextContext);
        }
    }
    var nextState = this._processPendingState(nextProps, nextContext);
    var shouldUpdate = true;

    if (!this._pendingForceUpdate) {
        if (inst.shouldComponentUpdate) {
            if (ProcessingInstruction.env.NODE_ENV !== 'production') {
                shouldUpdate = measureLifeCyclePerf(function () {
                    return inst.shouldComponentUpdate(nextProps, nextState, nextContext);
                }, this._debugID, 'shouldComponentUpdate');
            } else {
                shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
            }
            // ...
        }
    }

    if (shouldUpdate) {
        this._pendingForceUpdate = false;
        this._performComponentUpdate(nextParentElement, nextProps, nextState, nextContext, transaction, nextUnmaskedContext);
    }
}

// 在执行shouldComponentUpdate方法之前，执行了_processPendingState方法
_processPendingState = function(props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;
    // 如果更新队列为null，返回原来的state
    if (!queue) {
        return inst.state;
    }
    // 如果更新队列有一个更新，那么返回更新值
    if (replace && queue.length === 1) {
        return queue[0];
    }
    // 如果更新队列有多个更新，那么通过for循环将它们合并
    var nextState = _assign({}, replace ? queue[0] : inst.state);
    for (var i = replace ? 1 : 0; i < queue.length; i++) {
        var partial = queue[i];
        _assign(nextState, typeof partial === 'function' ? partial.call(inst, nextState, props, context) : partial);
    }
    
    return nextState;
}
// 在一个生命周期内，在componentShouldUpdate执行之前，所有state变化都会被合并，最后统一处理

// 在_updateComponent，最后如果shouldUpdate为true，执行_performComponentUpdate方法
_performComponentUpdate = function(nextElement, nextProps, nextState, nextContext, transaction, unmaskedContext) {
    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
    var prevProps;
    var prevState;
    var prevContext;
    if (hasComponentDidUpdate) {
        prevProps = inst.props;
        prevState = inst.state;
        prevContext = inst.context;
    }

    if (inst.componentWillUpdate) {
        if (ProcessingInstruction.env.NODE_ENV !== 'production') {
            measureLifeCyclePerf(function() {
                return inst.componentWillUpdate(nextProps, nextState, nextContext);
            }, this._debugID, 'componentWillUpdate');
        } else {
            inst.componentWillUpdate(nextProps, nextState, nextContext);
        }
    }
}

// 执行componentWillUpdate生命周期方法，更新完成后执行componentDidUpdate方法。
_updateRenderedComponent = function(transaction, context) {
    var prevComponentInstance = this._renderedComponent;
    var prevRenderedElement = prevComponentInstance._currentElement;
    var nextRenderedElement = this._renderValidatedComponent();

    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
        ReactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement, transaction, this._processChildContext(context));
    } else {
        var oldHostNode = ReactReconciler.getHostNode(prevComponentInstance);
        ReactReconciler.unmountComponent(prevComponentInstance, false);

        var nodeType = ReactNodeTypes.getType(nextRenderedElement);
        this._renderedNodeType = nodeType;
        var child = this._instantiateReactComponent(nextRenderedElement, nodeType !== ReactNodeTypes.EMPTY);        // shouldHaveDebugID
        this._renderedComponent = child;

        var nextMarkup = ReactReconciler.mountComponent(child, transaction, this._hostParent, this._hostContainerInfo, this._processChildContext(context), debugID);

        this._replaceNodeWithMarkup(oldHostNode, nextMarkup, prevComponentInstance);
    }
}
// 获取旧的组件信息 -> 获取新的组件信息 -> shouldUpdateReactComponent根据传入的新就组件信息判断是否进行更新
//   -> should函数返回true执行就组建的更新 -> should函数返回false执行旧组件的卸载和新组件的挂载

// (1)setState回调函数
// setState回调函数与state的流程相似，state有queueSetState处理，回调函数由enqueueCallback处理
// (2)关于setState导致的崩溃问题
// this.setState实际调用了enqueueSetState，在组件更新时，因为新的state还未进行合并处理，故在下面performUpdateIfNecessary代码中this._pendingStateQueue为true
performUpdateIfNecessary = function(transaction) {
    if (this._pendingElement != null) {
        ReactReconciler.receiveComponent(this, this._pendingElement, transaction, this._context);
    } else if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
        this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
    } else {
        this._updateBatchNumber = null;
    }
}
// 合并state后React会将this._pendingStateQueue设置为null，这样dirtyComponent进入下一次批量处理时，已经耿兴国的组件不会进入重复的流程，保证组件只做一次更新操作
// 所以不能再componentWillUpdate中调用setState的原因，就是setState会令_pendingStateQueue为true，导致再次执行updateComponent，而后会再次调用componentWillUpdate，最终循环调用componentWillUpdate导致浏览器的崩溃
// (3)关于React依赖注入
// 对于更新队列的标志batchingStrategy，我们直接转向对ReactDefaultBatchingStrategy进行分析，这是因为React内部存在大量的依赖注入。
// 在React初始化时，ReactDefaultInjection.js注入到ReactUpdates中作为默认的strategy。









