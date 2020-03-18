# React

## 受控组件和非受控组件的区别

由React控制的输入表单元素元素而改变其值的方式，称为受控组件。

```js
// 受控
<input type="text" value={this.state.value} onChange={this.change} />
// 不受控
<input type="text" ref={input => this.input = input}/>
```

## redux工作流，原理

## createStore源码

## hook

## 生命周期

## HOC

## diff算法

## context

## react-router

## Fiber架构，调度原理

## 事件委托

## setState异步

为了性能优化做的批量更新。

