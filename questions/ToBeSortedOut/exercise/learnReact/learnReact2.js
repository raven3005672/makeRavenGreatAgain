// 二、组件的类型与生命周期
// 挂载流程开始后，才会触发组件的生命周期，生成ReactElement类型的js对象，通过解析组件对象内部所携带的信息，获得对应的HTML信息，插入指定的DOM容器中，最终完成视图的渲染。
// 研究组件的生命周期，就是更深入的研究组件的挂载过程

// 组件的生命周期
// ReactDOM.render()方法根据传入的参数不同，在内部通过工厂方法生成四种不同类型的封装组件
// ReactEmptyComponent、ReactTextComponent、ReactDOMComponent、ReactCompositeComponent
// 在执行挂载流程时，通过执行每种封装组件内部的mountComponent方法触发生命周期，但生命周期只在React自定义组件中存在【ReactCompositeComponent】，其他三种组件不存在生命周期。

// 1.ReactEmptyComponent
// 通过ReactEmptyComponent.create()方法创建，该方法最终调用的是ReactDOMEmptyComponent方法
var ReactDOMEmptyComponent = function(instantiate) {
    this._currentElement = null;
    this._hostNode = null;
    this._hostParent = null;
    this._hostContainerInfo = null;
};
_assign(ReactDOMEmptyComponent.prototype, {
    mountComponent: function(transaction, hostParent, hostContainerInfo, context) {
        this._hostContainerInfo = hostContainerInfo;

        var nodeValue = ' react-empty: ' + this._domID + ' ';
        if (transaction.useCreateElement) {
            var ownerDocument = hostContainerInfo._ownerDocument;
            var node = ownerDocument.createComment(nodeValue);
            ReactDOMComponentTree.precacheNode(this, node);
            return DOMLazyTree(node);
        } else {
            return '<!--' + nodeValue + '-->';
        }
    },
    receiveComponent: function() {},
    getHostNode: function() {},
    unmountComponent: function() {}
});
module.exports = ReactDOMEmptyComponent;
// 因为组件为空，所以几乎所有参数设置为null，也无关生命周期，只有组件的挂载和写在。
// 在关键方法mountComponent中，最终返回的是形如<!-->的HTML，也就是空，因此插入真实DOM的也是空。

// 2.ReactTextComponent
// 通过ReactHostComponent.createInstanceForText()方法创建，我们直接看mountComponent
mountComponent = function(transaction, hostParent, hostContainerInfo, context) {
    var domID = hostContainerInfo._idCounter++;
    var openingValue = ' react-text: ' + domID + ' ';
    var closingValue = ' /react-text ';
    this._domID = domID;
    this._hostParent = hostParent;

    if (transaction.useCreateElement) {
        var ownerDocument = hostContainerInfo._ownerDocument;
        var openingComment = ownerDocument.createComment(openingValue);
        var closingComment = ownerDocument.createComment(closingValue);
        var lazyTree = DOMLazyTree(ownerDocument.createDocumentFragment());
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(openingComment));
        if (this._stringText) {
            DOMLazyTree.queueChild(lazyTree, DOMLazyTree(ownerDocument.createTextNode(this._stringText)));
        }
        DOMLazyTree.queueChild(lazyTree, DOMLazyTree(closingComment));
        ReactDOMComponentTree.precacheNode(this, openingComment);
        this._closingComment = closingComment;
        return lazyTree;
    } else {
        // escapeTextContentForBrowser方法内部对参数进行空格的校验处理，最终通过简单的' '+参数 方法将参数转化为字符串并返回
        var escapedText = escapeTextContentForBrowser(this._stringText);

        return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
    }
}

// 3.ReactDOMComponent
// 通过ReactHostComponent.createInternalComponent()方法创建
mountComponent = function(transaction, hostParent, hostContainerInfo, context) {
    this._rootNodeID = globalIdCounter++;
    this._domID = hostContainerInfo._idCounter++;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;

    var props = this._currentElement.props;

    // dom元素没有生命周期，ReactDOMComponent会对传入的div,span等标签通过switch进行识别和处理，除此之外流程与上述两类组件基本相同
    switch(this._tag) {
        case 'audio':
        case 'form':
        case 'iframe':
        case 'img':
        case 'link':
        case 'object':
        case 'source':
        case 'video':
        // ...
    }
    // ...
    div.innerHTML = '<' + type + '></' + type + '>';
    // ...
}

// 4.ReactCompositeComponent
// 通过ReactCompositeComponentWrapper()方法创建，最终调用ReactCompositeComponentMixin.mountComponent方法创建组件的HTML
// ReactCompositeComponent.js自行阅读源码
// 简要描述逻辑
mountComponent -> 处理props -> 根据render的有无, 判断是有状态组件还是无状态组件 -> 处理state
    -> 执行ComponentWillMount -> 执行render, 获得html -> 执行ComponentDidMount -> 对子组件重复上述流程