# hooks

<!-- https://zhuanlan.zhihu.com/p/68842478 -->

hooks主要为了解决什么问题：

* React团队认为组件之间复用状态逻辑很难
    * 就以前React为了将一个组件的逻辑抽离复用，不和渲染代码混用在一个class的做法，比较推荐的使用高阶组件，将状态逻辑抽离出来，通过不同的样式组件传入带有状态逻辑的高阶组件中，增强样式组件的功能，从而达到复用逻辑的功能。在早期就会使用mixin实现。
    * 增加嵌套层级，代码会更加难以理解
* 复杂组件变得难以理解
    在使用class组件的时候，我们少不了在生命周期函数中添加一些操作，例如调用一些函数，或者去发起请求，在销毁组件的时候为了防止内存溢出，我们可能还需要对一些事件移除。那么这个时候我们就需要在componentDidMount，componentDidUpdate中可能会调用相同的函数获取数据，componentWillUnmount中移除事件等。
    在使用class组件的时候，会有很多在生命周期中处理的事情，无论是获取dom的一些高度，或者发起请求，这些因为和组件有很强的耦合性，也很难通过高阶组件的方式抽离出来，而Hook将组件中关联的部分拆分成更小的函数，每个函数功能更加单一。
* Hook就是一个以纯函数的方式存在的class组件
    以前我们使用纯函数组件时都有一个标准，就是这个组件并不具备自身的生命周期使用，以及自己独立的state，只是单纯的返回一个组件，或者是根据传入的props组装组件。但随着Hook的发布，React团队是想将React更加偏向函数式变成的方式编写组件，来让纯函数组件变得可以使用class组件的一些特性。

官方demo

```js
import React, {useState, useEffect, Component} from 'react';
import ReactDOM from 'react-dom';

function Example(props) {
    // 声明一个新的叫做count的state变量
    const [count, setCount] = useState(0);
    return (
        <div>
            <h1>{props.name}</h1>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    )
}

class App extends Component {
    render() {
        return <Example name='lamho' />
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
```

## Hook - useState

useState其实是等价于setState的，只是useState需要在函数组件中使用。

```js
const [count, setCount] = useState(0);
// 等价于
// state: {
//     count: 0
// }
// function setCount(xx) {
//     setState({
//         count: xx
//     })
// }
```

像代码中的useState，传入的参数就是值，返回一个数组，第一个为key，第二个为修改该key的值的函数。换句话说，每一个state的声明和赋值都需要通过调用useState函数来完成。而设置代码中的count变量的值，都必须使用useState返回的setCount。

然后在demo中的button点击事件中，我们调用了setCount对count+1。

```js
<button onClick={() => setCount(count + 1)}>
    Click me
</button>
```

1. 声明state
2. 使用state的值进行渲染
3. 修改state的值
4. 更新组件

首先在render阶段，因为首次渲染，会对ReactElement进行解析，成为一个Fiber树。如果ReactElement是一个function的情况下，那么Fiber节点的tag标识是2，在beginWork函数中，会进入IndeterminateComponent函数中对function类型的Fiber节点实例化。

在renderWithHooks函数中：

* HooksDispatcherOnMountInDEV这个全局变量，保存了所有Hook的Api

readContext、useCallback、useContext、useDebugValue、useEffect、useImperativeHandle、useLayoutEffect、useMemo、useReducer、useRef、useState

* 执行了function类型的Fiber节点的实例化

```js
var children = Component(props, refOrContext)；
```

useState的调用

react-dom中有一个全局变量ReactCurrentDispatcher$1，在render阶段的最开始，会将ReactCurrentDispatcher$1赋值为一个全局变量ContextOnlyDispatcher。

```js
var ContextOnlyDispatcher = {
    readContext: readContext,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError
}
```

而这个时候useState之类的Hook如果调用会报错。

而在renderWithHooks函数中，在调用function类型的Fiber节点，将其实例化前，会有一段代码。

