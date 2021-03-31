## loader

```js
module.exports = function(source) {
  const content = doSomeThine2JsString(source);
  // 如果loader配置了options对象，那么this.query将指向options
  const options = this.query;
  // 可以用作解析其他模块路径的上下文
    console.log('this.context');
    
  /*
    * this.callback 参数：
    * error：Error | null，当 loader 出错时向外抛出一个 error
    * content：String | Buffer，经过 loader 编译后需要导出的内容
    * sourceMap：为方便调试生成的编译后内容的 source map
    * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
    */
  this.callback(null, content);
  // or return content;
}
```

## plugin

```js
// Tapable的简单使用
const { SyncHook } = require('tapable');

class Car {
  constructor() {
    // 在this.hooks中定义所有的钩子事件
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRotes: new AsyncParallelHook(["source", "target", "routesList"])
    };
  }

  /* ... */
}

const myCar = new Car();
// 通过调用tap方法即可增加一个消费者，订阅对应的钩子事件了
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
```