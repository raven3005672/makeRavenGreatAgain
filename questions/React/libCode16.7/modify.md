# react性能优化的方向

<!-- zhuanlan.zhihu.com/p/74229420 -->

React渲染性能优化的三个方向：

* 减少计算的量：减少渲染的节点，或者降低组件渲染的复杂度。
* 利用缓存：如何避免重新渲染，利用函数式编程的memo方式来避免组件重新渲染。
* 精确重新计算的方位：绑定组件和状态关系，精确判断更新的‘时机’和‘范围’，只重新渲染‘脏’的组件，或者说降低渲染范围。

## 减少渲染的节点/降低渲染计算量(复杂度)

首先从计算的量上下功夫，减少节点渲染的数量或者降低渲染的计算量可以显著的提高组件渲染性能。

### 不要在渲染函数都进行不必要的计算

比如不要在渲染函数(render)中进行数组排序、数据转换、订阅事件、创建事件处理器等等。渲染函数中不应该防止太多副作用。

### 减少不必要的嵌套

一般不必要的节点嵌套都是滥用高阶组件/RenderProps导致的，有很多方式来代替，例如优先使用props、React Hooks。

### 虚拟列表

虚拟列表是常见的‘长列表’和‘复杂组件树’优化方式，它优化的本质就是减少渲染的节点。

虚拟列表只渲染当前视窗可见元素。

虚拟列表常用于以下组件场景：

* 无限滚动列表，grid，表格，下拉列表，spreadsheets
* 无限切换的日历或轮播图
* 大数据量或无限嵌套的树
* 聊天窗，数据流(feed)，时间轴

相关组件方案：react-virtualized、react-window

### 惰性渲染

惰性渲染的初衷本质上和虚拟列表一样，也就是说我们只在必要时才去渲染对应的节点。

举个典型的例子，我们常用Tab组件，我们没有必要一开始就将所有Tab的panel都渲染出来，而是等到该Tab被激活时才去惰性渲染。

还有很多场景都会用到惰性渲染，例如树形选择器，模态弹窗，下拉列表，折叠组件等等。

### 选择合适的样式方案

样式性能方面大概可可以总结为CSS > 大部分CSS-in-js > inline style

## 避免重新渲染

减少不必要的重新渲染也是React组件性能优化的重要方向，为了避免不必要的组件重新渲染，需要再做到两点：

1. 保证组件纯粹性。即控制组件的副作用，如果组件有副作用则无法安全的缓存渲染结果。
2. 通过shouldComponentUpdate生命周期来对比state和props，确定是否要重新渲染，对于函数组件可以使用React.memo包装。

另外这些措施也可以帮助你更容易地优化组件重新渲染

### 简化props

如果一个组件的props太复杂，一般意味着这个组件已经违背了‘单一职责’，首先应该尝试对组件进行拆解。复杂的props也会变得难以维护，比如会影响shallowCompare效率，还会让组件的变动变得难以预测和调试。

简化的props更容易理解，且可以提高组件缓存的命中率。

### 不变的事件处理器

避免使用箭头函数形式的事件处理器。假设ComplexComponent是一个复杂的PureComponent，这里使用箭头函数，其实每次渲染时都会创建一个新的事件处理器，这会导致ComplexComponent始终会被重新渲染。更好的方式是使用实例方法。

即使现在使用hooks，依然使用useCallback来包装事件处理器，尽量给下级组件暴露一个静态的函数。

```js
const handleClick = useCallback(() => {
    // ...
}, []);
return <ComplexComponent onClick={handleClick} otherProps={values} />;
```

设计更方便处理的Event Props。

```js
<List>
    {list.map(i => (
        <Item key={i.id} onClick={() => handleDelete(i.id)} value={i.value} />
    ))}
</List>
// 修改为
const handleDelete = useCallback((id: string) => {
    // ...
}, []);
return (
    <List>
        {list.map(i => (
            <Item key={i.id} id={i.id} onClick={handleDelete} value={i.value}/>
        ))}
    </List>
)
```

### 不可变数据

不可变数据可以让状态变得可预测，也让shouldComponentUpdate的‘浅比较’变得更可靠和高效。

相关的工具有Immutable.js、Immer、immutability-helper以及seamless-immutable。

### 简化state

不是所有状态都应该放在组件的state中，例如缓存数据。如果需要组件响应它的变动，或者需要渲染到视图中的数据才应该放到state中。这样可以避免不必要的数据变动导致组件重新渲染。

### 使用recompose精细化比对

尽管hooks出来后，recompose宣称不再更新了，但还是不影响我们使用recompose来控制shouldComponentUpdate方法，比如它提供了以下方法来精细控制应该比较哪些props

```js
// 相当于React.memo
pure()
// 自定义比较
shouldUpdate(test: (props: Object, nextProps: Object) => boolean): HigherOrderComponent
// 只比较指定key
onlyUpdateForKeys(propKeys: Array<string>): HigherOrderComponent
```

其实还可以再扩展一下，比如omitUpdateForKeys忽略比对某些key。

## 精细化渲染

所谓精细化渲染指的是只有一个数据来源导致组件重新渲染，比如说A只依赖于a数据，那么只有在a数据变动时才渲染A，其他状态变化不应该影响组件A。

Vue和Mobx宣称自己性能好的一部分原因是它们的‘响应式系统’，它允许我们定义一些‘响应式数据’，当这些响应数据变动时，依赖这些响应式数据的视图就会重新渲染。

### 响应式数据的精细化渲染

大部分情况下，响应式数据可以实现视图精细化的渲染，但它还是不能避免开发者写出低效的程序，本质上还是因为组件违背‘单一职责’。

### 不要滥用context

Context的用法和响应式数据正好相反，常见的滥用context API的例子大多是没有处理好‘状态的作用域问题’。

首先要理解Context API的更新特点，它是可以穿透React.memo或者shouldComponentUpdate的比对的，也就是说，一旦Context的value变动，所有依赖该Context的组件会全部forceUpdate。

这个和Mobx和Vue的响应式系统不同，Context API并不能细粒度地检测哪些组件依赖哪些状态，所以说上节提到的‘精细化渲染’组件模式，在Context这里就成为了‘反模式’。

总结一下使用Context API要遵循以下原则：

* 明确状态作用域，Context只放置必要的，关键的，被大多数组件所共享的状态。比较典型的是鉴权状态。
* 粗粒度的订阅Context

传递给Context的value最好做一下缓存：

```js
export function ThemeProvider(props) {
    const [theme, switchTheme] = useState(redTheme);
    const value = useMemo(() => ({theme, switchTheme}), [theme]);
    return <Context.Provider value={value}>{props.children}</Context.Provider>
}
```
