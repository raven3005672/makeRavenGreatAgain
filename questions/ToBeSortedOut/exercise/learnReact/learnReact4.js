// 四、事件系统
// 1.原生事件系统
// 我们通常监听真是DOM。举例来说，我们想监听按钮的点击事件，那么我们在按钮DOM上绑定事件和对应的回调函数即可。遗憾的是若页面复杂且事件处理频率高，那么对网页性能是个考验

// 2.React事件系统
// react的事件处理实现了SyntheticEvent层处理事件
// react并不像原生事件一样将事件和DOM一一对应，而是将所有的事件都绑定在网页的document，通过统一的事件监听器处理并分发，找到对应的回调函数并执行。
// 按照官方文档的说法，事件处理程序将传递SyntheticEvent的实例

// 3.SyntheticEvent
// (1)事件注册
<Component onClick={this.handleClick} />
// 在这个组件挂载的时候，react就已经开始通过mountComponent内部的_updateDOMProperties方法进行事件处理了。内部执行的是unqueuePutListener方法去注册事件：
function enqueuePutListener(inst, registrationName, listener, transaction) {
    var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
    // 找到真实DOM
    var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
    // 调用listen to注册
    listenTo(registrationName, doc);
    // 进入事务队列
    transaction.getReactMountReady().enqueue(putListener, {
        inst: inst,
        registrationName: registrationName,
        listener: listener
    });
}
// listenTo方法关键调用了两个函数：trapBubbledEvent & trapCapturedEvent，这两个函数是用来处理事件捕获和事件冒泡的
function capture(target, eventType, callback) {
    // 其中target也就是document
    if (target.addEventListener) {
        target.addEventListener(eventType, callback, false);
    }
    return {
        remove: function remove() {
            target.removeEventListener(eventType, callback, true);
        }
    }
}

// 2.事件存储
// 事件回调函数注册完毕后需要存储起来，以便触发时进行回调。存储的入口是EventPluginHub.putListener函数
// 所有回调函数都以二维数组的形式存储在listenerBank中，根据组件对应的key来进行管理
putListener = function (inst, registrationName, listener) {
    var key = getDictionaryKey(inst);
    var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[key] = listener;
}

// 3.事件分发
// 当事件触发时，react是如何进行事件分发和找到对应回调函数并执行的。分发入口在ReactDOMEventListener.js的handleTopLevelImpl
function handleTopLevelImpl(bookKeeping) {
    // 寻找事件触发的dom
    let targetInst = bookKeeping.targetInst;
    let ancestor = targetInst;
    // 在执行之前，先存储事件触发瞬间的dom结构，记为ancestors数组
    do {
        bookKeeping.ancestors.push(ancestor);
        const root = findRootContainerNode(ancestor);
        bookKeeping.ancestors.push(ancestor);
        ancestor = getClosestInstanceFromNode(root);
    } while (ancestor);

    // 依次遍历数组，并执行回调函数
    for (let i = 0; i < bookKeeping.ancestors.length; i++) {
        targetInst = bookKeeping.ancestors[i];
        _handleTopLevel(
            bookKeeping.topLevelType,
            targetInst,
            bookKeeping.nativeEvent,
            getEventTarget(bookKeeping.nativeEvent)
        );
    }
}
// 因为事件回调函数执行后可能导致DOM结构的变化，那么react先将当前的结构以数组的形式存储起来，依次遍历执行
handleTopLevel = function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = EventPluginHub.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    runEventQueueInBatch(events);
}
// EventPluginHub.extractEvents用于合成事件，根据事件类型的不同，合成不同的跨浏览器的SyntheticEvent对象的实例
ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
});
// 对于不同的事件，react将使用不同的功能插件，这些插件都是通过依赖注入的方式进入内部使用的。
// react合成事件的过程非常繁琐，但可以概括出extractEvents函数内部主要是通过switch函数区分事件类型并调用不同的插件进行处理从而生成SyntheticEvent实例

// 4.事件处理
// react处理事件的思想与处理setState的思想类型，都是采用批处理的方法。在上面handleTopLevel方法中我们看到最后执行了runEventQueueInBatch方法
// 事件进入队列
EventPluginHub.queueEvents(events);
// ...
EventPluginHub.processEventQueue(false);
processEventQueue = function(simulated) {
    var processingEventQueue = eventQueue;
    eventQueue = null;
    // ...
    forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
}
// 遍历队列中的事件，并进入executeDispatchesAndReleaseSimulated
event.constructor.release(event);
// 将react的合成事件release掉，减少内存开销
// executeDispatchesInOrder是处理事件的核心
var dispatchListeners = event._dispatchListeners;       // 事件回调函数
var dispatchInstances = event._dispatchInstances;       // 事件回调函数对应的组件
executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
function executeDispatch(event, simulated, listener, inst) {
    var type = event.type || 'unknown-event';
    ReactErrorUtils.invokeGuardedCallback(type, listener, event);
}
function invokeGuardedCallback(name, func, a) {
    func(a);        // func(a) ==> listener(event) ==> dispatchListeners(dispatchInstances)
}

// 4.总结
// 与原生事件不同的点，在于react对事件进行统一而不是分散的存储与管理，捕获事件后内部生成合成事件提高浏览器的兼容度，执行回调函数后再进行销毁释放内存，从而提高网页的响应性能





