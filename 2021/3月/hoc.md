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

正向属性代理

```js
function HOC(WrapComponent) {
  return class Advance extends React.Component {
    state = {
      name: 'alien'
    }
    render() {
      return <WrapComponent {...this.props} {...this.state} />
    }
  }
}
```

缺点：
- 无法直接获取业务组件的状态，如果想要获取，需要ref获取组件实例。
- 无法直接继承静态属性。

反向继承

```js
class Index extends React.Component {
  render() {
    return <div>hello, world</div>
  }
}
function HOC(Component) {
  return class wrapComponent extends Component {
    /* 直接继承需要包装的组件 */
  }
}
export default HOC(Index);
```

缺点：
- 无状态组件无法使用
- 和被包装的组件强耦合，需要知道被包装的组件的内部状态，具体是做什么
- 如果多个反向继承hoc嵌套在一起，当前状态会覆盖上一个状态。

### 强化props

#### 混入props
#
```js
// 有状态组件
function classHOC(WrapComponent) {
  return class Idex extends React.Component {
    state = {
      name: 'alien'
    }
    componentDidMount() {
      console.log('HOC')
    }
    render() {
      return <WrapComponent {...this.props} {...this.state}/>
    }
  }
}
function Index(props) {
  const { name } = props;
  useEffect(() => {
    console.log('index')
  }, [])
  return <div>hello, world, my name is { name }</div>
}
export default classHOC(Index);
// 无状态区间
function functionHOC(WrapComponent) {
  return function Index(props) {
    const [ state, setState ] = useState({ name: 'alien' });
    return <WrapComponent {...props} {...state} />
  }
}
```

#### 抽离state控制更新

```js
function classHOC(WrapComponent) {
  return class Idex extends React.Component {
    constructor() {
      super()
      this.state = {
        name: 'alien'
      }
    }
    changeName(name) {
      this.setState({ name })
    }
    render() {
      return <WrapComponent {...this.props} {...this.state} changeName={this.changeName.bind(this)} />
    }
  }
}
function Index(props) {
  const [value, setValue] = useState(null)
  const {name, changeName} = props
  return <div>
    <div>hello,world, my name is {name}</div>
    改变name<input onChnage={(e) => setValue(e.target.value)}/>
    <button onClick={() => changeName(value)}>确定</button>
  </div>
}
export default classHOC(Index)
```

### 控制渲染

#### 条件渲染（权限隔离，懒加载，延时加载）

```js
function renderHOC(WrapComponent) {
  return class Index extends React.Component {
    constructor(props) {
      super(props)
      this.state = {visible: true}
    }
    setVisible() {
      this.setState({ visible: !this.state.visisble })
    }
    render() {
      const {visible} = this.state;
      return <div className="box">
        <button onClick={this.setVisible.bind(this)}>挂载组件</button>
        {visible ?
          <WrapComponent {...this.props} setVisible={this.setVisible.bind(this)}> :
          <div className="icon" ><SyncOutlined spin  className="theicon" /></div>}
      </div>
    }
  }
}
class Index extends React.Component{
  render(){
    const { setVisible } = this.props
    return <div className="box" >
        <p>hello,my name is alien</p>
        <img  src='https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=294206908,2427609994&fm=26&gp=0.jpg'   />
        <button onClick={() => setVisible()}  > 卸载当前组件 </button>
    </div>
  }
}
export default renderHOC(Index)
```

##### 分片渲染

```js
const renderQueue = []
let isFirstrender = false;
const tryRender = () => {
  const render = renderQueue.shift()
  if (!render) return
  setTimeout(() => {
    render()
  }, 300)
}
// HOC
function renderHOC(WrapComponent) {
  return function Index(props) {
    const [isRender, setRender] = useState(false)
    useEffect(() => {
      renderQueue.push(() => {
        setRender(true)
      })
      if (!isFirstrender) {
        tryRender()
        isFirstrender = true
      }
    }, [])
    return isRender ? <WrapComponent tryRender={tryRender} {...props} /> : <div className='box' ><div className="icon" ><SyncOutlined   spin /></div></div>
  }
}
// 业务
class Index extends React.Component{
  componentDidMount(){
    const { name , tryRender} = this.props
    /* 上一部分渲染完毕，进行下一部分渲染 */
    tryRender()
    console.log( name+'渲染')
  }
  render(){
    return <div>
        <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=294206908,2427609994&amp;fm=26&amp;gp=0.jpg" />
    </div>
  }
}
/* 高阶组件包裹 */
const Item = renderHOC(Index)

export default () => {
  return <React.Fragment>
      <Item name="组件一" />
      <Item name="组件二" />
      <Item name="组件三" />
  </React.Fragment>
}
```

##### 异步组件（懒加载）

```js
export default function AsyncRouter(loadRouter) {
  return class Content extends React.Component {
    state = {Component: null}
    componentDidMount() {
      if (this.state.Component) return
      loadRouter()
        .then(module => module.default)
        .then(Component => this.setState({Component}))
    }
    render() {
      const {Component} = this.state
      return Component ? <Component {...this.props}/> : null
    }
  }
}
// 使用
const Index = AsyncRouter(()=>import('../pages/index'))
```

##### 反向继承：渲染劫持

```js
const HOC = (WrapComponent) => 
  class Index extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }
```

##### 反向继承：修改渲染树

