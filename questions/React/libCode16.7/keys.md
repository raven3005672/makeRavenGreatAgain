# keys

<!-- https://zhuanlan.zhihu.com/p/65321621 -->

```js
class App extends React.Componet {
    constructor() {
        super();
        this.state = {
            divList: [
                {id: 'a1', text: '1'},
                {id: 'a2', text: '2'},
                {id: 'a3', text: '3'}
            ]
        }
    }
    render() {
        return (
            <div id="a1">
                <button onClick={() => {
                    this.setState({status: 2})
                }}>setState</button>
                {
                    this.state.divList.map((item, key) => {
                        return <div>{item.text}</div>
                    })
                }
            </div>
        )
    }
}
```

## React是什么时候验证我们的循环渲染组件没有添加keys

循环的map部分经过babel编译之后是这样的

```js
_createClass(App, [{
    key: 'render',
    value: function render() {
        var _this2 = this;
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("div", {
            id: "a1"
        }, __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("button", {
            onClick: function onClick() {
                _this2.setState({
                    status: 2
                });
            }
        }, "setState"), this.state.divList.map(function (item, key) {
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement("div", null, item.text);
        }));
    }
}])
```

在初次渲染的时候，会对App类的div进行实例，通过react.createElement对App类的div转为一个ReactDOM对象。在转换的时候，会对div的children也转化，当碰到map渲染的时候，那么div的其中一个children的类型就为数组了，那么在转换div的时候发现有其中一个children是一个数组，那么React就会对数组进行验证是否带有keys。

```js
function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
        return;
    }
    // 检查数组中的item是否有keys
    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            var child = node[i];
            if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
            }
        }
    } else if (isValidElement(node)) {
        // this element was passed in a valid location
        if (node._store) {
            node._store.validated = true;
        }
    } else if (node) {
        var iteratorFn = getIteratorFn(node);
        if (typeof iteratorFn === 'function') {
            // entry iterators used to provide implicit keys,
            // but now we print a separate warning for them later
            if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step = void 0;
                while(!(step = iterator.next()).done) {
                    if (isValidElement(step.value)) {
                        validateExplicitKey(step.value, parentType);
                    }
                }
            }
        }
    }
}
```

## React是如何利用Keys的

修改一下demo

```js
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            divList: [
                {id: 'a1', text: '1'},
                {id: 'a2', text: '2'},
                {id: 'a3', text: '3'}
            ]
        }
    }
    render() {
        return (
            <div id="a1">
                <button onClick={() => {
                    this.setState({
                        divList: [
                            {id: 'a2', text: 2},
                            {id: 'a1', text: 1},
                            {id: 'a3', text: 3}
                        ]
                    })
                }}>setState</button>
                {
                    this.state.divList.map((item, key) => {
                        return <div>
                            {item.text}:<input defaultValue="" />
                            </div>
                    })
                }
            </div>
        )
    }
}
```

在demo中我们先不为每个item添加key，填入数据并点击setState之后，顺序调转但input的内容并没有根据顺序变化而变化。如果我们为每个循环渲染的组件加上key，在进行顺序变化的后会发现input也会跟着顺序变化。

首先在beginWork的时候可以看到，因为当前处理的Fiber节点是一个数组，所以会当成Fragment来进行处理。通过断点，可以看到传入的组件位置已经根据state的不同进行了修改。此时当前数组的child还没有发生变化。

当前的workInProgress.child是key为a1的div。

React会对当前数组进行第一次循环，获取每个子节点的key值生成一个Set数据knownKeys。

```js
{
    // First, validate keys
    var knownKeys = null;
    for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys);
    }
    // Set(2) {'a2', 'a1'}
}
```

接着react会调用updateSlot函数，会对旧的数组的第一个子元素和新数组的第一个子元素传入进行对比。

