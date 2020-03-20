# React

## 受控组件和非受控组件的区别

由React控制的输入表单元素元素而改变其值的方式，称为受控组件。

```js
// 受控
<input type="text" value={this.state.value} onChange={this.change} />
// 不受控
<input type="text" ref={input => this.input = input}/>
```

## 新旧生命周期

componentWillMount/componentDidMount/componentWillReceiveProps/shouldComponentUpdate/componentWillUpdate/componentDidUpdate/componentWillUnmount

* 旧：will，did，mount，update
* 新：16版本之后
    * getDerivedStateFromProps：虚拟dom之后，实际dom挂载之前，每次获取新的props或state之后，返回新的state，配合didUpdate可以期待willReceiveProps
    * getSnapshotBeforeUpdate：update发生的时候，组件更新前触发，在render之后，在组件dom渲染之前；返回一个值，作为componentDidUpdate的第三个参数，配合componentDidUpdate可以覆盖componentWillUpdate的所有用法
    * componentDidCatch：错误处理
* 对比：弃用了三个will，新增了两个get来代替will，不能混用，17版本会彻底删除，新增错误处理

## react核心

* 虚拟dom，diff算法，遍历key值
* react-dom：提供了针对DOM的方法，比如：把创建的虚拟DOM，渲染到页面上 或 配合ref来操作DOM
* react-router

## fiber核心（react16）

* 旧：浏览器渲染引擎单线程，计算DOM树时会锁住整个县城，所有行为同步发生，有效率问题，期间react会一直占用浏览器主线程，如果组件层级比较深，相应的对战也会很深，长时间占用浏览器主线程，任何其他的操作都无法执行。
* 新：重写底层算法逻辑，引入fiber事件片，异步渲染，react会在渲染一部分树后检查是否有更高优先级的任务需要处理（如用户操作或绘图），处理完后再继续渲染，并可以更新优先级，以此管理渲染任务，加入fiber的react将组件更新分为两个时期（phase1和phase2），render前的生命周期为phase1，render后的生命周期为phase2，1可以打断，2不能打断一次性能更新。三个will生命周期可能会重复执行，尽量避免使用。

## 渲染一个react

* 分为首次渲染和更新渲染
* 生命周期，建立虚拟DOM，进行diff算法
* 对比新旧DOM，节点对比，将算法复杂度从O(n^3)降低到O(n)
* key值优化，避免用index作为key值，兄弟节点中唯一就行

## 高阶组件HOC

高阶组件就是一个函数，该函数（wrapper）接受一个组件作为参数，并返回一个新的组件。
高阶组件并不关心数据使用的方式和原因，而被包裹的组件也不关心数据来自何处。

```js
export default function withHeader(WrappedComponent) {
    return class HOC extends component {
        return (
            <div>
                <WrappedComponent {...this.props} />
            </div>
        )
    }
}
```

## hook

在无状态组件（函数式组件）中也能操作state以及其他react特性。

## redux、vuex、dva

* redux：通过store存储，通过action唯一更改，reducer描述如何更改，dispatch一个action
* dva：基于redux，结合redux-saga等中间件进行封装
* vuex：类似dva，集成化，action异步，mutation非异步

## react和vue的区别

* 数据不可变-数据可变
* js操作一切-各自处理
* 类式的写法-声明式的写法
* HOC扩展-mixins扩展

## 单向数据流怎么理解

数据主要从父节点传递到子节点（通过props），如果顶层（父级）的某个props改变了，react会重新渲染所有的子节点。

## react算法复杂度优化

react树对比是按照层级去对比的，他会给树编号0，1，2，3，4.。。然后相同的编号进行比较，所以复杂度是n。

传统diff的算法，除了上面的比较之外，还需要跨级比较。它会将两个树的节点，两两比较，这就有n^2的复杂度了，然后还需要编辑树，编辑树可能发生在任何节点，需要对树进行再一次遍历操作，因此复杂度为n，加起来就是n^3复杂度了。

## redux工作流，原理

view => dispatch(action) => store => reducer => store(state)

1. view在redux中会派发action方法
2. action通过store的dispatch方法会派发给store
3. store接受action，连同之前的action，一起传递给reducer
4. reducer返回新的数据给store
5. store改变自己的state

