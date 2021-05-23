```js
import { Modal, Button } from "antd"
class MyModal extends React.Component {
  state = { on: false }

  toggle = () => {
    this.setState({
      on: !this.state.on
    })
  }

  renderButton = (props) => <Button {...props} onClick={this.toggle} />

  renderModal = ({ onOK, ...rest }) => (
    <Modal
      {...rest}
      visible={this.state.on}
      onOk={() => {
        onOK && onOK()
        this.toggle()
      }}
      onCancel={this.toggle}
    />
  )

  render() {
    return this.props.children({
      Button: this.renderButton,
      Modal: this.renderModal
    })
  }
}
```