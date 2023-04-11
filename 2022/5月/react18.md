# 新特性

## 一、RenderAPI

引入root API，支持 new concurrent renderer（并发模式的渲染）

```js
const root = document.getElementById('root');
// 17
ReactDOM.render(<App />, root);
ReactDOM.unmountComponentAtNode(root);  // 卸载
// 18
ReactDOM.createRoot(root).render(<App />);
root.unmount(); // 卸载
```

删除了render的回调函数

```js
const root = document.getElementById('root');
// 17
ReactDOM.render(<App />, root, () => {
  console.log('complete')
});
// 18
// ...useEffect实现
```

ssr服务端渲染，需要把 hydration 升级为 hydrateRoot

```js
// 17
ReactDOM.hydration(<App />, root);
// 18
ReactDOM.hydrateRoot(root, <App />);
```

children需要显式定义

```js
// React 18
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({ children }) => {
  // 在 React 18 的 FC 中，不存在 children 属性，需要手动申明
  return <div>{children}</div>;
};

export default MyButton;
```

## 二、setState自动批处理

将多个状态更新批量处理，合并成一次更新（在视图层，将多个渲染合并成一次渲染）。

**18之前**只在React事件处理函数中进行批处理更新。
默认情况下，**在promise、setTimeout、原生事件处理函数中，或任何其他事件内的更新**都**不会**进行批处理。

- 在 18 之前，只有在react事件处理函数中，才会自动执行批处理，其它情况会多次更新
- 在 18 之后，任何情况都会自动执行批处理，多次更新始终合并为一次

## 三、flushSync

批处理是一个破坏性改动，如果你想退出批量更新，你可以使用 flushSync。

**flushSync 函数内部的多个 setState 仍然为批量更新**

```js
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

const App: React.FC = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  return (
    <div
      onClick={() => {
        flushSync(() => {
          setCount1(count => count + 1);
        });
        // 第一次更新
        flushSync(() => {
          setCount2(count => count + 1);
        });
        // 第二次更新
      }}
    >
      <div>count1： {count1}</div>
      <div>count2： {count2}</div>
    </div>
  );
};

export default App;
```

## 四、关于卸载组件时的更新状态警告

我们在 useEffect 里面发送了一个异步请求，在异步函数还没有被 resolve 或者被 reject 的时候，我们就卸载了组件。 在这种场景中，警告同样会触发。但是，在这种情况下，组件内部并没有内存泄漏，因为这个异步函数已经被垃圾回收了，此时，警告具有误导性。

## 五、React组件的返回值

17只允许返回null，18返回undefined不会崩溃

## 六、StrictMode

使用严格模式时，React会对每个组件进行两次渲染，17中取消了其中一次渲染的控制台日志，18取消了这个限制，如果安装了React DevTools，第二次渲染的日志信息将显示为灰色。

## Suspense不再需要fallback来捕获

18不再调过缺失值和值为null的fallback的Suspense边界。相反，会捕获边界并且向外层查找，如果查找不到，将会把fallback呈现为null。

```js
// React 17
const App = () => {
  return (
    <Suspense fallback={<Loading />}> // <--- 这个边界被使用，显示 Loading 组件
      <Suspense>                      // <--- 这个边界被跳过，没有 fallback 属性
        <Page />
      </Suspense>
    </Suspense>
  );
};
export default App;
```

```js
// React 18
const App = () => {
  return (
    <Suspense fallback={<Loading />}> // <--- 不使用
      <Suspense>                      // <--- 这个边界被使用，将 fallback 渲染为 null
        <Page />
      </Suspense>
    </Suspense>
  );
};
export default App;
```

# 新的API

## useId

```js
const id = useId();
```

支持同一个组件在客户端和服务端生成相同的唯一ID，避免hydration的不兼容。

## useSyncExternalStore

useSyncExternalStore 能够通过强制同步更新数据让 React 组件在 Concurrent Mode 下安全地有效地读取外接数据源。

