// 详细原文见https://zhuanlan.zhihu.com/p/53599723

// 目标 => 管理状态state、共享状态
// 解决思路 => 把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测。

Store模式
// 最简单的处理就是把状态存到一个外部变量里面，当然也可以是一个全局变量。但是这样造成一个问题：数据改变后，不会留下变更过的记录，这样不利于调试。
// 一个简单的stroe模式
var store = {
    state: {
      message: 'Hello!'
    },
    setMessageAction (newValue) {
      // 发生改变记录点日志啥的
      this.state.message = newValue
    },
    clearMessageAction () {
      this.state.message = ''
    }
}
// store的state来存数据，store里面有一堆action，通过这些action来控制state的改变。
// 这个例子没有限制组件里面不能修改store里面的state。
// 所以规定一下，组件不允许直接修改属于store实例的state，组件必须通过action来改变state。
// 这样约定的好处是，我们能够记录所有store中发生的state改变，同时实现能做到记录变更、保存状态快照、历史回滚/时光旅行的先进的调试工具。


Flux
// Flux其实是一种思想，他给出了一些基本概念，所有的框架都可以根据他的思想来做一些实现。
// Flux把一个应用分成了四个部分：View Action Dispatcher Store

// View用来展示数据（Store）
// 一旦Store发生改变，都会往外面发送一个事件，通知所有的订阅者（或者观察者）。
// Dispatcher的作用是接受所有的Action，然后发给所有的Store。
// Store的改变只能通过Action，所以Store不应该有公开的Setter，所有Setter都应该是私有的，只能有公开的Getter。
// Flux的最大特点就是数据都是单向流动的。action => dispatcher => store => view => action


Redux
// Flux有一些特点，一个应用可以拥有多个Store，多个Store之间可能有依赖关系；Store封装了数据还有处理数据的逻辑。
// 一般使用时，会使用Redux，与Flux思想类似，也有所差别。
// Store
// Redux里面只有一个Store，Store的State不能直接修改，每次只能返回一个新的State。Redux用createStore函数来生成Store。
import {createStore} from 'redux';
const store = createStore(fn);
// Store允许使用store.subscribe方法设置监听函数，一旦State发生变化，就自动执行这个函数。
// Action
// Action是View发出的通知，告诉Store State要改变，Action必须有一个type属性，代表Action的名称，其他可以设置一堆属性，作为参数供State变更时参考。
// Reducer
// Redux没有Dispatcher的概念，Store里面已经继承了dispatch方法。store.dispatch()是View发出Action的唯一方法。
store.dispatch({
  type: "ADD_TODO",
  payload: "Learn Redux"
})
// Redux用一个叫做Reducer的纯函数来处理事件。Store收到Action以后，必须给出一个新的State。
// 纯函数是指没有任何副作用的函数【具体略，已掌握】
// (previousState, action) => newState
// 类比Flux: (state, action) => state
// reduce是一个函数式编程的概念，经常和map放在一起说，简单来说，map就是映射，reduce就是归纳。
// 映射就是把一个列表按照一定规则映射成另一个列表，而reduce是把一个列表通过一定规则进行合并，也可以理解为对初始值进行一系列的操作，返回一个新的值。
// 声明reducer:
const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD':
      return state + action.payload;
    default:
      return state;
  }
}
// createStore接受reducer作为参数，生成一个新的store。以后每当store.dispatch发送过来一个新的Action，就会自动调用Reducer，得到新的State。
import {createStore} from 'redux';
const store = createSotre(reducer);
// createStore内部简单实现：
const createStore = (reducer) => {
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners =listeners.filter(l => l !== listener);
    }
  };
  dispatch({});
  return {getState, dispatch, subscribe};
}
// Redux里每一个Reducer负责维护State树里面的一部分数据，多个Reducer可以通过combineReducers方法合成一个根Reducer，这个根Reducer负责维护整个State。
import {combineReducers} from 'redux';
const chatReducer = combineReducers({   // 这种简写形式，State的属性名必须与子Reducer同名
  Reducer1, Reducer2, Reducer3
})
// combineReducers的简单实现
const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reducer(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {}
    );
  };
};
// Redux流程
// 1.用户通过View发出Action
store.dispatch(action);
// 2.然后Store自动调用Reducer，并且传入两个参数，当前State和收到的Action。Reducer会返回新的State。
let nextState = xxxReducer(previousState, action);
// 3.State一旦有变化，Store就会调用监听函数
store.subscribe(listener);
// 4.listener可以通过store.getState()得到当前状态。如果使用的是React，这是可以触发重新渲染View。
function listener() {
  let newState = store.getState();
  component.setState(newState);
}