* createStore(reducer, [initialState], enhancer)
* combineReducers(...reducers)
* ...middlewares
    接受dispatch,getState作为命名参数，并返回一个函数。
    该函数会被传入被称为next的下一个middleware的dispatch方法，并返回一个接受action的新函数，这个函数可以直接调用next(action)，或者在其他需要的时刻调用，也可不调用。
    调用链的字后一个middleware会接受真实的store的dispatch方法作为next参数，并结束调用链。所以middleware的函数为({getState, dispatch}) => next => action
    返回值是一个应用了middleware后的store enhancer。这个store enhancer就是一个函数，并且需要应用到createStore。它会返回一个应用了middleware的新createStore。
* bindActionCreators
    把actionCreators转赠拥有同名keys的对象，让dispatch把每个actionCreator包装起来，这样就可以直接调用它们。唯一使用bindActionCreators的场景是需要把actionCreator往下传到一个组件上，却不想让这个组件察觉到redux的存在i，而且不希望吧redux store或者dispatch传给它。
    bindActionCreators(actionCreators, dispatch)
    返回值：一个与源对象类似的对象，只不过这个对象中的每个函数值都直接dispatch action。如果传入的是个函数，返回的也是函数。
* compose(...functions)
    当需要多个store增强器依次执行的时候使用它，compose在已用常见的两个用法。
    let buildStore = compose(applymiddleware(thunk))(createStore)   合成多个函数，每个函数接受一个函数作为参数，然后返回一个函数。
    let initStore = compose(applymiddleware(thunk)) 从右往左把接收到的函数合成终极函数

## react-redux

* Provider

根组件应该嵌套在Provider中才能使用connect方法

store：工程中唯一的redux store
children：组件层级的根组件

* connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

链接组件与redux store

mapStateTpProps(state, [ownProps]): stateProps
定义了这个参数，组件会监听redux store的变化，在任何情况下，只要redux store发生变化，mapStateToProps函数就会被调用。负责返回需要传递给子组件的state。

mapDispatchToProps(dispatch, [ownProps]): dispatchProps
负责返回一个dispatchProps，是actionCreator的key和dispatch(action)的组合。

mergeProps(stateProps, dispatchProps, ownProps): props(Function)
如果指定了这个参数，两个map的执行结果和组件自身的props将传入到这个回调函数中。该回调函数返回的对象健作为props传递到被包装的组件中。默认返回Object.assign({}, ownProps, stateProps, dispatchProps)的结果。

options(Object)如果指定这个参数，可以定制connector的行为。
    pure=true，如果为true，connector将执行shouldComponentUpdate并且浅比较mergeProps的结果，避免不必要的更新，前提是当前组件是一个纯组件，他不依赖于任何输入或state而值依赖于props和store。
    withRef=false，如果为true，connector会保存一个被包装组件实例的引用，该引用通过getWrappedInstance()方法获得。

## redux中间件

redux的中间件指的是action和store之间。
action通过dispatch方法传递给store，那么action和store之间是谁呢？就是dispatch方法的封装，这里就分为两种情况了。
如果接受的是一个函数，那么它不会直接传递给store，而是把这个函数执行，然后进行传递。
如果是一个对象，那就直接传递给store了。
redux-thunk就是对dispatch的升级，中间件不止redux-thunk这一个，还有其他的中间件，对dispatch进行升级，达成不同的需求。

## createStore源码

```js
export default function createStore(reducer, preloadedState, enhancer) {
    // 判断接受的参数个数，来指定reducer、preloadedState和enhancer
    // 如果preloadedState是函数会认为传入的是个enhancer
    // 如果enhancer存在并且是个合法地函数，那么调用enhancer，并且终止当前函数执行
    return enhancer(createStore)(reducer, preloadedState)

    // 储存当前的currentReducer
    var currentReducer = reducer;
    // 储存当前的状态
    var currentState = preloadedState;
    // 储存当前的监听函数列表
    var currentListeners = [];
    // 储存下一个监听函数列表
    var nextListeners = currentListeners;
    var isDispatching = false;
    // 根据当前监听函数的列表生成新的下一个监听函数列表引用
    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }
    // getState
    // subscribe
    // dispacth
    // replaceReducer
    // observable
    dispatch({ type: ActionTypes.INIT })
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
}
```

1. action

action代表的是用户的操作，redux规定action一定要包含一个type属性，且type属性也要唯一，相同的type，redux视为同一种操作，因为action的函数reducer只判断action中的type属性。

2. reducer

Redux中负责响应action并修改数据的角色就是reducer，reducer的本质实际上是一个函数，器函数签名为reducer(previousState, action) => newState。可以看出，reducer接受两个参数，previousState以及action函数返回的action对象，并返回最新的state，事件reducer在处理previousState还需要一个特殊的非空判断。

