// 仅从redux设计层面解释
// redux设计参考flux模式，保存应用的历史状态，实现应用状态的可预测。

// 单一数据源：state
// state制度，redux并没有暴露出直接修改state的接口，必须通过action来触发修改
// 使用纯函数来修改state，reducer必须是纯函数

// reducer做了什么事
// currentState = currentReducer(currentState, action)
