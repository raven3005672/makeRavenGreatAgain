# hooks

## state hook

- 基础用法
- 更新
  - 直接更新不依赖于旧state的值
  - 函数式更新依赖于旧state的值
- 实现合并
- 惰性初始化state
- 一些重点
  - hook更新的state总是替换而不是合并
  - 推荐使用多个state变量，而不是单个state变量
  - 调用state hook的更新函数并传入当前的state时，react将跳过子组件的渲染及effect的执行。（React使用 Object.is比较算法 来比较state）

```js
// 直接更新
setState(newCount)
// 函数式更新
setState(prevCount => prevCount - 1)
// 合并
setState(prevState => {
  return {...prevState, ...updatedValues}
})
// 惰性初始化
const [state, setState] = useState(() => {
  // 只在初始渲染时被调用
  const initialState = someExpensiveComputation(props);
  return initialState;
})
```

## Effect Hook

- 基础用法
- 清除操作
- 执行时期
- 性能优化
- 模拟componentDidMount
  - useEffect(() => [])
- 最佳实践
  - 可以把函数移动到组件之外
  - 可以把函数加入effect的依赖里，它的定义包裹进useCallback Hook
- 一些重点
  - 可以看做componentDidMount、componentDidUpdate、componentWillUnmount三个函数的组合
  - 基本上都希望在React更新DOM之后才执行我们的操作

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清除订阅
    subscription.unsubscribe();
  }
});
// 性能优化
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]);
// 模拟componentDidMount
useEffect(() => {
  ...
}, []);
// 最佳实践
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ 安全（我们的 effect 仅用到了 `someProp`）
}
// 可以尝试把那个函数移动到你的组件之外。
// 万不得已的情况下，可以把函数假如effect的依赖，但把它的定义包裹进useCallback Hook，这就确保了它不随渲染而改变，除非它自身的依赖发生了改变。
```

## useContext

用来处理多层级传递数据的方式。

- 使用React Context API，在组件外部简历一个Context
- 使用Context.Provider提供了一个Context对象，这个对象可以被子组件共享
- useContext()钩子函数用来引入 Context 对象，并且获取到它的值

```js
// 使用React Context API，在组件外部简历一个Context
import React from 'react';
const ThemeContext = React.createContext(0);
export default ThemeContext;
// 使用Context.Provider提供了一个Context对象，这个对象可以被子组件共享
import React, { useState } from 'react';
import ThemeContext from './ThemeContext';
import ContextComponent1 from './ContextComponent1';

function ContextPage () {
  const [count, setCount] = useState(1);
  return (
    <div className="App">
      <ThemeContext.Provider value={count}>
        <ContextComponent1 />
      </ThemeContext.Provider>
      <button onClick={() => setCount(count + 1)}>
              Click me
      </button>
    </div>
  );
}

export default ContextPage;
// useContext()钩子函数用来引入Context对象，并且获取到它的值
// 子组件，在子组件中使用孙组件
import React from 'react';
import ContextComponent2 from './ContextComponent2';
function ContextComponent () {
  return (
    <ContextComponent2 />
  );
}
export default ContextComponent;
// 孙组件，在孙组件中使用 Context 对象值
import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';
function ContextComponent () {
  const value = useContext(ThemeContext);
  return (
    <div>useContext:{value}</div>
  );
}
export default ContextComponent;
```

## useReducer

- 基础用法
  - 比useState更适用的场景：例如state逻辑处理较复杂且包含多个子值，或者下一个state依赖于之前的state等
- 惰性初始化state


```js
// 基础用法
import React, { useReducer } from 'react';
interface stateType {
  count: number
}
interface actionType {
  type: string
}
const initialState = { count: 0 };
const reducer = (state:stateType, action:actionType) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
};
const UseReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <div>useReducer Count:{state.count}</div>
      <button onClick={() => { dispatch({ type: 'decrement' }); }}>useReducer 减少</button>
      <button onClick={() => { dispatch({ type: 'increment' }); }}>useReducer 增加</button>
    </div>
  );
};