reducer只是一个模式匹配的东西，真正处理数据的函数，一般是额外在别的地方写的，在reducer中调用。action对象各种各样，每种对应某个case，但是最后都汇总到state对象中，从多到一，这是一个减少reduce的过程，所以完成这个过程的函数叫reducer。

3. getState

```js
var currentReducer = reducer;
var currentState = initialState;
var listeners = [];
var isDispatching = false;
function getState() {
    return currentState;
}
```

* currentReducer：当前的reducer，支持用过store.replaceReducer方式动态替换reducer，为代码热替换提供了可能。
* currentState：应用当前的状态，默认为初始化状态
* listeners：当前监听store的监听器
* isDispatching：某个action是否处于分发处理过程中。

4. subscribe

```js
function subscribe(listener) {
    let isSubscribed = true;
    ensureCanMutateNextListeners()
    nextListener.push(listener)
    return function unsubscribe() {
        if (!isSubscribed) {
            return
        }
        isSubscribed = false;
        ensureCanMutateNextListeners()
        const index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
    }
}
```

subscribe接受一个listener，它的作用是给store添加监听函数。nextListeners储存了整个监听函数列表。subscribe的返回值是一个unscubscribe，是一个解绑函数，调用该解绑函数，会将已经添加的监听函数删除，该监听函数处于一个闭包之中，会一直存在，所以在解绑函数中能删除该监听函数，（多出地方巧用闭包，精简了许多代码。）

好像我们在redux中并没有使用过subscribe方法，实际上connect方法隐式的帮我们完成了这个工作。

5. dispatch

```js
function dispatch(action) {
    // ... 一些判断逻辑
    try {
        isDispatching = true;
        currentState = currentReducer(currentState, action)
    } finally {
        isDispatching = false;
    }
    const listeners = currentListeners = nextListeners;
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener()
    }
    return action;
}
```

首先校验action是否为一个原生js对象，接下来为我们校验了action对象是否包含了必要的type字段。在接下来，判断当前是否处于某个action分发过程中，这个检查主要是为了避免在reducer中分发action。

在一系列的检查完毕后，若均没有问题，将当前的状态和action传给当前reducer，用于生成新的state。在得到新的状态后，依次调用所有的监听器，通知状态变更。需要注意的是，我们在通知监听器变更发生时，并没有将最新的状态传给监听器。这是因为在监听器中我们可以直接调用store.getState()方法拿到最新的状态，最后，将处理之后的action返回。

6. replaceReducer

```js
function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({type: ActionTypes.INIT})
}
```

replaceReducer是替换当前的reducer的函数，replaceReducer接受一个新的reducer，替换完成之后，会执行dispatch({type: ActionTypes.INIT})，用来初始化store状态。官方举出了三种replaceReducer的使用场景：

1. 当你的程序要进行代码分割的时候
2. 当你要动态的加载不同的reducer的时候
3. 当你要实现一个实时reloading机制的时候

## diff算法

diff算法的作用：计算出virtual dom中真正变化的部分，并只针对该部分进行原生DOM操作，而非重新渲染整个页面。

传统diff算法：循环递归对节点进行依次对比，算法复杂度On^3（n^2遍历，n编辑），n是树的节点数。

三个策略将On^3转化为On：（TCE）
* tree diff
    DOM节点的跨层级移动操作忽略不计
* component diff
    拥有相同类的两个组件生成相似的树形结构，不同类的两个组件生成不同的树形结构
* element diff
    对同一层级的一组子节点，通过唯一id区分

### tree diff

1. 通过updateDepth堆virtual dom树进行层级控制
2. 对树分层比较，两棵树只对统一层节点进行比较。如果该节点不存在时，则该节点及其子节点会被完全删除，不会再进一步比较。
3. 只需遍历一次，就能完成整棵树的比较

### component diff

1. 同一类型的两个组件，按原策略（层级比较）继续比较virtual dom树即可
2. 同一类型的两个组件，A变化为B时，可能virtual dom没有任何变化（变换的过程中，virtual dom没有改变），可节省大量计算事件，所以用户可以通过shouldComponentUpdate来判断是否需要判断计算。
3. 不同类型的组件，将一个（将被改变的）组件判断为dirty component（脏组件），从而替换整个组件的所有节点。

### element diff

当节点处于同一层级时，diff提供三种节点操作：删除、插入（创建）、移动。