```js
if (nextCurrentHook !== null) {
    ReactCurrentDispatcher$1.current = HooksDispatcherOnUpdateInDEV;
} else if (hookTypesDev !== null) {
    ReactCurrentDispatcher$1.current = HooksDispatcherOnMountWithHookTypesInDEV;
} else {
    // 将ReactCurrentDispatcher$1.current指向为HooksDispatcherOnMountInDEV
    ReactCurrentDispatcher$1.current = HooksDispatcherOnMountInDEV;
}
```

以下是HooksDispatcherOnMountInDEV代码。这才是真正的Hook代码。

```js
HooksDispatcherOnMountInDEV = {
    readContext: function (context, observedBits) {
        return readContext(context, observedBits);
    },
    useCallback: function (callback, deps) {
        currentHookNameInDev = 'useCallback';
        mountHookTypesDev();
        return mountCallback(callback, deps);
    },
    useContext: function (context, observedBits) {
        currentHookNameInDev = 'useContext';
        mountHookTypesDev();
        return readContext(context, observedBits);
    },
    useEffect: function (create, deps) {
        currentHookNameInDev = 'useEffect';
        mountHookTypesDev();
        return mountEffect(create, deps);
    },
    useImperativeHandle: function (ref, create, deps) {
        currentHookNameInDev = 'useImperativeHandle';
        mountHookTypesDev();
        return mountImperativeHandle(ref, create, deps);
    },
    useLayoutEffect: function (create, deps) {
        currentHookNameInDev = 'useLayoutEffect';
        mountHookTypesDev();
        return mountLayoutEffect(create, deps);
    },
    useMemo: function (create, deps) {
        currentHookNameInDev = 'useMemo';
        mountHookTypesDev();
        var prevDispatcher = ReactCurrentDispatcher$1.current;
        ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
            return mountMemo(create, deps);
        } finally {
            ReactCurrentDispatcher$1.current = prevDispatcher;
        }
    },
    useReducer: function (reducer, initialArg, init) {
        currentHookNameInDev = 'useReducer';
        mountHookTypesDev();
        var prevDispatcher = ReactCurrentDispatcher$1.current;
        ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
            return mountReducer(reducer, initialArg, init);
        } finally {
            ReactCurrentDispatcher$1.current = prevDispatcher;
        }
    },
    useRef: function (initialValue) {
        currentHookNameInDev = 'useRef';
        mountHookTypesDev();
        return mountRef(initialValue);
    },
    useState: function (initialState) {
        currentHookNameInDev = 'useState';
        mountHookTypesDev();
        var prevDispatcher = ReactCurrentDispatcher$1.current;
        ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnMountInDEV;
        try {
            return mountState(initialState);
        } finally {
            ReactCurrentDispatcher$1.current = prevDispatcher;
        }
    },
    useDebugValue: function (value, formatterFn) {
        currentHookNameInDev = 'useDebugValue';
        mountHookTypesDev();
        return mountDebugValue(value, formatterFn);
    }
};
```

在demo代码中会调用react提供的useState函数。注意上面提到的HooksDispatcherOnMountInDEV变量中的useState是在react-dom中的代码，并非react的代码，但是在demo中我们调用的是react提供的useState。

react文件中提供的useState的代码是这样的：

```js
function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
}
```

最终resolveDispatcher函数返回的ReactCurrentDispatcher.current。ReactCurrentDispatcher和ReactCurrentDispatcher$1是相互引用的关系。所以最终是调用react-dom的useState。

真正执行useState工作的是mountState函数，而这个函数主要做了几件事。

```js
function mountState(initialState) {
    // mountWorkInProgressHook这个函数是构建出这个hook对应的存储数据以及队列等信息
    var hook = mountWorkInProgressHook();
    // 如果传入useState的参数是一个函数，那么先执行函数
    if (typeof initialState === 'function') {
        initialState = initialState();
    }
    // 为hook赋值memoizedState和baseState为传入的值
    hook.memoizedState = hook.baseState = initialState;
    // 创建hook的队列对象
    var queue = hook.queue = {
        last: null,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
    };
    // 闭包注册一个可以修改当前state值的函数。
    // 传入当前的Fiber节点，以及队列信息
    var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
    // 将值和函数返回
    return [hook.memoizedState, dispatch];
}
```

mountWorkInProgressHook函数内容

