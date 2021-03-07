## 通过useEffect声明请求

需求场景：更改一个keyword state并发起查询的请求

```js
const Demo: React.FC = () => {
  const [state, setState] = useState({
    keyword: '',
  });
  const handleKeywordChange = useCallback((e: React.InputEvent) => {
    const nextKeyword = e.target.value;
    setState(prev => ({ ...prev, keyword: nextKeyword }));
  }, []);
  useEffect(() => {
    // query
  }, [state]);
  return // view
}
```

事实上，这个问题恰恰要求我们在写 Hooks 时花更多的精力专注于「变」与「不变」的管理，而不是「调」与「不调」的管理上。

## 注册对window resize的监听

需求场景：在window resize时触发callback函数

```js
const Demo: FC = () => {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight
  ] as const);
  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const callback = // ...
  useEffect(callback, [windowSize]);
  return // view
}
```

抽离代码，得到一个跨组件可复用的自定义Hooks：useWindowSize

```js
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ] as const);
  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize
}
```

基于变更的写法的关键在于把「动作」装换成「状态」。

### 对事件的包装

```js
const useClickEvent = () => {
  const [clickEvent, setClickEvent] = useState<{ x: number; y: number}>(null);
  const dispatch = useCallback((e: React.MouseEvent) => {
    setClickEvent({ x: e.clientX. y: e.clientY});
  }, []);
  return [clickEvent, dispatch] as const;
}
```

### 对调度器的包装（以interval为例）

```js
const useInterval = (interval: number) => {
  const [intervalCount, setIntervalCount] = useState();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIntervalCount(count => count + 1)
    });
    return () => clearInterval(intervalId);
  }, []);
  return intervalCount;
};
```

### 映射map

通过useMemo就可以直接实现把一些变更整合到一起得到一个「computed」状态，对应ReactiveX概念：map/combine/latestFrom

```js
const [state1, setState1] = useState(initialState1);
const [state2, setState2] = useState(initialState2);
const computedState = useMemo(() => {
  return Array(state2).fill(state1).join('');
}, [state1, state2]);
```

### 跳过前几次skip、只在前几次响应take

有时候我们不想在第一次的时候执行effect里的函数，或进行computed映射。可以自己实现useCountEffect、useCountMemo来实现，对应ReactiveX概念：take/skip

```ts
const useCountMemo = <T>(callback: (count: number) => T, deps: any[]): T => {
  const countRef = useRef(0);
  return useMemo(() => {
    const returnValue = callback(countRef.current);
    countRef.current++;
    return returnValue;
  }, deps);
};
export const useCountEffect = (cb: (index: number) => any, deps?: any[]) => {
  const countRef = useRef(0);
  useEffect(() => {
    const returnValue = cb(countRef.current);
    currentRef.current++;
    return returnValue;
  }, deps);
};
```

### 流程与调度(debounce/throttle/delay)

在基于变更的Hooks组件中，debounce/throttle/delay等操作变得很简单。debounce/throttle/delay的对象将不再是callback函数本身，而是变更的状态。对应ReactiveX的概念：debounce/delay/throttle

```ts
const useDebounce = <T>(value: T, time = 250) => {
  const [debouncedState, setDebouncedState] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(value);
    }, time);
    return () => clearTimeout(timer);
  }, [value]);
  return () => clearTimeout(timer);
};
const useThrottle = <T>(value: T, time = 250) => {
  const [throttledState, setThrottledState] = useState(null);
  const lastStamp = useRef(0);
  useEffect(() => {
    const currentStamp = Date.now();
    if (currentStamp - lastStamp > time) {
      setThrottledState(value);
      lastStamp.current = currentStamp;
    }
  }, [value]);
  return throttledState;
};
```

### action/reducer模式的异步流程

```js
const responseState = useAsync(responseInitialState, actionState, function *(action, prevState) {
  switch (action?.type) {
    case 'clear':
      return null;
    case 'request': {
      const { data } = yield apiService.request(action.payload);
      return data;
    }
    default:
      return prevState;
  }
});
```

通过类「action/reducer」模式的异步钩子来维护一个字典类型的数据状态的场景。

```ts
// 来自props或state的actions
// fetch action：获取
let fetchAction: {
  type: 'query',
  id: number;
}
let clearAction: {
  type: 'clear',
  ids: number[];  // 需要保留的ids
}
let updateAction: {
  type: 'update',
  id: number;
}

// 通过一个自定义的merge钩子来保留上述三个状态中最新变更的一个状态
const actions = useMerge(fetchAction, clearAction, updateAction);

// reducer
const dataState = useQuery(
  {} as Record<number, DataType>,
  actions,
  async (action, prev) => {
    switch (action?.type) {
      case 'update':
      case 'query': {
        const { id } = action;
        // 已经存在子列表的情况下，不对数据做变更，返回一个identity函数
        if (action.type === 'query' && prev[id]) {
          return prevState => prevState;
        }
        // 拉取指定id下的列表数据
        const { data } = await httpService.fetchListData({ id });
        // 返回一个插入数据的状态映射函数
        return prev => ({
          ...prev,
          [id]: data,
        });
      }
      case 'clear': {
        // 返回一个保留特定id数据的状态映射函数
        return prev =>
          pick(
            // pick是一个从对象里获取一部分key value对组成新对象的方法
            prev,
            action.ids,
          );
      }
      default:
        return prev;
    }
  },
  { mode: 'multi', immediate: false }
)
```