```js
class Index extends React.Component {
  render() {
    return <div>
      <ul>
        <li>react</li>
        <li>vue</li>
        <li>angular</li>
      </ul>
    </div>
  }
}
function HOC(Component) {
  return class Advance extends Componet {
    render() {
      const element = super.render()
      const otherProps = {
        name: 'alien'
      }
      // 替换angular元素节点
      const appendElement = React.createElement('li', {}, `hello, world, name name is ${otherProps.name}`)
      const newchild = React.Children.map(element.props.children.props.children, (child, index) => {
        if (index === 2) return appendElement
        return child
      })
      return React.cloneElement(element, element.props, newchild)
    }
  }
}
export default HOC(Index)
```

#### 节流渲染

```js
function HOC(Component) {
  return function renderWrapComponent(props) {
    const {num} = props
    const RenderElement = useMemo(() => <Component {...props} />, [ num ])
    return RenderElement
  }
}
class Index extends React.Component {
  render() {
    console.log(`当前组件是否渲染`, this.props)
    return <div>hello, world, my name is alien</div>
  }
}
const IndexHoc = HOC(Index)
export default () => {
  const [ num, setNumber ] = useState(0)
  const [ num1, setNumebr1 ] = useState(0)
  const [ num2, setNumber2 ] = useState(0)
  return <div>
        <IndexHoc  num={ num } num1={num1} num2={ num2 }  />
        <button onClick={() => setNumber(num + 1) } >num++</button>
        <button onClick={() => setNumber1(num1 + 1) } >num1++</button>
        <button onClick={() => setNumber2(num2 + 1) } >num2++</button>
    </div>
}
```

#### 定制化渲染流

```js
function HOC(rule) {
  return function(Component) {
    return function renderWrapComponent(props) {
      const dep = rule(props)
      const RenderElement = useMemo(() => <Component {...props} />, [dep])
      return RenderELement
    }
  }
}
/* 只有 props 中 num 变化 ，渲染组件  */
@HOC( (props)=> props['num'])
class IndexHoc extends React.Component{
  render(){
     console.log(`组件一渲染`,this.props)
     return <div> 组件一 ： hello,world </div>
  }
}
/* 只有 props 中 num1 变化 ，渲染组件  */
@HOC((props)=> props['num1'])
class IndexHoc1 extends React.Component{
  render(){
     console.log(`组件二渲染`,this.props)
     return <div> 组件二 ： my name is alien </div>
  }
}
export default ()=> {
    const [ num ,setNumber ] = useState(0)
    const [ num1 ,setNumber1 ] = useState(0)
    const [ num2 ,setNumber2 ] = useState(0)
    return <div>
        <IndexHoc  num={ num } num1={num1} num2={ num2 }  />
        <IndexHoc1  num={ num } num1={num1} num2={ num2 }  />
        <button onClick={() => setNumber(num + 1) } >num++</button>
        <button onClick={() => setNumber1(num1 + 1) } >num1++</button>
        <button onClick={() => setNumber2(num2 + 1) } >num2++</button>
    </div>
}
```

#### 劫持原型链-劫持生命周期，事件函数

##### 属性代理实现

```js
function HOC(Component) {
  const proDidMount = Component.proptype.componentDidMount
  Component.prototype.componentDidMount = function() {
    console.log('劫持生命周期：componentDidMount')
    proDidMount.call(this)
  }
  return this.wrapComponent extends React.Component {
    render() {
      return <Component {...props} />
    }
  }
}
@HOC
class Index extends React.Component{
   componentDidMount(){
     console.log('———didMounted———')
   }
   render(){
     return <div>hello,world</div>
   }
}
```

##### 反向继承实现

```js
function HOC (Component){
  const didMount = Component.prototype.componentDidMount
  return class wrapComponent extends Component{
      componentDidMount(){
        console.log('------劫持生命周期------')
        if (didMount) {
           didMount.apply(this) /* 注意 `this` 指向问题。 */
        }
      }
      render(){
        return super.render()
      }
  }
}

@HOC
class Index extends React.Component{
   componentDidMount(){
     console.log('———didMounted———')
   }
   render(){
     return <div>hello,world</div>
   }
}
```

#### 事件监控

##### 组件内的事件监听

```js
function ClickHoc (Component){
  return function Wrap(props){
    const dom = useRef(null)
    useEffect(()=>{
     const handerClick = () => console.log('发生点击事件')
     dom.current.addEventListener('click',handerClick)
     return () => dom.current.removeEventListener('click',handerClick)
    },[])
    return  <div ref={dom}  ><Component  {...props} /></div>
  }
}

@ClickHoc
class Index extends React.Component{
   render(){
     return <div  className='index'  >
       <p>hello，world</p>
       <button>组件内部点击</button>
    </div>
   }
}
export default ()=>{
  return <div className='box'  >
     <Index />
     <button>组件外部点击</button>
  </div>
}
```

##### 属性代理-添加额外生命周期

```js
function Hoc(Component){
  return class WrapComponent extends React.Component{
      constructor(){
        super()
        this.node = null
      }
      UNSAFE_componentWillReceiveProps(nextprops){
          if(nextprops.number !== this.props.number ){
            this.node.handerNumberChange  &&  this.node.handerNumberChange.call(this.node)
          }
      }
      render(){
        return <Component {...this.props} ref={(node) => this.node = node }  />
      }
  }
}
@Hoc
class Index extends React.Component{
  handerNumberChange(){
      /* 监听 number 改变 */
  }
  render(){
    return <div>hello,world</div>
  }
}
```


于属性代理HOC，我们可以：

强化props & 抽离state。
条件渲染，控制渲染，分片渲染，懒加载。
劫持事件和生命周期
ref控制组件实例
添加事件监听器，日志

对于反向代理的HOC,我们可以：

劫持渲染，操纵渲染树
控制/替换生命周期，直接获取组件状态，绑定事件。


