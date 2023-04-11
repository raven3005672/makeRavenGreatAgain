## 背景

- 功能复杂，逻辑复用问题
  - 提供者模式：context保存全局属性，Provider传递
  - 组合模式：外部Form表单验证，内部Form.Item收集数据
- 培养设计能力，编程能力
  - HOC设计，公共组件的设计，自定义hooks的设计

## 组合模式

**隐式混入**

```js
function Item (props){
  console.log(props) // {name: "《React进阶实践指南》", author: "alien"}
  return <div> 名称： {props.name} </div>
}

function Groups (props){
  const newChilren = React.cloneElement(props.children,{ author:'alien' })
  return  newChilren
}
```

**控制渲染**

```js
export default ()=>{
  return <Groups>
    <Item isShow name="《React进阶实践指南》" />
    <Item isShow={false} name="《Nodejs深度学习手册》" />
    <div>hello,world</div>
    { null }
  </Groups>
}

function Item (props){
  return <div> 名称： {props.name} </div>
}
Item.displayName = 'Item';

/* Groups 组件 */
function Groups (props){
  const newChildren = []
  React.Children.forEach(props.children,(item)=>{
    const { type, props } = item || {}
    if(isValidElement(item) && type === Item && item.displayName === 'Item' && props.isShow ){
        newChildren.push(item)
    }
  })
  return  newChildren
}
```

- 组合模式通过外层组件获取内层组件 children ，通过 cloneElement 传入新的状态，或者控制内层组件渲染。
- 组合模式还可以和其他组件组合，或者是 render props，拓展性很强，实现的功能强大。

## render props模式

- 容器组件作用是传递状态，执行 children 函数。
- 外层组件可以根据容器组件回传 props ，进行 props 组合传递给子组件。
- 外层组件可以使用容器组件回传状态。

## HOC模式

属性代理
```js
function Hoc (Component) {
  return class Wrap extends React.Component{
    // 强化操作
    state = {};
    render(){
      return <Component { ...this.props } { ...this.state } />
    }
  }
}
```

反向继承
```js
class Index extends React.Component{
  render(){
    return <div> hello,world  </div>
  }
}
function HOC(Component){
  return class wrapComponent extends Component{ /* 直接继承需要包装的组件 */

  }
}
export default HOC(Index) 
```

- 强化props & 抽离state。
- 条件渲染，控制渲染，分片渲染，懒加载。
- 劫持事件和生命周期。
- ref控制组件实例。
- 添加事件监听器，日志

## 提供者模式

```js
const ThemeContext = React.createContext();
```

## 类组件继承

