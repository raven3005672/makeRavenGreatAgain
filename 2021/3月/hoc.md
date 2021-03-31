```js
function HOC(Component) {
  return class wrapComponent extends React.Component{
     constructor(){
       super()
       this.state={
         name:'alien'
       }
     }
     render=()=><Component { ...this.props } { ...this.state } />
  }
}

@HOC
class Index extends React.Component{
  say(){
    const { name } = this.props
    console.log(name)
  }
  render(){
    return <div> hello,world <button onClick={ this.say.bind(this) } >点击</button>  </div>
  }
}
```

我们要注意一下包装顺序，越靠近Index组件的，就是越内层的HOC,离组件Index也就越近。

```js
// 类组件
@withStyles(styles)
@withRouter
@keepaliveLifeCycle
class Index extends React.Componen{
    /* ... */
}

// 函数组件
function Index(){
    /* .... */
}
export default withStyles(styles)(withRouter( keepaliveLifeCycle(Index) )) 
```

嵌套HOC

```js
// 对于不需要传递参数的HOC，我们编写模型我们只需要嵌套一层就可以，比如withRouter
function withRouter(){
    return class wrapComponent extends React.Component{
        /* 编写逻辑 */
    }
}

// 对于需要参数的HOC，我们需要一层代理
function connect (mapStateToProps){
    /* 接受第一个参数 */
    return function connectAdvance(wrapCompoent){
        /* 接受组件 */
        return class WrapComponent extends React.Component{  }
    }
}
```