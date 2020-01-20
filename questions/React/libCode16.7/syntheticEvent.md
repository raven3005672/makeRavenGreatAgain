# 合成事件SyntheticEvent

<!-- https://zhuanlan.zhihu.com/p/56531645 -->

## 合成事件的出现是为了解决什么问题

前端的优化问题，事件委派就是其中一个性能优化的方法。例如一个列表有1000个原生，每一个元素都需要绑定点击事件，那么就需要绑定1000个事件，这样对性能和内存都是非常大的开销。那么解决方式就是通过事件委派的方式，将事件都绑定在他们共同的父级元素上，由事件冒泡到父级元素去触发事件，并在父级元素触发事件的时候去确认触发事件的原始元素是什么，从而执行不同的行为。其实合成事件也是如此。

合成事件会将所有我们在jsx中编写的事件进行拦截，并进行一些封装变成一个React的事件，最终只会绑定一个事件到document元素中，通过事件冒泡的方式传递到绑定的document的统一事件进行分发。

1. JSX的事件如何绑定到React的事件系统
2. 合成事件如何触发

```js
class App extends React.Componet {
    constructor() {
        super();
        this.state = {
            data: 1
        }
    }
    render() {
        console.log('---render App--');
        return (
            <div>
                <p>text</p>
                <button onClick={() => {this.setState({data: 2})}}>setState</button>
            </div>
        )
    }
}
ReactDOM.render(
    <App/>,
    document.getElementById('root')
)
```

### JSX的事件如何绑定到React的事件系统

在一开始我们就知道React会将组件的onClick这一类的事件都绑定在了document上，但是是什么时候进行查询这一些对应的事件参数并将他们绑定到document上的呢。

从代码我们追寻到合成事件的绑定是从completeWork函数中开始的。在completeWork中有执行一个函数finalizeInitialChildren，在finalizeInitialChildren中会执行一些函数。重点是从setInitialDOMProperties函数开始一步一步进行绑定，下面列出一些比较重要的函数以及做了什么。

1. setInitialDOMProperties：循环当前组件的props属性，根据循环到的props属性进行不同的操作（dangerouslySetInnerHTML，children，style等等）。在循环的最后判断当前属性是不是一个事件。
2. ensureListeningTo：如果判断到props中的属性是一个合法事件，就会进入ensureListeningTo函数中，ensureListeningTo函数的作用就是找到document对象。
3. listenTo：检查document中是否有绑定过同类事件，如果没有将会进入trapBubbledEvent函数进行绑定，否则跳过。

```js
function listenTo(registrationName, mountAt) {
    var isListening = getListeningForDocument(mountAt);
    var dependencies = registrationNameDependencies[registrationName];
    for (var i = 0; i < dependencies.length; i++) {
        var dependency = dependencies[i];
        if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
            switch (dependency) {
                // ...
            }
            isListening[dependency] = true;
        }
    }
}
```

isListening就是当前document没有生成过绑定事件的记录对象，如果没有将会创建一个。并且会将绑定过的事件都存在alreadyListeningTo的一个全局对象中。

```js
var alreadyListeningTo = {};
var reactTopListenersCounter = 0;
var topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2);
function getListeningForDocument(mountAt) {
    if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
        mountAt[topListenersIDKey] = reactTopListenersCounter++;
        alreadyListeningTo[mountAt[topListenersIDKey]] = {};
    }
    return alreadyListeningTo[mountAt[tpoListenersIDKey]];
}
```

最后绑定完成之后就会将对应的事件的值改为true，防止重复绑定。

4. trapBubbledEvent：提取dispatchEvent函数，将document、dispatchEvent和事件名称传入addEventBubbleListener进行绑定事件。

需要注意的是，绑定事件之前会通过isInteractiveTopLevelEventType函数检测当前事件类型是否是React支持的事件类型，如果当前的事件并不是React配置中所处理的事件，那么将会直接绑定dispatchEvent，否则绑定的将会是dispatchInteractiveEvent。区别在于dispatchEvent不会异步setState，而dispatchInteractiveEvent会异步setState。

