# 过渡任务

18诞生了concurrent Mode

concurrent Mode => susponse => startTransition

需要开启并发模式，也就是需要通过createRoot创建Root

```js
import ReactDOM from 'react-dom';
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App/>)
```

输入框状态改变更新优先级要大于列表的更新的优先级。

```js
import { useTransition } from 'react' 

/* 使用 */
const  [ isPending , startTransition ] = useTransition ()

const handleChange = () => {
  // 高优先级任务 —— 改变搜索条件
  setInputValue(e.target.value);
  // 低优先级任务 —— 改变搜索过滤后列表状态
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
}
```

startTransition 相比 setTimeout 的优势和异同是：

一方面：startTransition 的处理逻辑和 setTimeout 有一个很重要的区别，setTimeout 是异步延时执行，而 startTransition 的回调函数是同步执行的。在 startTransition 之中任何更新，都会标记上 transition，React 将在更新的时候，判断这个标记来决定是否完成此次更新。所以 Transition 可以理解成比 setTimeout 更早的更新。但是同时**要保证 ui 的正常响应**，在性能好的设备上，transition 两次更新的延迟会很小，但是在慢的设备上，延时会很大，但是不会影响 UI 的响应。

另一方面，就是通过上面例子，可以看到，对于渲染并发的场景下，setTimeout 仍然会使页面卡顿。因为超时后，还会执行 setTimeout 的任务，它们与用户交互同样属于宏任务，所以仍然会阻止页面的交互。那么 transition 就不同了，在 conCurrent mode 下，startTransition 是可以中断渲染的 ，所以它不会让页面卡顿，React 让这些任务，在浏览器空闲时间执行，所以上述输入 input 内容时，startTransition 会优先处理 input 值的更新，而之后才是列表的渲染。


transition 和节流防抖 本质上的区别是：

一方面，节流防抖 本质上也是 setTimeout ，只不过控制了执行的频率，那么通过打印的内容就能发现，原理就是让 render 次数减少了。而 transitions 和它相比，并没有减少渲染的次数。

另一方面，节流和防抖需要有效掌握 Delay Time 延时时间，如果时间过长，那么给人一种渲染滞后的感觉，如果时间过短，那么就类似于 setTimeout(fn,0) 还会造成前面的问题。而 startTransition 就不需要考虑这么多。

React 18 提供了 useDeferredValue 可以让状态滞后派生。useDeferredValue 的实现效果也类似于 transtion，当迫切的任务执行后，再得到新的状态，而这个新的状态就称之为 DeferredValue 。

useDeferredValue 和上述 useTransition 本质上有什么异同呢？

- 相同点：
  - useDeferredValue 本质上和内部实现与 useTransition  一样都是标记成了过渡更新任务。
- 不同点：
  - useTransition 是把 startTransition 内部的更新任务变成了过渡任务transtion,而 useDeferredValue 是把原值通过过渡任务得到新的值，这个值作为延时状态。 一个是处理一段逻辑，另一个是生产一个新的状态。
  - useDeferredValue 还有一个不同点就是这个任务，本质上在 useEffect 内部执行，而 useEffect 内部逻辑是异步执行的 ，所以它一定程度上更滞后于 useTransition。 useDeferredValue = useEffect + transtion

startTransition
```js
export function startTransition(scope) {
  const prevTransition = ReactCurrentBatchConfig.transition;
  /* 通过设置状态 */
  ReactCurrentBatchConfig.transition = 1;
  try {  
      /* 执行更新 */
    scope();
  } finally {
    /* 恢复状态 */  
    ReactCurrentBatchConfig.transition = prevTransition;
  }
}
```

useTransition
```js
function mountTransition(){
  const [isPending, setPending] = mountState(false);
  const start = (callback)=>{
    setPending(true);
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = 1;
    try {
      setPending(false);
      callback();
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }
  return [isPending, start];
}
```

- 从上面可以看到，useTransition 本质上就是 useState +  startTransition 。
- 通过 useState 来改变 pending 状态。在 mountTransition 执行过程中，会触发两次 setPending ，一次在 transition = 1 之前，一次在之后。一次会正常更新 setPending(true) ，一次会作为 transition 过渡任务更新 setPending(false); ，所以能够精准捕获到过渡时间。


useDeferredValue
```js
function updateDeferredValue(value){
  const [prevValue, setValue] = updateState(value);
  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = 1;
    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}
```

- 从上面可以看到 useDeferredValue 本质上是 useDeferredValue = useState + useEffect + transition
- 通过传入 useDeferredValue 的 value 值，useDeferredValue 通过 useState 保存状态。
- 然后在 useEffect 中通过 transition 模式来更新 value 。 这样保证了 DeferredValue 滞后于 state 的更新，并且满足 transition  过渡更新原则。
