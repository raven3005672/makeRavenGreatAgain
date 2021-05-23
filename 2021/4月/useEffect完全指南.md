## 每一次渲染都有它自己的Props and State

当我们更新状态的时候，React会重新渲染组件。每一次渲染都能拿到独立的count 状态，这个状态值是函数中的一个常量。

```js
function Counter() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

- 点击增加counter到3
- 点击一下 “Show alert”
- 点击增加 counter到5并且在定时器回调触发前完成

输出的结果是3

## 每一次渲染都有它自己的Effects

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

并不是拿到新的值，而是effect函数本身在每一次渲染中都不相同。每一个effect版本看到的count值都来自于它属于的那次渲染。

## 每一次渲染都有它自己的...所有

hooks依赖js闭包。

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

FC中，顺序输出1，2，3，4，5

```js
componentDidUpdate() {
  setTimeout(() => {
    console.log(`You clicked ${this.state.count} times`);
  }, 3000);
}
```

CC中，顺序输出5，5，5，5，5

## 逆潮而动

```js
function Example() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  useEffect(() => {
    // Set the mutable latest value
    latestCount.current = count;
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCount.current} times`);
    }, 3000);
  });
  // ...
```

输出5，5，5，5，5

## Effect中的清理，取消副作用（比如取消订阅）

```js
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
  }
});
```

假设第一次渲染的时候props是{id: 10}，第二次渲染的时候是{id: 20}。

- React 渲染{id: 20}的UI。
- 浏览器绘制。我们在屏幕上看到{id: 20}的UI。
- React 清除{id: 10}的effect。
- React 运行{id: 20}的effect。

## 同步，而非生命周期

React会根据我们当前的props和state同步到DOM。“mount”和“update”之于渲染并没有什么区别。

你应该以相同的方式去思考effects。useEffect使你能够根据props和state同步React tree之外的东西。

```js
function Greeting({ name }) {
  useEffect(() => {
    document.title = 'Hello, ' + name;
  });
  return (
    <h1 className="Greeting">
      Hello, {name}
    </h1>
  );
}
```

## 告诉React去对比你的Effects

```js
useEffect(() => {
  document.title = 'Hello, ' + name;
}, [name]); // Our deps

const oldEffect = () => { document.title = 'Hello, Dan'; };
const oldDeps = ['Dan'];

const newEffect = () => { document.title = 'Hello, Dan'; };
const newDeps = ['Dan'];
```

## 关于依赖项不要对React撒谎

如果你设置了依赖项，effect中用到的所有组件内的值都要包含在依赖中。这包括props，state，函数 — 组件内的任何东西。

## 如果设置了错误的依赖会怎么样呢？

```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}
```

这个例子只会执行一次。

第一次渲染的时候，count是0，setCount(count+1)等价于setCount(0+1)，因为设置了[]依赖，effect不会再重新运行，它后面每一秒都会调用setCount(0+1)。

## 两种诚实告知依赖的方法

第一种策略是在依赖中包含所有effect中用到的组件内的值。

```js
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, [count]);
```

第二种策略是修改effect内部的代码以确保它包含的值只会在需要的时候发生变更。我们不想告知错误的依赖 - 我们只是修改effect使得依赖更少。

## 让Effects自给自足

```js
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

## 函数式更新和 Google Docs

然而，即使是setCount(c => c + 1)也并不完美。它看起来有点怪，并且非常受限于它能做的事。举个例子，如果我们有两个互相依赖的状态，或者我们想基于一个prop来计算下一次的state，它并不能做到。幸运的是， setCount(c => c + 1)有一个更强大的姐妹模式，它的名字叫useReducer。

## 解耦来自Actions的更新

```js
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + step);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}
```

当你写类似setSomething(something => ...)这种代码的时候，也许就是考虑使用reducer的契机。reducer可以让你把组件内发生了什么(actions)和状态如何响应并更新分开表述。

```js
const [state, dispatch] = useReducer(reducer, initialState);
const { count, step } = state;

useEffect(() => {
  const id = setInterval(() => {
    dispatch({ type: 'tick' }); // Instead of setCount(c => c + step);
  }, 1000);
  return () => clearInterval(id);
}, [dispatch]);

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
```

## 为什么useReducer是Hooks的作弊模式

```js
function Counter({ step }) {
  const [count, dispatch] = useReducer(reducer, 0);

  function reducer(state, action) {
    if (action.type === 'tick') {
      return state + step;
    } else {
      throw new Error();
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return <h1>{count}</h1>;
}
```

React也保证dispatch在每次渲染中都是一样的。 所以你可以在依赖中去掉它。它不会引起effect不必要的重复执行。

当你dispatch的时候，React只是记住了action - 它会在下一次渲染中再次调用reducer。在那个时候，新的props就可以被访问到，而且reducer调用也不是在effect里。

## 把函数移到Effects里

```js
function SearchResults() {
  const [query, setQuery] = useState('react');

  useEffect(() => {
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=' + query;
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps are OK

  // ...
}
```

## 但我不能吧这个函数放到Effect里

如果一个函数没有使用组件内的任何值，你应该把它提到组件外面去定义，然后就可以自由地在effect中使用：

```js
// ✅ Not affected by the data flow
function getFetchUrl(query) {
  return 'https://hn.algolia.com/api/v1/search?query=' + query;
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl('react');
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  // ...
}
```

或者，可以把它包装成useCallback：

```js
function SearchResults() {
  const [query, setQuery] = useState('react');

  // ✅ Preserves identity until query changes
  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]);  // ✅ Callback deps are OK

  useEffect(() => {
    const url = getFetchUrl('react');
    // ... Fetch data and do something ...
  }, [getFetchUrl]); // ✅ Effect deps are OK

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... Fetch data and do something ...
  }, [getFetchUrl]); // ✅ Effect deps are OK

  // ...
}
```

useCallback本质上是添加了一层依赖检查。它以另一种方式解决了问题 - 我们使函数本身只在需要的时候才改变，而不是去掉对函数的依赖。






