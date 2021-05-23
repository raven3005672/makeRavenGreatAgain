useCallback

useContext

useEffect

useLayoutEffect

useMemo

useReducer

useRef

useState

## useState —— 数据存储，派发更新

会让整个function组件从头到尾执行一次，所以需要配合useMemo，useCallback等api配合使用。

```js
const a =1
const DemoState = (props) => {
  /* number为此时state读取值 ，setNumber为派发更新的函数 */
   let [number, setNumber] = useState(0) /* 0为初始值 */
   /*  useState 第一个参数如果是函数 则处理复杂的逻辑 ，返回值为初始值 */
   let [number, setNumber] = useState(()=>{
      // number
      return a===1 ? 1 : 2
   }) /* 1为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=>setNumber(number+1) } ></button>
   </div>)
}
```

## useEffect —— 组件更新副作用钩子

如果我们需要在组件初次渲染的时候请求数据，那么useEffect可以充当class组件中的 componentDidMount 。

但是特别注意的是，如果不给useEffect执行加入限定条件，函数组件每一次更新都会触发effect ,那么也就说明每一次state更新，或是props的更新都会触发useEffect执行，此时的effect又充当了componentDidUpdate和componentwillreceiveprops，

所以说合理的用于useEffect就要给effect加入限定执行的条件，也就是useEffect的第二个参数，这里说是限定条件，也可以说是上一次useEffect更新收集的某些记录数据变化的记忆，在新的一轮更新，useEffect会拿出之前的记忆值和当前值做对比，如果发生了变化就执行新的一轮useEffect的副作用函数，useEffect第二个参数是一个数组，用来收集多个限制条件 。

```js
/* 模拟数据交互 */
function getUserInfo(a){
    return new Promise((resolve)=>{
        setTimeout(()=>{
           resolve({
               name:a,
               age:16,
           })
        },500)
    })
}

const Demo = ({ a }) => {
    const [ userMessage , setUserMessage ] :any= useState({})
    const div= useRef()
    const [number, setNumber] = useState(0)
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
    useEffect(()=>{
        /* 请求数据 */
       getUserInfo(a).then(res=>{
           setUserMessage(res)
       })
       /* 操作dom  */
       console.log(div.current) /* div */
       /* 事件监听等 */
        window.addEventListener('resize', handleResize)
    /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
    },[ a ,number ])
    return (<div ref={div} >
        <span>{ userMessage.name }</span>
        <span>{ userMessage.age }</span>
        <div onClick={ ()=> setNumber(1) } >{ number }</div>
    </div>)
}
```

如果我们需要在组件销毁的阶段，做一些取消dom监听，清除定时器等操作，那么我们可以在useEffect函数第一个参数，结尾返回一个函数，用于清除这些副作用。相当与componentWillUnmount。

```js
const Demo = ({ a }) => {
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    useEffect(()=>{
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       /* 事件监听 */
       window.addEventListener('resize', handleResize)
       /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer)
           window.removeEventListener('resize', handleResize)
       }
    },[ a ])
    return (<div  >
    </div>)
}
```

### 异步async effect

useEffect不能直接用async await语法糖，需要进行一层包装

```js
const asyncEffect = (callback, deps) => {
  useEffect(() => {
    callback()
  }, deps)
}
```

## useLayoutEffect —— 渲染更新之前的useEffect

- useEffect执行顺序：组件更新挂载完成 -》 浏览器dom绘制完成 -》 执行useEffect回调
- useLayoutEffect执行顺序：组件更新挂载完成 -》 执行useLayoutEffect回调 -》 浏览器dom绘制完成

useLayoutEffect 代码可能会阻塞浏览器的绘制

如果我们在useEffect 重新请求数据，渲染视图过程中，肯定会造成画面闪动的效果,而如果用useLayoutEffect ，回调函数的代码就会阻塞浏览器绘制，所以可定会引起画面卡顿等效果，那么具体要用 useLayoutEffect 还是 useEffect ，要看实际项目的情况，大部分的情况 useEffect 都可以满足的。

