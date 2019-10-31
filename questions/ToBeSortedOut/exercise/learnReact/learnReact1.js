// 一、组件的实现与挂载
// 1.组件是什么
import React, {Component} from 'react';

class A extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    render() {
        return <div>这是A组件</div>
    }
}
console.log(<A />);

// React
var React = {
    Component: ReactComponent,
    createElement: createElement,
    createClass: ReactClass.createClass,
};
module.exports = React;

// ReactComponent
function ReactComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
};
ReactComponent.prototype.setState = function() {
    // ...
}
ReactComponent.prototype.forceUpdate = function() {
    // ...
}
module.exports = ReactComponent;

// 2.组件的初始化
// babel编译A
var A = function(_Component) {
    _inherits(A, _Component);
    function A() {
        _classCallCheck(this, A);
        var _this = _possibleConstructorReturn(this, _Component.call(this));
        _this.state = {};
        return _this;
    }
    A.prototype.render = function() {
        return React.createElement('div', null);
    };
    return A;
}(Component);

// ReactElement 每一个组件对象都是通过React.createElement方法创建出来的ReactElement类型的对象
var ReactElement = function(type, key, ref, self, source, owner, props) {
    var element = {
        $$typeof: REACT_ELEMENT_TYPE,       // 组件的标识信息
        type: type,
        key: key,                           // DOM结构标识，提升update性能
        ref: ref,                           // 真实DOM的引用
        props: props,                       // 子结构相关信息(有则增加children字段/没有为空)和组件属性(如style)
        _owner: owner                       // _owner===ReatCurrentOwner.current(ReactCurrentOwner.js)值为创建当前组件的对象，默认值为null
    };
    return element;
};

// 3.组件的挂载
// ReactDOM.render实际调用了内部的ReactMount.render，进而执行ReactMount._renderSubtreeIntoContainer。
_renderSubtreeIntoContainer = function(parentComponent, nextElement, container, callback) {
    // 将当前组件添加到前一级的props属性下
    var nextWrappedElement = ReactElement(TopLevelWrapper, null, null, null, null, null, nextElement);
    // 调用getTopLevelWrapperInContainer方法判断当前容器下是否存在组件，记为prevComponent
    // 如果有即prevComponent为true，执行更新流程，即调用_updateRootComponent
    // 若不存在，则卸载，调用unmountComponentAtNode方法
    var prevComponent = getTopLevelWrapperInContainer(container);
    if (prevComponent) {
        var prevWrappedElement = prevComponent._currentElement;
        var prevElement = prevWrappedElement.props;
        // 组件更新机制在生命周期部分进行解析
        if (shouldUpdateReactComponent(prevElement, nextElement)) {
            var publicInst = prevComponent._renderedComponent.getPublicInstance();
            var updatedCallback = callback && function() {
                callback.call(publicInst);
            }
        };
        ReactMount._updateRootComponent(prevComponent, nextWrappedElement, nextContext, container, updatedCallback);
    } else {
        // 卸载
        ReactMount.unmountComponentAtNode(container);
    }
    // 无论更新还是卸载，最终都要挂载到真实的DOM上
    var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)._renderedComponent.getPublicInstance();
    // ...
}
// parentComponent 当前组件的父组件，第一次渲染时为null，
// nextElement 要插入DOM中的组件，如helloworld
// container 要插入的容器，如document.getElementById('root')
// callback 完成后的回调函数

// _renderNewRootComponent的源码
_renderNewRootComponent = function(nextElement, container, shouldReuseMarkup, context) {
    // instantiateReactComponent包装方法，后文贴代码
    var componentInstance = instantiateReactComponent(nextElement, false);
    // batchedMountComponentIntoNode以事务的形式调用mountComponentIntoNode，该方法返回组件对应的HTML，记为变量markup。
    // mountComponentIntoNode最终调用的是_mountImageIntoNode
    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);

    var wrapperID = componentInstance._instance.rootID;
    instancesByReactRootID[wrapperID] = componentInstance;

    return componentInstance;
}

// _mountImageIntoNode源码
_mountImageIntoNode = function(markup, container, instance, shouldReuseMarkup, transaction) {
    // ...其他代码
    // setInnerHTML是一个方法，将markup设置为container的innerHTML属性，这样就完成了DOM的插入
    setInnerHTML(container, markup);
    // precacheNode方法是将处理好的组件对象存储在缓存中，提高结构更新的速度
    ReactDOMComponentTree.precacheNode(instance, container.firstChild);
}

// instantiateReactComponent源码
function instantiateReactComponent(node, shouldHaveDebugID) {
    var instance;
    // 传入的node就是ReactDOM.render方法的组件参数
    if (node === null || node === false) {
        instance = ReactEmptyComponent.create(instantiateReactComponent);
    } else if (typeof node === 'object') {
        var element = node;
        if (typeof element.type === 'string') {
            instance = ReactHostComponent.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
            instance = new element.type(element);
        } else {
            instance = new ReactCompositeComponentWrapper(element);
        }
    } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent.createInstanceForText(node);
    }

    return instance;
}
// node类型                         实际参数                      结果
// null/false                         空              创建ReactEmptyComponent组件 
// object && type === string        虚拟DOM             创建ReactDomComponent组件
// object && type !== string       React组件          创建ReactCompositeComponet组件
// string/number                  字符串/数字            创建ReactTextComponent组件


// 梳理流程
// ·根据ReactDOM.render()传入不同的参数，React内部会创建四大类封装组件，记为componentInstance
// ·而后将其作为参数传入mountComponentIntoNode方法中，由此获得组件对应的HTML，记为markup（同时结构缓存）
// ·将真实的DOM的属性innerHTML设置为markup，即完成了DOM插入

// 在第一步封装成四大类型组件的过程中，赋予了封装组件mountComponet方法， 执行该方法会触发组件的生命周期，从而解析出HTML。
// 四大类组件最常用的就是ReactCompositeComponent组件，也就是常说的React组件，其内部具有完整的生命周期，也是React最关键的组件特性。
