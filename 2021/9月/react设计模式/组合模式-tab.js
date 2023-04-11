const Tab = ({ children, onChange }) => {
  const activeIndex = useRef(null)
  const [, forceUpdate] = useState({})
  /* 提供给 tab 使用  */
  const tabList = []
  /* 待渲染组件 */
  let renderChildren = null
  React.Children.forEach(children, (item) => {
    /* 验证是否是 <TabItem> 组件  */
    if (React.isValidElement(item) && item.type.displayName === 'tabItem') {
      const { props } = item
      const { name, label } = props
      const tabItem = {
        name,
        label,
        active: name === activeIndex.current,
        component: item
      }
      if (name === activeIndex.current) renderChildren = item
      tabList.push(tabItem)
    }
  })
  /* 第一次加载，或者 prop children 改变的情况 */
  if (!renderChildren && tabList.length > 0) {
    const firstChildren = tabList[0]
    renderChildren = firstChildren.component
    activeIndex.current = firstChildren.component.props.name
    firstChildren.active = true
  }

  /* 切换tab */
  const changeTab = (name) => {
    activeIndex.current = name
    forceUpdate({})
    onChange && onChange(name)
  }

  return <div>
    <div className="header"   >
      {
        tabList.map((tab, index) => (
          <div className="header_item" key={index} onClick={() => changeTab(tab.name)} >
            <div className={'text'}  >{tab.label}</div>
            {tab.active && <div className="active_bored" ></div>}
          </div>
        ))
      }
    </div>
    <div>{renderChildren}</div>
  </div>
}

Tab.displayName = 'tab'


const TabItem = ({ children }) => {
  return <div>{children}</div>
}
TabItem.displayName = 'tabItem'