```js
const DemoUseLayoutEffect = () => {
    const target = useRef()
    useLayoutEffect(() => {
        /*我们需要在dom绘制之前，移动dom到制定位置*/
        const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
        animate(target.current,{ x,y })
    }, []);
    return (
        <div >
            <span ref={ target } className="animate"></span>
        </div>
    )
}
```

## useRef —— 获取元素，缓存数据

有一个参数可以作为缓存数据的初始值，返回值可以被dom元素ref标记，可以获取被标记的元素节点。

```js
const DemoUseRef = () => {
  const dom = useRef(null)
  const handerSubmit = () => {
    /* <div>表单组件</div> dom 节点 */
    console.log(dom.current)
  }
  return <div>
    {/* ref标记当前dom节点 */}
    <div ref={dom}>表单组件</div>
    <button onClick={() => handerSubmit()}>提交</button>
  </div>
}
```

高阶用法，缓存数据

```js
const currentRef = useRef(initialData)
```

获取currentRef.current改变currentRef.current = newValue

useRef可以第一个参数可以用来初始化保存数据，这些数据可以再current属性上获取到，当然我们也可以通过对current赋值新的数据源。

```js
/* 这里用到的useRef没有一个是绑定在dom元素上的，都是做数据缓存用的 */
/* react-redux 用userRef 来缓存 merge之后的 props */
const lastChildProps = useRef()
//  lastWrapperProps 用 useRef 来存放组件真正的 props信息
const lastWrapperProps = useRef(wrapperProps)
//是否储存props是否处于正在更新状态
const renderIsScheduled = useRef(false)
```

```js
//获取包装的props
function captureWrapperProps(
  lastWrapperProps,
  lastChildProps,
  renderIsScheduled,
  wrapperProps,
  actualChildProps,
  childPropsFromStoreUpdate,
  notifyNestedSubs
) {
   //我们要捕获包装props和子props，以便稍后进行比较
  lastWrapperProps.current = wrapperProps  //子props
  lastChildProps.current = actualChildProps //经过  merge props 之后形成的 prop
  renderIsScheduled.current = false
}
```

## useContext —— 自由获取context

使用useContext来获取父级组件传递过来的context值，这个当前值就是最近的附近组件Provider设置的value值。

useContext参数一般是由createContext方式引入，也可以父级上下文context传递（参数为context）

useContext可以代替context.Consumer来获取Provider中保存的value值。

```js
/* 用useContext方式 */
const DemoContext = () => {
  const value: any = useContext(Context)
  /* my name is alien */
  return <div>my name is {value.name}</div>
}
/* 用Context.Consumer方式 */
const DemoContext1 = () => {
  return <Context.Consumer>
    {/* my name is alien */}
    {(value) => <div>my name is {value.name}</div>}
  </Context.Consumer>
}
export default () => {
  return <div>
    <Context.Provider value={{name: 'alien', age: 18}}>
      <DemoContext/>
      <DemoContext1/>
    </Context.Provider>
  </div>
}
```

## useReducer —— 无状态组件中的redux

useReducer 接受的第一个参数是一个函数，我们可以认为它就是一个reducer ,reducer的参数就是常规reducer里面的state和action,返回改变后的state, 
useReducer第二个参数为state的初始值 返回一个数组，数组的第一项就是更新之后state的值 ，第二个参数是派发更新的dispatch函数 。dispatch 的触发会触发组件的更新，这里能够促使组件从新的渲染的一个是useState派发更新函数，另一个就 useReducer中的dispatch

```js
const DemoUseReducer = ()=>{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1
           case 'reset':
             return payload
       }
       return state
   },0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name:'add' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name:'sub' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name:'reset' ,payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}
```

## useMemo —— 性能优化（无状态组件的shouldUpdate）

能形成独立的渲染空间，能够使组件，变量按照约定好规则更新。渲染条件依赖于第二个参数deps

