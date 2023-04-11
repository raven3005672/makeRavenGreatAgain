function createHoc() {
  const renderQueue = [] /* 待渲染队列 */
  return function Hoc(Component) {

    function RenderController(props) {  /* RenderController 用于真正挂载原始组件  */
      const { renderNextComponent, ...otherprops } = props
      useEffect(() => {
        renderNextComponent() /* 通知执行下一个需要挂载的组件任务 */
      }, [])
      return <Component  {...otherprops} />
    }

    return class Wrap extends React.Component {
      constructor() {
        super()
        this.state = {
          isRender: false
        }
        const tryRender = () => {
          this.setState({
            isRender: true
          })
        }
        if (renderQueue.length === 0) this.isFirstRender = true
        renderQueue.push(tryRender)
      }
      isFirstRender = false      /* 是否是队列中的第一个挂载任务 */
      renderNextComponent = () => {  /* 从更新队列中，取出下一个任务，进行挂载 */
        if (renderQueue.length > 0) {
          console.log('挂载下一个组件')
          const nextRender = renderQueue.shift()
          nextRender()
        }
      }
      componentDidMount() {  /* 如果是第一个挂载任务，那么需要 */
        this.isFirstRender && this.renderNextComponent()
      }
      render() {
        const { isRender } = this.state
        return isRender ? <RenderController {...this.props} renderNextComponent={this.renderNextComponent} /> : <SyncOutlined spin />
      }
    }
  }
}

// 1. 首先通过 createHoc 来创建需要顺序加载的 hoc ，renderQueue 存放待渲染的队列。
// 2. Hoc 接收原始组件 Component。
// 3. RenderController 用于真正挂载原始组件，用 useEffect 通知执行下一个需要挂载的组件任务，在 hooks 原理的文章中，我讲过 useEffect 采用异步执行，也就是说明，是在渲染之后，浏览器绘制已经完成。
// 4. Wrap 组件包装了一层 RenderController，主要用于渲染更新任务，isFirstRender 证明是否是队列中的第一个挂载任务，如果是第一个挂载任务，那么需要在 componentDidMount 开始挂载第一个组件。
// 5. 每一个挂载任务本质上就是 tryRender 方法，里面调用了 setState 来渲染 RenderController。
// 6. 每一个挂载任务的函数 renderNextComponent 原理很简单，就是获取第一个更新任务，然后执行就可以了。
// 7. 还有一些细节没有处理，比如说继承静态属性，ref 转发等。

/* 创建 hoc  */
const loadingHoc = createHoc()

function CompA() {
  useEffect(() => {
    console.log('组件A挂载完成')
  }, [])
  return <div>组件 A </div>
}
function CompB() {
  useEffect(() => {
    console.log('组件B挂载完成')
  }, [])
  return <div>组件 B </div>
}
function CompC() {
  useEffect(() => {
    console.log('组件C挂载完成')
  }, [])
  return <div>组件 C </div>
}

function CompD() {
  useEffect(() => {
    console.log('组件D挂载完成')
  }, [])
  return <div>组件 D </div>
}
function CompE() {
  useEffect(() => {
    console.log('组件E挂载完成')
  }, [])
  return <div>组件 E </div>
}


const ComponentA = loadingHoc(CompA)
const ComponentB = loadingHoc(CompB)
const ComponentC = loadingHoc(CompC)
const ComponentD = loadingHoc(CompD)
const ComponentE = loadingHoc(CompE)

export default function Index() {
  const [isShow, setIsShow] = useState(false)
  return <div>
    <ComponentA />
    <ComponentB />
    <ComponentC />
    {isShow && <ComponentD />}
    {isShow && <ComponentE />}
    <button onClick={() => setIsShow(true)} > 挂载组件D ，E </button>
  </div>
}
