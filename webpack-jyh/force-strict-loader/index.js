var loaderUtils = require('loader-utils')
var SourceNode = require('source-map').SourceNode;
var SourceMapConsumer = require('source-map').SourceMapConsumer;
module.exports = function(content) {
    var useStrictPrefix = '\'use strict\';\n\n';
    if(this.cacheable) {
        this.cacheable();
    }
    // source-map
    // 在loader函数的参数中获取到sourceMap对象，这是由webpack或者上一个loader传递下来的，只有当它存在时我们的loader才能进行继续处理和向下传递
    var options = loaderUtils.getOptions(this) || {};
    if (options.sourceMap && sourceMap) {
        // 通过source-map这个库来对map进行操作，包括接受和消费之前的文件内容和source-map，对内容节点进行修改，最后产生新的source-map
        var currentRequest = loaderUtils.getCurrentRequest(this);
        var node = SourceNode.fromStringWithSourceMap(
            content,
            new SourceMapConsumer(sourceMap)
        );
        node.prepend(useStrictPrefix);
        var result = node.toStringWithSourceMap({file: currentRequest});
        // 函数返回的时候要用this.async获取callback函数（主要是为了一次性返回多个值）
        var callback = this.async();
        // callbcak函数的三个参数分别是：抛出的错误、处理后的源码、以及source-map
        callback(null, result.code, result.map.toJSON());
    }
    // 不支持source-map的情况
    return useStrictPrefix + content;
}