```js
/* memo包裹的组件，就给该组件加了限制更新的条件，是否更新取决于memo第二个参数返回的boolean值， */
const DemoMemo = connect(state =>
    ({ goodList: state.goodList })
)(memo(({ goodList, dispatch, }) => {
    useEffect(() => {
        dispatch({
            name: 'goodList',
        })
    }, [])
    return <Select placeholder={'请选择'} style={{ width: 200, marginRight: 10 }} onChange={(value) => setSeivceId(value)} >
        {
            goodList.map((item, index) => <Option key={index + 'asd' + item.itemId} value={item.itemId} > {item.itemName} </Option>)
        }
    </Select>
    /* 判断之前的goodList 和新的goodList 是否相等，如果相等，
    则不更新此组件 这样就可以制定属于自己的渲染约定 ，让组件只有满足预定的下才重新渲染 */
}, (pre, next) => is(pre.goodList, next.goodList)))
```

```js
/* 用 useMemo包裹的list可以限定当且仅当list改变的时候才更新此list，这样就可以避免selectList重新循环 */
 {useMemo(() => (
      <div>{
          selectList.map((i, v) => (
              <span
                  className={style.listSpan}
                  key={v} >
                  {i.patentName}
              </span>
          ))}
      </div>
), [selectList])}
```

### useMemo可以减少不必要的循环，减少不必要的渲染

```js
useMemo(() => (
    <Modal
        width={'70%'}
        visible={listshow}
        footer={[
            <Button key="back" >取消</Button>,
            <Button
                key="submit"
                type="primary"
             >
                确定
            </Button>
        ]}
    >
     { /* 减少了PatentTable组件的渲染 */ }
        <PatentTable
            getList={getList}
            selectList={selectList}
            cacheSelectList={cacheSelectList}
            setCacheSelectList={setCacheSelectList} />
    </Modal>
 ), [listshow, cacheSelectList])
```

### useMemo可以减少子组件的渲染次数

```js
const DemoUseMemo=()=>{
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
    const newLog = useMemo(()=>{
        const log =()=>{
            console.log(6666)
        }
        return log
    },[])
    return <div onClick={()=>newLog()} ></div>
}
```

### useMemo让函数在某个依赖项改变的时候才运行，这可以避免很多不必要的开销

（这里要注意的是: 如果被useMemo包裹起来的上下文,形成一个独立的闭包，会缓存之前的state值,如果没有加相关的更新条件，是获取不到更新之后的state的值的，如下边）

```js
const DemoUseMemo=()=>{
    const [ number ,setNumber ] = useState(0)
    const newLog = useMemo(()=>{
        const log =()=>{
            /* 点击span之后 打印出来的number 不是实时更新的number值 */
            console.log(number)
        }
        return log
      /* [] 没有 number */
    },[])
    return <div>
        <div onClick={()=>newLog()} >打印</div>
        <span onClick={ ()=> setNumber( number + 1 )  } >增加</span>
    </div>
}
```

## useCallback —— useMemo版本的回调函数

useMemo和useCallback接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数，这个回调函数是经过处理后的也就是说父组件传递一个函数给子组件的时候，由于是无状态组件每一次都会重新生成新的props函数，这样就使得每一次传递给子组件的函数都发生了变化，这时候就会触发子组件的更新，这些更新是没有必要的，此时我们就可以通过usecallback来处理此函数，然后作为props传递给子组件

这里应该提醒的是，useCallback ，必须配合 react.memo pureComponent ，否则不但不会提升性能，还有可能降低性能

```js
/* 用react.memo */
const DemoChildren = React.memo((props)=>{
   /* 只有初始化的时候打印了 子组件更新 */
    console.log('子组件更新')
   useEffect(()=>{
       props.getInfo('子组件')
   },[])
   return <div>子组件</div>
})

const DemoUseCallback=({ id })=>{
    const [number, setNumber] = useState(1)
    /* 此时usecallback的第一参数 (sonName)=>{ console.log(sonName) }
     经过处理赋值给 getInfo */
    const getInfo  = useCallback((sonName)=>{
          console.log(sonName)
    },[id])
    return <div>
        {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
        <button onClick={ ()=>setNumber(number+1) } >增加</button>
        <DemoChildren getInfo={getInfo} />
    </div>
}
```









