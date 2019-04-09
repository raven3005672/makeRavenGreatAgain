// 观察者模式中主体和观察者是相互感知的。
// 发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知。

// Subject (Fire Event) => Observer
// Observer (Subscribe) => Subject

// Publisher (Publish Event) => Event Channel
// Event Channel (Fire Event) => Subscriber
// Subscriber (Subscribe) => Event Channel

// 发布订阅模式是观察者模式的一种变体。发布订阅只是把一部分功能抽象成一个独立的ChangeNanager。

// 区别于适用场景
// 总的来说，发布-订阅模式适合更复杂的场景。
// 以下情况都在发布订阅的manager中处理。
// 在一对多的场景下，发布者的某次更新只想通知他的部分订阅者？
// 在多对一或者多对多的场景下，一个订阅者依赖于多个发布者，某个发布者更新后是否需要通知订阅者？还是等所有发布者都更新完毕再通知订阅者？


// https://juejin.im/post/5a14e9edf265da4312808d86
// 在观察者模式中，观察者是知道Subject的，Subject一直保持对观察者进行记录。然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信。
// 在发布订阅模式中，组件式松散耦合的，正好和观察者模式相反。
// 观察者模式大部分时候是同步的，比如当事件触发，Subject就回去调用观察者的方法。
// 而发布订阅模式大多数时候是异步的（使用消息队列）。
// 观察者模式需要在单个应用程序地址空间中实现，而发布-订阅更像交叉应用模式。

