## Portals

这里提供一个在挂载dom元素以外渲染节点的方式
```js
ReactDOM.createPortal(child, container)
```
其中第一个参数表示可以作为children的参数，比如string，元素或fragment。

除了渲染位置，其他和正常写法一致。

## dynamic import

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

## Error Boundaries

用来捕获子组件的发生的错误，从而执行一些副作用或者展示一个回退ui。

注意有四个场景不会捕获

- 事件处理
- 异步代码
- ssr
- 本身

## Higher-Order Components

高阶组件就是一个函数，输入一个组件，输出另一个组件

## Render Props

通过一个值为函数的prop来共享代码

## 自定义hook

用来将组件逻辑提取到一个可复用的函数，命名以use开头，使用时像使用其他hook一样。

对于react而言，使用自定义hook跟直接在组件中执行自定义hook中的代码一样

这里想强调的是自定义hook的参数没限制，且当参数变化时可以在自定义hook中使用useEffect监听。

```js
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```