// 对比Flux
// Flux中Store是各自为战的，每个Store只对对应的View负责，每次更新都只通知对应的View
// Redux中各子Reducer都是由根Reducer统一管理的，每个子Reducer的变化都要经过根Reducer的整合
// 简单来说，Redux有三大原则：单一数据源(Flux数据源可以是多个)，State只读(Flux的State可以随便改)，Reducer纯函数执行修改(Flux执行修改的不一定是纯函数)。
// Redux和Flux一样都是单向数据流

// 中间件
// 实际项目中，一般都会有同步和异步操作，所以Flux、Redux之类的思想，最终都要落地到同步异步的处理中来。
// Redux中，同步的表现就是：Action发出以后，Reducer立即算出State。那么异步的表现就是：Action发出以后，过一段时间再执行Reducer。
// Redux引入了中间件Middleware的概念
// 在View里发送Action的时候，加上一些异步操作。比如下面的代码，给原来的dispatch方法包裹了一层，加上了一些日志打印的功能：
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
// 详细了解Redux中间件  https://cn.redux.js.org/docs/advanced/Middleware.html
// Redux提供了一个applyMiddleware方法来应用中间件：
// 这个方法主要就是把所有的中间件组成一个数组，依次执行，也就是说，任何被发送到store的action现在都会经过thunk，promise，logger这几个中间件了
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
)
// 处理异步
// 对于异步操作来说，有两个非常关键的时刻：发起请求的时刻，和接受到响应的时刻（可能成功，也可能失败或者超时），这两个时刻都可能会更改应用的state。
// 一般过程如下：
// 1.请求开始时，dispatch一个请求action，触发state更新为“正在请求”状态，View重新渲染，比如展现个Loading之类。
// 2.请求结束后，如果成功，dispatch一个请求成功Action，隐藏掉Loading，把新的数据更新到State；如果失败，dispatch一个请求失败Action，隐藏掉Loading，给个失败提示。
// 大多数选择一些现成的支持异步处理的中间件。比如redux-thunk或者redux-promise

// Redux-thunk
const createFetchDataAction = function(id) {
  return function(dispatch, getState) {
    // 开始请求，dispatch一个FETCH_DATA_START action
    dispatch({
      type: FETCH_DATA_START,
      payload: id
    })
    api.fetchData(id).then(reponse => {
      // 请求成功，dispatch一个FETCH_DATA_SUCCESS action
      dispatch({
        type: FETCH_DATA_SUCCESS,
        payload: respones
      })
    }).catch(error => {
      // 请求失败，dispatch一个FETCH_DATA_FAILED action
      dispatch({
        type: FETCH_DATA_FAILED,
        payload: error
      })
    })
  }
}
// reudcer
const reducer = function(oldState, action) {
  switch(action.type) {
    case FETCH_DATA_START:
    // 处理loading等
    case FETCH_DATA_SUCCESS:
    // 更新store等
    case FETCH_DATA_FAILED:
    // 提示异常
  }
}
// Redux-promise
const FETCH_DATA = "FETCH_DATA";
// action creator
const getData = function(id) {
  return {
    type: FETCH_DATA,
    payload: api.fetchData(id)  // 直接将promise作为payload
  }
}
// reducer
const reducer = function(oldState, action) {
  switch(action.type) {
    case FETCH_DATA:
      if (action.status === 'success') {
        // 更新store等处理
      } else {
        // 提示异常
      }
  }
}
// 封装少，自由度高，但是代码就会变复杂；封装多，代码变简单了，但是自由度就会变差。


Vuex
// 主要用于Vue，和Flux，Redux的思想很类似
Store
// 每一个Vuex里面有一个全局的Store，包含着应用中的状态State，这个State只是需要在组件中共享的数据，不用放所有的State。
// 和Redux类似，一个应用仅会包含一个Store实例。单一状态树能够直接定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
// Vuex通过store选项，把state注入到了整个应用中，这样子组件能够通过this.\$store访问到state
const app = new Vue({
  el: '#app',
  // 把store对象提供给“store”选项，这可以把store的实例注入所有的子组件
  store,
  components: {Counter},
  template: `<div class="app"><counter></counter></div>`
})
const Counter = {
  template: `<div>{{count}}</div>`,
  computed: {
    count() {
      return this.$store.state.count
    }
  }
}
// State改变，View就会跟着改变，这个改变利用的是Vue的响应式机制
Mutation
// 显而易见，State不能直接改，需要通过一个约定的方式，这个方式在Vuex里面叫做mutation，更改Vuex的store中的状态的唯一方法是提交mutation。
// Vuex中的mutation非常类似于事件：每个mutation都有一个字符串的事件类型（type）和一个回调函数（handler）








