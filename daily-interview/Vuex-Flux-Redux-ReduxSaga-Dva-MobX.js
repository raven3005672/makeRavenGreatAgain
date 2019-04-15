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
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment(state) {
      // 更改状态
      state.count++
    }
  }
})
// 触发mutation事件的方式不是直接调用，比如increment(state)是不行的，而要通过store.commit方法：
store.commit('increment')
// 注意：mutation都是同步事务
// mutation有些类似Redux的Reducer，但是Vuex不要求每次都搞一个新的State，可以直接修改State，这里又和Flux有些类似。

// 到这里，可以感受到Flux、Redux、Vuex三个的思想都差不多，再具体细节上有一些差异，总的来说都是让View通过某种凡是触发Store的事件或方法，
// Store的事件或方法对State进行修改或返回一个新的State，State改变之后，View发生响应式改变。
Action
// mutations是必须同步的，对比Redux的中间件，Vuex加入了Action来处理异步，Vuex的想法是把同步和异步拆分开。
// View通过store.dispatch('increment')来触发某个Action，Action里面不管执行多少异步操作，完事之后都通过store.commit('increment')来触发mutmapActions，
// 一个Action里面可以触发多个mutation。所以Vuex的Action类似于一个灵活好用的中间件。


对比Redux
// Reudx: view => actions => reducer => state变化 => view变化(同步异步一样) 
// Vuex: view => commit => mutations => state变化 => view变化(同步操作)
      // view => dispatch => actions => mutations => state变化 => view变化(异步操作)


React-redux
// Redux和Flux类似，只是一种思想或者规范。
// React包含函数式的思想，也是单向数据流，和Redux很搭，所以一般都用Redux来进行状态管理。
// 为了简单处理Redux和ReactUI的绑定，一般通过一个叫react-redux的库和React配合使用。
// Redux将React组件分为容器型组件和展示型组件，容器型组件一般通过connect函数生成，它订阅了全局状态的变化，通过mapStateToProps函数，可以对全局状态进行过滤，而展示型组件不直接从global state获取数据，起数据来源于父组件。
// demo index.js
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './reducers';
import App from './components/App';
const store = createStore(rootReducer);
render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)
// actions/index.js
let nextTodoId = 0;
export const addRodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})
export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
// reducers/todos.js
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo => todo.id === action.id ? {...todo, completed: !todo.completed} : todo)
    default:
      return state
  }
}
export default todos;
// reducers/index.js
import {combineReducers} from 'redux';
import todos from './todos';
import VisibilityFilter from './visibilityFilter';
export default combineReducers({
  todos,
  VisibilityFilter,
  /// ...
})
// containers/VisibleTodoList.js
import {connect} from 'react-redux';
import {toggleTodo} from '../actions';
import TodoList from '../components/TodoList';
const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    case 'SHOW_ALL':
    default:
      return todos
  }
}
// mapStateToProps函数指定如何把当前Redux store state映射到战时组建的props中
const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state.VisibilityFilter)
})
// mapDispatchToProps方法接受dispatch()方法并返回期望注入到展示组件的props中的回调方法
const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
// 简单来说，react-redux就是多了个connect方法连接容器组件和UI组件，这里的连接就是一种映射：mapStateToProps把容器组件的state映射到UI组件的props、mapDispatchToProps把UI组件的事件映射到dispatch方法


