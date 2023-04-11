// this.callback(    
//   // 当无法转换原内容时，给 Webpack 返回一个 Error   
//   err: Error | null,    
//   // 原内容转换后的内容    
//   content: string | Buffer,    
//   // 用于把转换后的内容得出原内容的 Source Map，方便调试
//   sourceMap?: SourceMap,    
//   // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回,以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能 
//   abstractSyntaxTree?: AST
// );
const loaderUtils = require('loader-utils');

module.exports = function (source) {
  // 开始缓存
  this.cacheable && this.cacheable();
  // 关闭缓存
  this.cacheable(false);
  // 获取到用户给当前loader传入的options
  const options = loaderUtils.getOptions(this);
  console.log('options-->', options);
  // 在这里按照你的需求处理source
  // 通过 this.callback 告诉 Webpack 返回的结果
  this.callback(null, source.replace('word', ', I am Xiaolang'), sourceMaps);
  return;
}

// 同步异步
module.exports = function (source) {
  // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
  var callback = this.async()
  // someAsyncOperation 代表一些异步的方法
  someAsyncOperation(source, function (err, result, sourceMaps, ast) {
    // 通过 callback 返回异步执行后的结果
    callback(err, result, sourceMaps, ast)
  })
};

// 处理二进制数据
module.exports = function(source) {    
  // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的    
  source instanceof Buffer === true;    
  // Loader 返回的类型也可以是 Buffer 类型的    
  // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果    
  return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;

