function Container({ children }) {
  const [showLoading, setShowLoading] = useState(false)
  const renderChildren = useMemo(() => typeof children === 'function' ? children({ setShowLoading }) : null, [children])
  return <div style={{ position: 'relative' }} >
    {renderChildren}
    {showLoading && <div className="mastBox" >
      {<SyncOutlined className="icon" spin twoToneColor="#52c41a" />}
    </div>}
  </div>
}

export default function Index() {
  const setLoading = useRef(null)
  return <div>
    <Container>
      {({ setShowLoading }) => {
        console.log('渲染')
        setLoading.current = setShowLoading
        return <div>
          <div className="index1" >
            <button onClick={() => setShowLoading(true)} >loading</button>
          </div>
        </div>
      }}
    </Container>
    <button onClick={() => setLoading.current && setLoading.current(false)} >取消 loading </button>
  </div>
}