5. addEventBubbleListener：绑定事件到document中。listener就是dispatchEvent。

```js
export function addEventBubbleListener(
    element: Document | Element,
    eventType: string,
    listener: Function,
): void {
    element.addEventListener(eventType, listener, false);
}
```

到这里就是组件初始化的时候绑定每个组件中的事件到document中。当然我们现在用的button元素，如果我们使用其他元素，例如select、input之类的，那么将会有不一样的绑定方式，具体可以去看看listenTo函数。

但是我们发现整个绑定事件中，并没有把事件的回调函数保存起来，只是单单把所有用到的事件类型都绑定到document中，并且所有事件的触发都会调用dispatchEvent函数。

### 合成事件触发流程

在我们渲染的button元素上，绑定了onClick属性。在渲染的时候将对应的时间绑定到了document元素上，醉了一个事件委派。但是并没有将回调函数帮顶上去，而是仅仅将触发的事件类型和dispatchEvent绑定得到了document元素上而已。接下来看看dispatchEvent是怎么帮我们找到对应的事件回调函数的。

#### dispatchEvent/dispatchInteractiveEvent

在点击的时候会触发dispatchEvent或者dispatchInteractiveEvent这个函数，如果执行的是dispatchInteractiveEvent会额外调用多个函数：

* dispatchInteractiveEvent
* interactiveUpdates
* interactiveUpdates$1

之后执行

* dispatchEvent
* getEventTarget：获取事件源对象
* getClosestInstanceFromNode：寻找当前元素的Fiber节点
* getTopLevelCallbackBookKeeping：组装了一个bookKeeping变量（包含事件类型，顶级元素document，事件源对象Fiber节点）
* batchedUpdates：批处理更新

#### getClosestInstanceFromNode

getClosestInstanceFromNode函数中不得不提的就是查找事件源对象的Fiber节点时如何实现的。在react开始执行的时候，会注册两个变量。

```js
var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = '__reactInternalInstance$' + randomKey;
var internalEventhandlersKey = '__reactEventHandlers$' + randomKey;
```

而在React的commit阶段的时候，会在元素对象上添加两个属性，分别是__reactInternalInstance$<id>和__reactEventHandlers$<id>两个属性

__reactInternalInstance$<id>设置时机

* completeWork
* createInstance/createTextInstance
* precacheFiberNode

__reactEventHandlers$<id>设置时机

* completeWork
* createInstance/createTextInstance
* updateFIberProps

在batchedUpdates函数中最终执行了batchedUpdates$1函数。在scheduleWork函数中会调用requestWork。而requestWork相当重要，是决定setState是否异步的一个函数，其中判断是否异步就是用过React内部的一个全局变量isBatchingUpdates是否为true。

batchedUpdates$1函数内就是将isBatchingUpdates设置为true了。如果这次setState并不经过dispatchEvent的话，将不会吧isBatchingUpdates设置为true。

修改完isBatchingUpdates后会把之前生成的bookKeeping对象传入handleTopLevel函数中，继续下一步的操作。

* handleTopLevel
* runExtractedEventsInBatch
* extractEvents：extractEvents是一个全局函数
* extractEvents：是基于以下几个事件类（ChangeEventPlugin，EnterLeaveEventPlugin，SelectEventPlugin，SimpleEventPlugin）中的extractEvents函数
* getPooledEvent：基于事件的类型实例化一个event对象

在当前DEMO中，使用的事件类是SimpleEventPlugin，在getPooledEvent函数中，使用的类时SyntheticMouseEvent实例化一个event对象。

然后将event对象传入accumulateTwoPhaseDispatches函数中，进入下一个调用栈。

* accumulateTwoPhaseDispathes
* forEachAccumulated
* accumulateTwoPhaseDispatchesSingle
* traverseTwoPhase：会检查你的组件当中是否存在捕获阶段触发的事件
* accumulateDirectionalDispatches
* getListener：获取当前Fiber节点传入的props中，是否存在事件（根据在traverseTwoPhase函数中检查是捕获阶段还是冒泡阶段的不一样，获取的事件字段也会不同）