```js
{
    // key是否相同
    if (newChild.key === key) {
        // 是否为多维数组
        if (newChild.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
        }
        // 更新组建
        return updateElement(returnFiber, oldFiber, newChild, expirationTime);
    } else {
        // 当前因为keys从a1变成了a2，所以会返回null
        return null
    }
}
```

接着react会调用mapRemainingChildren函数。

```js
function mapRemainingChildren(returnFiber, currentFirstChild) {
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    var existingChildren = new Map();
    var existingChild = currentFirstChild;
    while(existingChild !== null) {
        // 是否有key
        if (existingChild.key !== null) {
            existingChildren.set(existingChild.key, existingChild);
        } else {
            // 没有key的情况下，使用元素所在下标作为key
            existingChildren.set(existingChild.index, existingChild);
        }
        existingChild = existingChild.sibling;
    }
    return existingChildren;
    // Map(2) {'a1' => FiberNode, 'a2' => FiberNode}
}
```

从这里我们知道，其实就算我们不传入key，在更新的时候，React也会帮我们设置key到对应的元素中。

然后进入另外一个循环，这个循环会循环执行updateFromMap函数，分别会传入existingChildren（根据旧数组得出的Map数据），returnFiber，nexIdx，newChildren[newIdx]（新数组中，当前下标的子节点），expirationTime这些参数。

React会根据旧数据中当前循环的item和新数据的item进行对比，最终决定如何更新。

```js
function updateElement(returnFiber, current$$1, element, expirationTime) {
    // 新旧数据的元素类型是否一致
    if (current$$1 !== null && current$$1.elementType === element.type) {
        // 使用旧的Fiber，更新旧的fiber中的props和对应的数据
        var existing = useFiber(current$$1, element.props, expirationTime);
        existing.ref = coerceRef(returnFiber, current$$1, element);
        existing.return = returnFiber;
        {
            existing._debugSource = element._source;
            existing._debugOwner = element._owner;
        }
        return existing;
    } else {
        // Insert
        var created = createFiberFromElement(element, returnFIber.mode, expirationTime);
        created.ref = coerceRef(returnFiber, current$$1, element);
        created.return = returnFiber;
        return created;
    }
}
```

这样React就完成了对新旧数组的顺序替换，原先数组Fiber节点的child是key为a1的Fiber节点，a1的sibling节点时key为a2的节点。通过一系列的转换后，最后返回给数组Fiber节点的child是key为a2的Fiber节点，而key为a2的sibling节点是key为a1的Fiber节点。

同时因为key为a1和a2的Fiber所传入新的props并没有改变，所以在diff中，并不会对它们有任何的更新。

同时因为Fiber节点的位置互换，所以Fiber节点下的所有Fiber子节点（包括文字和input标签）都会自动替换位置。所以在最终渲染的时候，子节点会跟随戴欧key的父节点一起移动位置。

之前demo中提搞一个问题，就是当我们没有为数组中的子元素提供key属性时，修改顺序的时候，input并没有跟随父节点一起移动。

首先在进入到updateSlot函数的时候，因为新旧的子元素的key都等于null，因此React会把它当做是同一个节点，所以并不会对节点的位置进行改变，只会更新props到对应的Fiber节点中。因此在改变state的时候，文字从1变成了2，但是input因为没有任何改变，所以不做更新。因此才会出现input没有跟随父节点改变位置。因为从Fiber节点的角度来说，就没有改变过位置，只是因为传入的文字不一样，导致text的Fiber节点更新了内容，导致我们的一个错觉罢了。

## 总结

1. React就在渲染数组时如果子组件没有提供key，会默认将循环的index作为key来用作第一次渲染。
2. React的key的作用就是在setState的render阶段，对Fiber节点尽可能的重用。
3. 在渲染数组时，尽可能不要改变子节点的标签类型，例如原本是div尽可能不要改变其他标签，因为改变了标签类型，Fiber节点将需要重新生成，并不能起到复用的效果。
4. key只需要在当前数组中唯一即可，不需要担心全局的问题。