```js
function mountWorkInProgressHook() {
    var hook = {
        memoizedState: null,
        baseState: null,
        queue: null,
        baseUpdate: null,
        next: null
    };
    // 做好每个Hook的顺序
    if (workInProgressHook === null) {
        firstWorkInProgressHook = workInProgressHook = hook;
    } else {
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}
```

* 函数组件会有特殊的处理方式
* 在render阶段，在将函数Fiber内容实例化的时候回去处理全局中的Hooks对象的指向
* 最终useState是调用内部函数mountState去设置state的
* 在mountState中会对传入的参数进行判断，如果是函数则会先执行，得出返回值再继续运行
* 在mountState中会创建一个闭包事件，将当前的Hook所在的Fiber节点以及Hook队列对象作为参数绑定在函数中，并返回

## Hook - 更新state

在demo中我们为button元素绑定了一个onClick事件，经过React的合成事件最终触发了之前说到的dispatchAction函数。在useState的时候返回的setCount函数中，会提前绑定好了当前的Fiber节点，以及一个queue的参数。

最终会将新传入的state的值保存在queue中的last对象上。

而当前的Fiber节点中的memoizedState对象中的queue是对queue的一个引用。所以现在Fiber节点中已经已经带有新的state的记录，之后会将Fiber节点传入到scheduleWork函数中。

这里基本上是和正常的class组件一样的，只是处理的方式不一样而已，正常的class组件在时间阶段都是根据新的state都是根据新的state来修改Fiber中备用树的state里面的值，而Hook就是利用闭包返回的函数，修改自己Fiber节点中memoizedState.queue中的值，在下一次渲染中进行更新。

在执行renderWithHooks函数中时，发现当前的函数组件并非第一次渲染，所以将会使用HooksDispatcherOnUpdateInDEV这个全局对象执行setState，而并非像第一次那样使用HooksDispatcherOnMountInDEV全局对象进行渲染。

useState最终调用的是updateReducer，而并非mountState函数。

从代码可以发现当我们在事件中多次触发setCount函数，其实也只会触发一次render，因为在之前的queue对象中，会保持一个关系，如果队列中存在last对象，那么会将新的state存到last对象的next对象中，以此类推。所以就形成了一个多次state的调用链。

然后触发updateReducer的时候有这么一段代码：

```js
do {
    var updateExpirationTime = _update.expirationTime;
    if (updateExpirationTime < renderExpirationTime) {
        if (!didSkip) {
            didSkip = true;
            newBaseUpdate = prevUpdate;
            newBaseState = _newState;
        }
        if (updateExpirationTime > remainingExpirationTime) {
            remainingExpirationTime = updateExpirationTime;
        }
    } else {
        if (_update.eagerReducer === reducer) {
            _newState = _update.eagerState;
        } else {
            var _action2 = _update.action;
            _newState = reducer(_newState, _action2);
        }
    }
    prevUpdate = _update;
    _update = _update.next;
} while (_update !== null && _update !== first);
```

就是会使用最后一次set的值。这个和class的setState原理是一样的。

最后会将新的值赋值到Fiber节点中，并返回新的值，值得注意的是，事件将会复用之前的闭包生成的事件。

之后就是正常的渲染流程了，和class组件并没有什么区别了。

## useEffect原理

在官网中说到useEffect是componentDidMount，componentDidUpdate和componentWillUnmount这三个函数的组合。

在一次渲染的时候会执行useEffect函数，而这个函数最终生成一个effect对象，effect中的create就是保持useEffect传入的回调函数。最终会暂时保存在componentUpdateQueue全局对象中，然后对函数组件实例化成ReactElement之后，将会把componentUpdateQueue赋值到函数组件的updateQueue对象中。

```js
{
    create: f(),
    deps: null,
    destroy: undefined,
    next: null,
    tag: 192
}
// 一个函数组件中有多个useEffect函数
{
    create: f(),
    deps: null,
    destroy: undefined,
    next: {
        create: f(),
        deps: null,
        destroy: undefined,
        next: {...},
        tag: 192
    },
    tag: 192
}
```

最后effect对象将会保存在Fiber节点的updateQueue对象中。