ABCD => BADC
index是旧的索引。lastIndex是浮标，指向操作节点的位置，初始是0，更新后为index和lastIndex的最大值。
B：lastIndex=0，index=1，lastIndex < index，B不移动
A：lastIndex=1，index=0，lastIndex > index，A移动
D：lastIndex=1，index=3，lastIndex < index，D不移动
D：lastIndex=3，index=2，lastIndex > index，C移动

不足的情况：ABCD=>DABC，这种情况会判断D不移动，其他三个都移动，所以要避免将一个节点移动到列表首部的操作。

## context

* React.createContext方法，用与创建一个Context对象，该对象包含Provider和Consumer两个属性，分别为两个React组件。
* Provider组件，用与组件树中更外层的位置，他接受一个名为value的prop
* Consumer组件，可以在Provider组件内部的任何一层使用，它接受一个名为children的函数类型的prop，这个函数的参数provider的value，返回值是一个react元素。

```js
const NameContext = React.createContext('jack');
class Hello extends React.PureComponent {
    render() {
        return (
            <NameContext.Consumer>
                {name => <h1>hello {name}</h1>}
            </NameContext.Consumer>
        )
    }
}
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'xxx'
        }
    }
    render() {
        return (
            <div>
                <NameContext.Provider value={this.state.name}>
                    {this.props.children}
                </NameContext.Provider>
            </div>
        )
    }
}
```

* Provider和Consumer必须来自同一次React.createContext调用。
* React.createContext方法接受一个默认值作为参数。当Consumer外层没有对应的Provider时就会使用该默认值。
* Provider组件的value prop值发生变更时，其内部组件树中对应的Consumer组件会接受到心智并重新执行children函数。此过程不受shouldComponentUpdate方法的影响。
* Provider组件利用Object.is检测value prop的值是否有更新
* Consumer组件接收一个函数作为children prop并利用该函数的返回值生成组件树的模式称为render props模式。

## react-router

url对应location对象。

通过Link的redirect进行路由的切换。

3=>4的变化

V4不在使用{props.children}，Layout和Page嵌套
V4支持同时渲染多个路由
获取路由的路径配置，可以使用props.match.path获取，match上还有params，url等属性
没有IndexRoute
多了一个限制未登录的用户访问某些路径功能，可以在应用程序顶端中设置一个主入口，区别登录和未登录UI展示

Switch中只有一个Route会被渲染，Redirect用来兜底

## Fiber架构，调度原理

## 事件委托

## setState异步

调用setState之后，React会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。经过调和过程，React会以相对高效的方式根据新的状态构建React元素树并且着手重新渲染整个UI界面。在React得到元素树之后，React会自动计算出洗呢树与老树的节点差异，然后根据差异对界面进行最小化冲渲染。在差异计算算法中，React能够相对精确的知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

保证内部一致性（等待父组件渲染后）、性能优化、支持state幕后渲染

## PureComponet

避免父组件的state或者props更新引起的子组件render

## react intl

国际化

## react-thunk vs react-saga

用于异步调用api

export function xxx(email) {
    return (dispatch) => {
        return xxx.call(email).then((data) => {
            dispatch(Action)
        })
    }
}

redux-thunk
* 一个异步请求的action代码过于复杂，且异步操作太分散
* action形式不统一，如果不一样的异步操作就要写多个

redux-saga
* 集中处理所有的异步操作
* action是普通对象，这跟redux同步的action一样
* 通过Effect方面异步接口的测试
* 通过worker和watcher可以实现非阻塞异步调用，并且同时实现非阻塞调用下的事件监听
* 异步操作的流程是可以控制的，可以随时取消相应的异步操作

## 动态导入组件

React.lazy+React.Suspense

```js
const B = React.lazy(() => import('./B'));
export default class A extends React.PureComponent {
    render() {
        return (
            <div>
                <React.Suspense fallback={'loading'}>
                    <B />
                </React.Suspense>
            </div>
        )
    }
}
```

@loadable/component

```js
import loadable from '@loadable/component'
const B = loadable(() => import('./B'));
function A () {
    return (
        <div>
            <B/>
        </div>
    )
}
```

loadable支持SSR、代码分割。

## history的API

pushState(data, title, targetUrl)
replaceState(data, title, targetUrl)    // 会直接替换当前url，但是不会再history中留下记录
二者都不触发popstate事件

popstate事件
点击回退、前进、调用back、foward、go方法触发