经过上面的调用流程，将会获取到listener事件。listener事件其实就是当前Fiber节点中对应现在触发的事件名称的props属性，因为现在DEMO使用的onClick事件，那么将会获取当前button组件的onClick的回调函数，如果父级组件也有onClick事件，那么也会获取得到。最终会将listener赋值到event对象中的_dispatchListeners和_dispatchInstances。

```js
function accumulateDirectionalDispatches(inst, phase, event) {
    {
        !inst ? warningWithoutStack$1(false, 'Dispatching inst must not be null') : boid 0;
    }
    var listener = listenerAtPhase(inst, event, phase);
    if (listener) {
        event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
        event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
}
```

如果父级组件都有同样的事件回调函数，那么返回的将会是一个数组，否则将会是一个对象。【说明React会将源对象对应的Fiber节点以及该节点的父级所有的同样事件名的函数都提取出来。】

调用栈将会回到runExtractedEventsInBatch函数中，这个时候已经获取到events对象

```js
function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = extractEvents(topLevelType, targetInst, nativeEvent, natvieEventTarget);
    runEventsInBatch(events);
}
```

* runEventsInBatch
* forEachAccumulated
* executeDispatchesAndReleaseTopLevel
* executeDispatchesAndRelease
* executeDispatchesInOrder：判断到传入event的_dispatchListeners如果是数组将会循环执行executeDispatch，否则直接调用executeDispatch传入event、_dispatchListeners和_dispatchInstances。
* executeDispatch
* invokeGuardedCallbackAndCatchFirstError
* invokeGuardedCallback
* invokeGuardedCallbackDev

在invokeGuardedCallbackDev就是触发事件callback的重点了，里面传入了几个重要参数：

* name：事件名称
* func：回调函数
* context：上下文对象
* event：合成的event对象

1. 首先创建了一个react元素

```js
var fakeNode = document.createElement('react');
```

2. 创建一个事件对象

```js
var evt = document.createEvent('Event');
```

3. 声明了一个callCallback函数

```js
function callCallback() {
    // 解绑事件
    fakeNode.removeEventListener(evtType, callCallback, false);
    // 触发func回调函数
    func.apply(context, funcArgs);
}
```

4. 绑定事件

```js
fakeNode.addEventListener(evtType, callCallback, false);
```

5. 初始化事件并触发该事件

```js
evt.initEvent(evtType, false, false);
fakeNode.dispatchEvent(evt);
```

6. 进入绑定事件的callCallback函数
7. 解绑事件

```js
fakeNode.removeEventListener(evtType, callCallback, false);
```

8. 触发func，传入的funcArgs包含event对象

```js
func.apply(context, funcArgs);
```

9. 进入到onClick中的回调函数，就是DEMO中的setState

以为通过合成事件触发，所以会在合成事件中修改isBatchingUpdates为true，所以setState会是异步。

最后回到interactiveUpdates$1函数中，performSyncWork函数进行渲染。经过setState后，对应的App的Fiber节点的updateQueue对象中，存在了新的state属性，然后进调用栈：

* performSyncWork
* performWork
* performWorkOnRoot
* renderRoot
* workLoop
* performUnitOfWork
* beginWork
* updateClassComponent
* ......

基本上整个合成事件从调用performSyncWork后，其实就结束了，剩下就是交由react渲染去判断是否有更新的事件队列存在，从而判断后续执行怎样的操作了。

## 总结

* 组件中声明的事件并不会保存起来，而仅仅是将事件类型以及dispatchEvent/dispatchInteractiveEvent函数绑定到document元素上，实现事件委派。
* 在触发阶段，通过事件的触发dispatchEvent/dispatchInteractiveEvent（前者不会异步setState），找到事件源对象上的对应事件的回调函数，并组合成一个“react-事件名”的自定义事件，通过创建一个react元素，通过element.dispatchEvent函数自主触发事件。
* 触发阶段，如果父级元素绑定了同样事件名的函数，那么会冒泡一层一层触发。