export default UseReducer;
// 惰性初始化state
interface stateType {
  count: number
}
interface actionType {
  type: string,
  paylod?: number
}
const initCount =0 
const init = (initCount:number)=>{
  return {count:initCount}
}
const reducer = (state:stateType, action:actionType)=>{
  switch(action.type){
    case 'increment':
      return {count: state.count + 1}
    case 'decrement':
      return {count: state.count - 1}
    case 'reset':
      return init(action.paylod || 0)
    default:
      throw new Error();
  }
}
const UseReducer = () => {
  const [state, dispatch] = useReducer(reducer,initCount,init)

  return (
    <div className="App">
      <div>useReducer Count:{state.count}</div>
      <button onClick={()=>{dispatch({type:'decrement'})}}>useReducer 减少</button>
      <button onClick={()=>{dispatch({type:'increment'})}}>useReducer 增加</button>
      <button onClick={()=>{dispatch({type:'reset',paylod:10 })}}>useReducer 增加</button>
    </div>
  );
}
export default UseReducer;
```

## Memo

当父组件重新渲染时，子组件也会重新渲染，即使子组件的 props 和 state 都没有改变。

我们可以使用 memo 包一层，就能解决上面的问题；
但是仅仅解决父组件没有传参给子组件的情况以及父组件传简单类型的参数给子组件的情况（例如 string、number、boolean等）；
如果有传复杂属性应该使用 useCallback（回调事件）或者 useMemo（复杂属性）

## useMemo

使用 useMemo 将对象属性包一层，useMemo 有两个参数：

- 第一个参数是个函数，返回的对象指向同一个引用，不会创建新对象；
- 第二个参数是个数组，只有数组中的变量改变时，第一个参数的函数才会返回一个新的对象。

```js
import React, { memo, useMemo, useState } from 'react';

// 子组件
const ChildComp = (info:{info:{name: string, age: number}}) => {
  console.log('ChildComp...');
  return (<div>ChildComp...</div>);
};

const MemoChildComp = memo(ChildComp);

// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name] = useState('jack');
  const [age] = useState(11);
  
  // 使用 useMemo 将对象属性包一层
  const info = useMemo(() => ({ name, age }), [name, age]);

  return (
    <div className="App">
      <div>hello world {count}</div>
      <div onClick={() => { setCount(count => count + 1); }}>点击增加</div>
      <MemoChildComp info={info}/>
    </div>
  );
};

export default Parent;
```

## useCallback

修改父组件的 changeName 方法，用 useCallback 钩子函数包裹一层， useCallback 参数与 useMemo 类似

```js
import React, { memo, useCallback, useMemo, useState } from 'react';

// 子组件
const ChildComp = (props:any) => {
  console.log('ChildComp...');
  return (<div>ChildComp...</div>);
};

const MemoChildComp = memo(ChildComp);

// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name] = useState('jack');
  const [age] = useState(11);
  const info = useMemo(() => ({ name, age }), [name, age]);
  const changeName = useCallback(() => {
    console.log('输出名称...');
  }, []);

  return (
    <div className="App">
      <div>hello world {count}</div>
      <div onClick={() => { setCount(count => count + 1); }}>点击增加</div>
      <MemoChildComp info={info} changeName={changeName}/>
    </div>
  );
};

export default Parent;
```

## useRef

### 指向dom元素

```js
import React, { useRef, useEffect } from 'react';
const Page1 = () => {
  const myRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    myRef?.current?.focus();
  });
  return (
    <div>
      <span>UseRef:</span>
      <input ref={myRef} type="text"/>
    </div>
  );
};

export default Page1;
```

### 存放变量

useRef 在 react hook 中的作用, 正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西. createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。

```js
import React, { useRef, useEffect, useState } from 'react';
const Page1 = () => {
    const myRef2 = useRef(0);
    const [count, setCount] = useState(0)
    useEffect(()=>{
      myRef2.current = count;
    });
    function handleClick(){
      setTimeout(()=>{
        console.log(count); // 3
        console.log(myRef2.current); // 6
      },3000)
    }
    return (
    <div>
      <div onClick={()=> setCount(count+1)}>点击count</div>
      <div onClick={()=> handleClick()}>查看</div>
    </div>
    );
}

export default Page1;
```

## useImperativeHandle

通过 ref 获取到的是整个 dom 节点，通过 useImperativeHandle 可以控制只暴露一部分方法和属性，而不是整个 dom 节点。

## useLayout

其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect，这里不再举例。

- useLayoutEffect 和平常写的 Class 组件的 componentDidMount 和 componentDidUpdate 同时执行；
- useEffect 会在本次更新完成后，也就是第 1 点的方法执行完成后，再开启一次任务调度，在下次任务调度中执行 useEffect；