在进入commit阶段，将Fiber节点都渲染到页面上后，就会开始执行Fiber节点中的updateQueue中所保存的函数了。

接着在每一次渲染完组件后，如果是class组件将会调用class组件本来的生命周期函数，但是如果是函数组件，那么将会找到updateQueue中的注册函数逐个调用。

最终会调用commitHookEffectList函数，去触发注册的生命周期函数。执行的方式就是执行完每一个注册事件后，会查找是否存在next，如果存在就继续低啊用，直到所有注册函数都执行完毕。

### useEffect中如何在组件卸载时执行对应的动作

```js
class FriendStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isOnline: null};
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }
    componentDidMount() {
        ChatAPI.subscribeToFriendStatus(
            this.props.friend.id,
            this.handleStatusChange
        );
    }
    componetWillUnmount() {
        ChatAPI.unsubscribeFromFriendStatus(
            this.props.friend,id,
            this.handlesStatusChange
        );
    }
    handleStatusChange(status) {
        this.setState({
            isOnline: status.isOnline
        });
    }
    render() {
        if (this.state.isOnline === null) {
            return 'Loading...';
        }
        return this.state.isOnline ? 'Online' : 'Offline';
    }
}
```

这个组件需要在卸载的时候移除某一些事件绑定，那么官网中的说明是在执行useEffect传入的函数中return一个函数，return的函数在组件卸载的时候执行，返回的函数会保存在effect中的destroy中，在组件卸载的时候会调用commitHookEffectList函数，其中会判断destory是否存在，存在则调用相应的函数。

### useEffect性能优化

在官网中有一个例子，在class组件中，我们常用一个操作，就是在生命周期中需要做一些判断，当满足条件才会执行一些操作。

```js
componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
        document.title = `You clicked ${this.state.count} times`;
    }
}
```

但是在我们使用useEffect的时候每一次渲染都会触发，如果我们的函数组件中，存在某些操作需要满足特定条件才会在useEffect触发，那么如何去做呢？

官网告诉了我们，useEffect可以接受第二个参数，第二个参数其实就是代表当传入的参数和当前的同名参数不相等时，执行useEffect。

```js
useEffect(() => {
    document.title = `You clicked ${count} times`;
}, [count]);
// 仅在count更改时更新
```

首先在实例我们的函数组件的时候，传入的第二个参数会保存在deps中。

在非第一次的渲染中，执行useEffect，最终是执行updateEffectImpl函数，而这个函数中就会对传入的第二个参数中（数组）的每一项的值和当前存在的每一项值进行对比，如果不相等，则返回false，那么会赋值给全局中的sideEffectTag，在之后的renderWithHooks函数中，会将sideEffectTag赋值到函数组件中的effectTag中。

最后因为对Fiber节点复制了effectTag，所以在渲染后会触发commitHookEffect函数。

首次渲染函数组件的useState和useEffect的调用流程图

![img](https://pic3.zhimg.com/v2-5fbdbecfa6092c98ad595c7f05181552_r.jpg)

更新渲染函数组件的useState和useEffect的调用流程图

![img](https://pic4.zhimg.com/80/v2-e11aad0b1f75080d844bb93ada6b89bf_hd.jpg)

总结：

1. useEffect的执行实际都是每次渲染后触发，无论是首次渲染还是更新渲染
2. useEffect只会在当前组件是函数组件才会执行，不能在非函数组件中使用
3. useEffect可以在同一函数组件中使用多次，按调用顺序执行，这样我们可以将生命周期中需要做的事情更小力度的去编写代码
4. useEffect传入的函数中，return一个函数，用作函数组件卸载时需要执行的操作
5. 控制useEffect什么时候执行可以传入第二个参数，而且第二个参数必须是数组。react会对这次传入的数组中的每一项和上一次数组中的每一项进行对比，当发现不一样时会对应记录，在渲染后就会触发对应符合触发的useEffect函数
6. useEffect的触发时采用异步方式执行的。因为有可能存在多个useEffect的函数，如果像class组件那样在commit阶段最后触发的话，很容易导致阻塞线程。所以React利用setTimeout的方法，将useEffect异步执行。