Redux-saga
// saga的意思是一连串的事件。
// redux-saga没有把异步操作放在action creator中，也没有去处理reducer，而是吧所有的异步操作看成“线程”，可以通过普通的action去触发，当操作完成时也会触发action作为输出。
// redux-saga把异步获取数据这类操作都叫做副作用（Side Effect），他的目标就是把这些副作用管理好，让他们执行更高效，测试更简单，在处理故障时更容易。
// Generator函数的很多代码可以被延迟执行，也就是具备了暂停和记忆的功能：约到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值，等着下一次调用next方法时，再继续往下执行。
function* gen() {
  var url = 'https://api.github.com/users/github';
  var jsonData = yield fetch(url);
  console.log(jsonData);
}
var g = gen();
var result = g.next();    // 这里的result是{value: fetch('https://api.github.com/users/github'), donw: true}
// fetch(url)是一个Promise，所以需要then来执行下一步
result.value.then(function(data) {
  return data.json();
}).then(function(data) {
  // 获取到json data，然后作为参数调用next，相当于把data传给了jsonData，然后执行console.log(jsonData);
  g.next(data);
})
// 再回到redux-saga来，可以把saga想象成开了一个以最快速度不断地调用next方法并尝试获取所有yield表达式值的线程。
// saga.js
import {take,put} from 'redux-saga/effects';
function* mySaga() {
  // 阻塞：take犯法就是等待USER_INTERACTED_WITH_UI_ACTION这个action执行
  yield take(USER_INTERACTED_WITH_UI_ACTION);
  // 阻塞：put方法将同步发起一个action
  yield put(SHOW_LOADING_ACTION, {isLoading: true});
  // 阻塞：将等待FetchFn结束，等待返回的Promise
  const data = yield call(FetchFn, 'https://my.server.com/getdata');
  // 阻塞：将同步发起action（使用刚才返回的Promise.then）
  yield put(SHOW_DATA_ACTION, {data: data});
}
// 每一个yield都发起了阻塞，sage会等待执行结果返回，再执行下一指令。也牛市相当于take、put、call、put这几个方法的调用变成了同步的，上面的全部完成反悔了，才会执行下面的，类似于await
// 使用saga，我们可以很细粒度的控制各个不作用每一部的操作，可以把异步操作和同步发起action一起，随便的排列组合。
// saga还提供takeEvery、takeLatest之类的辅助函数，来控制是否允许多个异步请求同时执行，尤其是takeLatest，翻遍处理由于网络延迟造成的多次请求数据冲突或混乱的问题。
function mySaga() {
  if (action.type === 'USER_INTERACTED_WITH_UI_ACTION') {
    store.dispatch({type: 'SHOW_LOADING_ACTION', isLoading: true});
    const data = await Fetch('https://my.server.com/getdata');
    store.dispatch({type: 'SHOW_DATA_ACTION', data: data});
  }
}
// saga还能很方便的并行执行异步任务，或者让两个异步任务竞争:
// 并行执行，并等待所有的结果，类似Promise.all的行为
const [users, repos] = yield [
  call(fetch, '/users'),
  call(fetch, '/repos')
]
// 并行执行，哪个先完成返回哪个，剩下的就取消掉了
const {posts, timeout} = yield race({
  posts: call(fetchApi, '/posts'),
  timeout: call(delay, 1000)
})
// saga的每一步都可以做一些断言（assert）之类的，所以非常方便测试，而且很容易测试到不同的分支。
// redux-saga文档
// https://redux-saga-in-chinese.js.org/


对比Redux-thunk
// 比较一下redux-thunk和redux-saga的代码
import * as types from '../constants/ActionTypes';
export function receiveBooks(data) {
  return {
    type: types.RECEIVE_BOOKS,
    books: data.books,
    categories: data.categories,
    genres: data.genres
  }
}
export function fetchBooks() {
  return dispatch => {
    fetch("/books.json").then(responese => {
      const data = respones.json();
      dispatch(receiveBooks(data));
    })
    .catch(error => 
      dispatch({type: types.FETCH_FAILED, error})
    );
  };
}
// .
import {takeLatest} from 'redux-saga';
import {call, put} from 'redux-saga/effects';
function* fetchBooks(path) {
  try {
    const data = yield call(fetch, path);
    yield put({type: "RECEIVE_BOOKS", data});
  } catch (e) {
    yield put({type: "FETCH_FAILED", message: e.message});
  }
}
function* fetchSaga() {
  yield* takeLatest("FETCH_BOOKS", fetchBooks);
}
export default fetchSaga;
// 和redux-thunk等其他异步中间件相比来说，redux-saga主要有下面几个特点：
// 异步数据获取的相关业务逻辑放在了单独的sage.js中，不再是掺杂在action.js或component.js中。
// dispatch的单数是标准的action，没有魔法。
// saga代码采用类似同步的方式书写，代码变得更易读。
// 代码异常/请求失败都可以直接通过try/catch语法直接捕获处理。
// *很容易测试，如果是thunk的Promise，测试的话就需要不停的mock不同的数据。
// redux-saga是用一些学习的复杂度，换来了代码的高可维护性，还是很值得在项目中使用的。


Dva
// 基于redux和redux-saga的数据流方案，内置了react-router和fetch，可以理解为一个轻量级的应用框架。
// dva做的事情很简单，就是让action、reducer、saga之类的东西可以写到一起，不用分开来写了，比如：
app.model({
  // namespace - 对应reducer和combine到rootReducer时的key值
  namespace: "products",
  // state - 对应reducer的initialState
  state: {
    list: [],
    loading: false
  },
  // subscription - 在dom ready后执行
  subscriptions: [
    function(dispatch) {
      dispatch({type: 'products/query'});
    },
  ],
  // effects - 对应saga，并简化了使用
  effects: {
    ['products/query']: function* () {
      yield call(delay(800));
      yield put({
        type: 'products/query/success',
        payload: ['ant-tool', 'roof'],
      });
    },
  },
  // reducers - 就是传统的reducers
  reducers: {
    ['products/query'](state) {
      return {...state, loading: true, };
    },
    ['products/query/success'](state, {payload}) {
      return {...state, loading: false, list: payload };
    },
  },
});
// dva最主要就是把store及saga统一为一个model的概念（有点类似Vuex的Module），写在了一个js文件里。增加了一个Subscriptions，用于收集其他来源的action，比如快捷键操作。
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return {
        ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return {...state, current: state.current - 1};
    },
  },
  effects: {
    *add(action, {call, put}) {
      yield call(delay, 1000);
      yield put({type: 'minus'});
    },
  },
  subscriptions: {
    keyboardWatcher({dispath}) {
      key('ctrl+up', () => {dispatch({type: 'add'})});
    },
  },
});


