
const ThemeContext = React.createContext(null) // 创建一个 context 上下文 ,主题颜色Context

function ConsumerDemo() {
  return <div>
    <ThemeContext.Consumer>
      {
        (theme) => <div style={{ ...theme }} >
          <p>i am alien!</p>
          <p>let us learn React!</p>
        </div>
      }
    </ThemeContext.Consumer>
  </div>
}

class Index extends React.PureComponent {
  render() {
    return <div>
      <ConsumerDemo />
    </div>
  }
}

export default function ProviderDemo() {
  const [theme, setTheme] = useState({ color: 'pink', background: '#ccc' })
  return <div>
    <ThemeContext.Provider value={theme}  >
      <Index />
    </ThemeContext.Provider>
    <button onClick={() => setTheme({ color: 'blue', background: 'orange' })} >点击</button>
  </div>
}
