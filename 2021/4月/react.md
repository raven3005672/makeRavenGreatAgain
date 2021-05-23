## 组件类

### Component

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
```

实例化

react-reconciler/src/ReactFiberClassComponent.js

```js
function constructClassInstance(
  workInProgress,
  ctor,
  props
) {
  const instance = new ctor(props, context);
  instance.updater = {
    isMounted,
    enqueueSetState() {
      /* setState 触发这里的逻辑 */
    },
    enqueueReplaceState() {},
    enqueueForceUpdate() {
      /* forceUpdate 触发这里的逻辑 */
    }
  }
}
```

### PureComponent

纯组件会浅比较props和state是否相同，来决定是否重新渲染组件。

注意：浅比较！

### memo

高阶组件，memo只能对props的情况确定是否渲染。

接受两个参数，第一个参数是原始组件本身，第二个参数，可以根据一次更新中props是否相同决定原始组件是否重新渲染，返回一个布尔值，true证明组件无需重新渲染，false证明组件需要重新渲染。与shouldComponentUpdate相反。

- React.memo: 第二个参数 返回 true 组件不渲染 ， 返回 false 组件重新渲染。
- shouldComponentUpdate: 返回 true 组件渲染 ， 返回 false 组件不渲染。

```js
function TextMemo(props) {
  console.log('子组件渲染')
  if (props) {
    return <div>hello,world</div>
  }
}
const controllIsRender = (pre, next) => {
  if (pre.number === next.number) {
    // number 不改变，不渲染组件
    return true;
  } else if (pre.number !== next.number && next.number > 5) {
    // number 改变，但值大于5，不渲染组件
    return true;
  } else {
    return false;
  }
}
const NewTextMemo = memo(TextMemo, controlIsRender);


```

## 工具类
## react-hooks