MobX
// 前面的都还是Flux体系的，都是单向数据流方案，接下来要说的MobX，就和他们不太一样了。
// 问题：解决应用状态管理的问题。目标：统一维护公共的应用状态，以统一并且可控的方式更新状态，状态更新后，View跟着更新。
// MobX背后的哲学很简单：任何源自应用状态的东西都应该自动地获得。状态只要一变，其他用到状态的地方就跟着自动变。
// Flux或者Redux的思想主要就是函数式编程（FP）的思想，MobX更接近于面向对象编程，它把state包装秤可观察的对象，这个对象会驱动各种改变。
// state只要以改变，所有用到它的地方就都跟着改变了。这样整个View可以被state来驱动。
const obj = observable({a: 1, b: 2})
autoRun(() => {
  console.log(obj.a)
})
obj.b = 3;  // nothing happen
obj.a = 2;  // observe函数的回调触发了，控制台输出：2
// MobX允许有多个store，而且这些store里的state可以直接修改，不用像Redux那样每次返回个新的。这个有点像Vuex，自由度更高，写的代码更少。不过它也会让代码不好维护。
// MobX和Flux、Redux一样，都是和具体的前端框架无关的，也就是说可以用于React（mobx-react）或者Vue（mobx-vue）。一般来说，用到React比较常见，很少用于Vue，因为Vuex本身就类似MobX，很灵活。如果我们把MobX用于React或者Vue，可以看到很多setState()和this.state.xxx=这样的处理都可以省略了。
// MobX文档
// https://cn.mobx.js.org/


对比Redux
// 以计数器代码为例
// Redux代码
import React, {Component} from 'react';
import {
  createStore,
  bindActionCreators
} from 'redux';
import {Provider, connect} from 'react-redux';
// action types
const COUNTER_ADD = 'counter_add';
const COUNTER_DEC = 'counter_dec';
const initialState = {a: 0};
// reducers
function reducers(state = initialState, action) {
  switch(action.type) {
    case COUNTER_ADD:
      return {...state, a: state.a + 1};
    case COUNTER_DEC:
      return {...state, a: state.a - 1};
    default:
      return state
  }
}
// action creator
const incA = () => ({type: COUNTER_ADD});
const decA = () => ({type: COUNTER_DEC});
const Actions = {incA, decA};
class Demo extends Component {
  render() {
    const {store, actions} = this.props;
    return (
      <div>
        <p>a = {store.a}</p>
        <p>
          <button className="ui-btn" onClick={actions.incA}>增加a</button>
          <button className="ui-btn" onClick={actions.decA}>减少a</button>
        </p>
      </div>
    );
  }
}
// 将state、actions映射到组件props
const mapStateToPtops = state => ({store: state});
const mapDispatchToProps = dispatch => ( {
  // bindActionCreators简化dispatch
  actions: bindActionCreators(Actions, dispatch)
})
// conect产生容器组件
const Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(Demo);
const store = createStore(reducers);
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}
// MobX代码
import React, {Component} from 'react';
import {observable, action} from 'mobx';
import {Provider, observer, inject} from 'mobx-react';
// 定义数据结构
class Store {
  // 使用observable decorator
  @observable a = 0;
}
// 定义对数据的操作
class Actions {
  constructor({store}) {
    this.store = store;
  }
  // 使用action decorator
  @action
  incA = () => {
    this.store.a++;
  }
  @action
  decA = () => {
    this.store.a--;
  }
}
// 实例化单一数据源
const store = new Store();
// 实例化actions，并且和store进行关联
const actions = new Actions({store});
// inject向业务组件注入store，actions，和Provider配合使用
// 使用inject decorator和observer decorator
@inject('store', 'actions')
@observer
class Demo extends Component {
  render() {
    const {store, actions} = this.props;
    return (
      <div>
        <p>a = {store.a}</p>
        <p>
          <button className="ui-btn" onClick={actions.incA}>增加a</button>
          <button className="ui-btn" onClick={actions.decA}>减少a</button>
        </p>
      </div>
    );
  }
}
class App extends Component {
  render() {
    // 使用Provider在被inject的子组件里，可以通过props.store props.actions访问
    return (
      <Provider store={store} actions={actions}>
        <Demo />
      </Provider>
    )
  }
}
export default App;
// 以下对比
// Redux数据流流动很自然，可以充分利用时间回溯的特性，增强业务的可预测性；MobX没有那么自然的数据流动，也没有时间回溯的能力，但是View更新很准确，粒度控制很细。
// Redux通过引入一些中间件来处理副作用；MobX没有中间件，副作用的处理比较自由，比如依靠autorunAsync之类的方法。
// Redux的样板代码更多，做一大堆准备工作，然后才开始炒菜；MobX基本没有多余代码，直接硬来。
// Redux比Mobx更多的样板代码，是因为特定的设计约束。如果项目比较小的话，使用MobX会比较灵活，但是大型项目，像MobX这样没有约束，没有最佳实践的方式，会造成代码很难维护，各有利弊。一般来说，小项目建议MobX就够了，大项目还是用Redux比较合适。





