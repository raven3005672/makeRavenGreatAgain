# 一些知识点

<!-- https://zhuanlan.zhihu.com/p/80721768 -->

## getSnapshotBeforeUpdate

getSnapshowBeforeUpdate为React生命周期函数，在render之前调用。它使得组件能在发生更改之前从DOM中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给componentDidUpdate()。

处理聊天滚动的示例：

```js
class ScrollingList extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        // 我们是否在list中添加新的items？
        // 捕获滚动位置以便我们稍后调整滚动位置
        if (prevProps.list.length < this.props.list.length) {
            const list = this.listRef.current;
            return list.scrollHeight - list.scrollTop;
        }
        return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // 如果我们snapshot有值，说明我们刚刚添加了新的items
        // 调整滚动位置使得这些新items不会将旧得items推出视图
        // 这里的snapshot是getSnapshotBeforeUpdate的返回值
        if (snapshot !== null) {
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }
    render() {
        return (
            <div ref = {this.listRef}>
                {
                    /* ... */
                }
            </div>
        )
    }
}
```

## forceUpdate

默认情况下，当组件的state或props发生变化时，组件将重新渲染。如果render方法依赖于其他数据，则可以调用forceUpdate()强制让组件重新渲染。

调用forceUpdate()将致使组件调用render()方法，此操作会跳过该组件的shouldComponentUpdate()。但其子组件会触发正常的生命周期方法，包括shouldComponentUpdate()方法。如果标记发生变化，React仍将只更新DOM。

简单来说forceUpdate()方法可以强制更新组件，不过不建议使用。

## key

key顾名思义为组件的标识，当key发生改变时组件会重新注册。

## 状态提升

官方解释：通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去。

简单来说，就是两个子组件都使用父组件的一个参数，通过props把该参数传入子组件，并把改变该参数的方法一并传入子组件，通过调用该方法改变父组件共用的参数。

## Fragments

React中的一个常见模式是一个组件返回多个元素。Fragments允许你将子列表分组，而无需向DOM中添加额外节点。

```js
<React.Fragment>
    <div>...</div>
    <div>...</div>
</React.Fragment>
// 可以简写为
<>
    <div>...</div>
    <div>...</div>
</>
```

## children prop

当一个组件无法知晓子组件的内容时，可以把子组件整个传递下去。

```js
function Header(props) {
    return (
        <div>
            {props.children}
        </div>
    )
}
function Page() {
    return (
        <Header>
            <h1>children - 1</h1>
            <h1>children - 2</h1>
        </Header>
    )
}
// 这里props.children就是这两个h1标签
```

## Context

```js
import React, {createContext} from 'react';
import ReactDOM from 'react-dom';

const ThemeContext = createContext('red');

class App extends React.Component {
    state = {
        color: 'green'
    };
    handleChangeColor = () => {
        if (this.state.color === 'green') {
            this.setState({color: 'red'});
        } else {
            this.setState({color: 'green'});
        }
    }
    render() {
        // 使用一个Provider来将当前的color传递给以下的组件树
        // 无论多深，任何组件都能读取这个值
        // 在这个例子中，我们将dark作为当前的值传递下去
        return (
            <ThemeContext.Provider value={this.state.color}>
                <Toolbar/>
                <br/>
                <button onClick={this.handleChangeColor}>changeColor</button>
            </ThemeContext.Provider>
        )
    }
}
// 中间的组件再也不必指明往下传递color了。
function Toolbar(props) {
    return <ThemedSpan />;
}
class ThemedSpan extends React.Component {
    // 指定contextType读取当前的color context
    // React会往上找到最近的的color Provider，然后使用它的值
    // 在这个例子中，当前的color值为green
    static contextType = ThemeContext;
    render() {
        return <Span color={this.context} />
    }
}
class Span extends React.Component {
    static contextType = ThemeContext;
    render() {
        return (
            <span style={{backgroundColor: this.props.color}}>
                {this.context}
            </span>
        )
    }
}
ReactDOM.render(<App/>, document.getElementById('container'));
```