在 Concurrent Mode 下，React 一次渲染会分片执行（以 fiber 为单位），中间可能穿插优先级更高的更新。假如在高优先级的更新中改变了公共数据（比如 redux 中的数据），那之前低优先的渲染必须要重新开始执行，否则就会出现前后状态不一致的情况。

useSyncExternalStore 一般是三方状态管理库使用，我们在日常业务中不需要关注。因为 React 自身的 useState 已经原生的解决的并发特性下的 tear（撕裂）问题。useSyncExternalStore 主要对于框架开发者，比如 redux，它在控制状态时可能并非直接使用的 React 的 state，而是自己在外部维护了一个 store 对象，用发布订阅模式实现了数据更新，脱离了 React 的管理，也就无法依靠 React 自动解决撕裂问题。因此 React 对外提供了这样一个 API。
目前 React-Redux 8.0 已经基于 useSyncExternalStore 实现。

## useInsertionEffect

```js
const useCSS = rule => {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
};
const App: React.FC = () => {
  const className = useCSS(rule);
  return <div className={className} />;
};
export default App;
```

这个 Hooks 只建议 css-in-js 库来使用。 这个 Hooks 执行时机在 DOM 生成之后，useLayoutEffect 之前，它的工作原理大致和 useLayoutEffect 相同，只是此时无法访问 DOM 节点的引用，一般用于提前注入 <style> 脚本。

# Concurrent Mode（并发模式）

从 **同步不可中断更新** 变成了 **异步可中断更新**。

在 18 中，不再有多种模式，而是以**是否使用并发特性**作为**是否开启并发更新**的依据。

**并发特性**指开启**并发模式**后才能使用的特性：
- useDeferredValue
- useTransition

## useTransition

```js
import React, { useState, useEffect, useTransition } from 'react';

const App: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    // 使用了并发特性，开启并发更新
    startTransition(() => {
      setList(new Array(10000).fill(null));
    });
  }, []);
  return (
    <>
      {list.map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </>
  );
};
export default App;
```

startTransition，主要为了能在大量的任务下也能保持 UI 响应。这个新的 API 可以通过将特定更新标记为“过渡”来显著改善用户交互，简单来说，就是被 startTransition 回调包裹的 setState 触发的渲染被标记为不紧急渲染，这些渲染可能被其他紧急渲染所抢占。

## useDeferredValue

返回一个延迟响应的值，可以让一个state 延迟生效，只有当前没有紧急更新时，该值才会变为最新值。useDeferredValue 和 startTransition 一样，都是标记了一次非紧急更新。

- 相同：useDeferredValue 本质上和内部实现与 useTransition 一样，都是标记成了延迟更新任务。
- 不同：useTransition 是把更新任务变成了延迟更新任务，而 useDeferredValue 是产生一个新的值，这个值作为延时状态。（一个用来包装方法，一个用来包装值）

```js
import React, { useState, useEffect, useDeferredValue } from 'react';

const App: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    setList(new Array(10000).fill(null));
  }, []);
  // 使用了并发特性，开启并发更新
  const deferredList = useDeferredValue(list);
  return (
    <>
      {deferredList.map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </>
  );
};

export default App;
```

# fiber架构的具体含义

- 作为架构来说，在旧的架构中，Reconciler（协调器）采用递归的方式执行，无法中断，节点数据保存在递归的调用栈中，被称为 Stack Reconciler，stack 就是调用栈；在新的架构中，Reconciler（协调器）是基于fiber实现的，节点数据保存在fiber中，所以被称为 fiber Reconciler。
- 作为静态数据结构来说，每个fiber对应一个组件，保存了这个组件的类型对应的dom节点信息，这个时候，fiber节点就是我们所说的虚拟DOM。
- 作为动态工作单元来说，fiber节点保存了该节点需要更新的状态，以及需要执行的副作用。
