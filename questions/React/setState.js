class Example extends React.Component {
    constructor() {
      super();
      this.state = {
        val: 0
      };
    }
    
    componentDidMount() {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);    // 第 1 次 log
  
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);    // 第 2 次 log
  
      setTimeout(() => {
        this.setState({val: this.state.val + 1});
        console.log(this.state.val);  // 第 3 次 log
  
        this.setState({val: this.state.val + 1});
        console.log(this.state.val);  // 第 4 次 log
      }, 0);
    }
  
    render() {
      return null;
    }
  };

// 0 0 2 3
// setState 通过一个队列机制来实现 state 更新，当执行 setState() 时，会将需要更新的 state 浅合并后放入 状态队列，而不会立即更新 state，队列机制可以高效的批量更新 state。
// 而如果不通过setState，直接修改this.state 的值，则不会放入状态队列，当下一次调用 setState 对状态队列进行合并时，之前对 this.state 的修改将会被忽略，造成无法预知的错误。

// 在 setState 官方文档中介绍：将 nextState 浅合并到当前 state。
// 这是在事件处理函数和服务器请求回调函数中触发 UI 更新的主要方法。
// 不保证 setState 调用会同步执行，考虑到性能问题，可能会对多次调用作批处理。

// 假设 state.count === 0
this.setState({count: state.count + 1});
this.setState({count: state.count + 1});
this.setState({count: state.count + 1});
// state.count === 1, 而不是 3

// 等同于
// 假设 state.count === 0
Object.assign(state,
    {count: state.count + 1},
    {count: state.count + 1},
    {count: state.count + 1}
   )
// {count: 1}


// 也可以传递一个签名为 function(state, props) => newState 的函数作为参数。
// 这会将一个原子性的更新操作加入更新队列，在设置任何值之前，此操作会查询前一刻的 state 和 props。
// ...setState() 并不会立即改变 this.state ，而是会创建一个待执行的变动。
// 调用此方法后访问 this.state 有可能会得到当前已存在的 state（译注：指 state 尚未来得及改变）。

// 即使用 setState() 的第二种形式：以一个函数而不是对象作为参数，此函数的第一个参数是前一刻的state，第二个参数是 state 更新执行瞬间的 props。

// 正确用法
this.setState((prevState, props) => ({
    count: prevState.count + props.increment
}))

[{increment: 1},{increment: 1},{increment: 1}].reduce((prevState, props) => ({
    count: prevState.count + props.increment
}), {count: 0})
// {count: 3}
