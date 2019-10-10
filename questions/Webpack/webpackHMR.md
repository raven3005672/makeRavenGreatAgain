<!-- 参考https://zhuanlan.zhihu.com/p/30669007 -->
# webpackHMR

* webpack可以将不同的模块打包成bundle文件或者几个chunk文件，但是当我通过webpackHMR进行开发的过程中，我并没有在我的dist目录中找到webpack打包好的文件，他们去哪了？
* 通过查看webpack-dev-server的package.json文件，我们知道其依赖于webpack-dev-middleware库，那么webpack-dev-middleware在HMR过程中扮演什么角色？
* 使用HMR的过程中，通过Chrome开发者工具我知道浏览器是通过websocket和webpack-dev-server进行通信的，但是websocket的message中并没有发现新模块代码。打包后的新模块又是通过什么方式发送到浏览器端的呢？
* 为什么新的模块不通过websocket随消息一起发送到浏览器端呢？
* 浏览器拿到最新的模块代码，HMR又是怎么将老的模块替换成新的模块，在替换的过程中怎样处理模块之间的依赖关系？
* 当模块的热替换过程中，如果替换模块失败，有什么回退机制么？

![Image text](https://pic1.zhimg.com/80/v2-f7139f8763b996ebfa28486e160f6378_hd.jpg)
参考图片webpackHMR的工作流程图

* 底部红色框内的是服务端，上部的橙色框是浏览器端。
* 绿色的方框是webpack代码控制的区域。蓝色方框是webpack-dev-server代码控制的区域，洋红色的方框是文件系统，文件修改后的变化就发生在这，而青色的方框是应用本身。

上图显示了我们修改代码到模块热更新完成的一个周期，通过深绿色的阿拉伯数字符号已经将HMR的整个过程标识了出来。

1. 在webpack的watch模式下，文件系统中某一个文件发生改变，webpack监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的javascript对象保存在内存中
2. webpack-dev-server和webpack之间的接口交互，而在这一部，主要是dev-server的中间件webpack-dev-middleware和webpack之间的交互，webpack-dev-middleware调用webpack暴露的API对代码变化进行监控，并且告诉webapck，将代码打包到内存中
3. webpack-dev-server对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase为true的时候，Server会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行live reload。注意，这是浏览器刷新，和HMR是两个概念
4. webpack-dev-server的工作，该步骤主要是通过sockjs（webpack-dev-server的依赖）在浏览器端和服务端之间建立一个websocket长连接，将webpack编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中server监听静态文件变化的信息。浏览器端根据这些socket信息进行不同的操作。当然服务端传递的最主要信息还是新模块的hash值，后面的步骤根据这一hash值来进行模块热替换。
5. webpack-dev-server/client端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了webpack，webpack/hot/dev-server的工作就是根据webpack-dev-server/client传给它的信息以及dev-server的配置决定是刷新浏览器还是进行模块热更新。如果仅仅是刷新浏览器，也就没有后面那些步骤了
6. HotModuleReplacement.runtime是客户端HMR的中枢，它接收到上一步传递给他的新模块的hash值，他通过JsonpMainTemplate.runtime向server端发送Ajax请求，服务端返回一个json，该json包含了所有要更新的模块的hash值，获取到更新列表后，该模块再次通过jsonp请求，获取到最新的模块代码，这就是上图中的7-8-9步骤
7. 第十步是决定HMR成功与否的关键步骤，在该步骤中，HotModulePlugin将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用
8. 最后一步，当HMR失败后，回退到live reload操作，也就是进行浏览器刷新来获取最新打包代码

运行webpack-HMR-demo项目
```
// hello.js
- const hello = () => 'hello world'
+ const hello = () => 'hello eleme'
```

## 第一步：webpack对文件系统进行watch打包到内存中

webpack-dev-middleware调用webpack的api对文件系统watch，当hello.js发生改变后，webpack重新对文件进行编译打包，然后保存到内存中。
```
// webpack-dev-middleware/lib/Shared.js
if (!options.lazy) {
    var watching = compiler.watch(options.watchOptions, share.handleCompilerCallback);
    context.watching = watching;
}
```

webpack没有将文件直接打包到output.path目录下。而是将bundle.js文件打包到了内存中，不生成文件的原因就在于访问内存中的代码比访问文件系统中的文件更快，而且也减少了代码写入文件的开销，这一切都归功于memory-fs，memory-fs是webpack-dev-middleware的一个依赖库，webpack-dev-middleware将webpack原本的outpuFileSystem替换成了MemoryFileSystem实例，这样代码就将输出到内存中。webpack-dev-middleware中该部分源码如下：
```
// webpack-dev-middleware/lib/Shared.js
var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem；
if (isMemoryFs) {
    fs = compiler.outputFileSystem;
} else {
    fs = compiler.outputFileSystem = new MemoryFIleSystem();
}
```

首先判断当前fileSystem是否已经是MemoryFileSystem的实例，如果不是，用MemoryFileSystem的实例替换compiler之前的outputFileSystem。这样bundle.js文件代码就作为一个简单javascript对象保存在了内存中，当浏览器请求bundle.js文件时，devServer就直接去内存中找到上面保存的javascript对象返回给浏览器端。

## 第二步：devServer通过浏览器端文件发生变化

在这一阶段，sockjs 是服务端和浏览器端之间的桥梁，在启动 devServer 的时候，sockjs 在服务端和浏览器端建立了一个 webSocket 长连接，以便将 webpack 编译和打包的各个阶段状态告知浏览器，最关键的步骤还是 webpack-dev-server 调用 webpack api 监听 compile的 done 事件，当compile 完成后，webpack-dev-server通过 _sendStatus 方法将编译打包后的新模块 hash 值发送到浏览器端。
```
// webpack-dev-server/lib/Server.js
compiler.plugin('done', (stats) => {
    // stats.hash 是最新打包文件的 hash 值
    this._sendStats(this.sockets, stats.toJson(clientStats));
    this._stats = stats;
});
...
Server.prototype._sendStats = function (sockets, stats, force) {
    if (!force && stats &&
    (!stats.errors || stats.errors.length === 0) && stats.assets &&
    stats.assets.every(asset => !asset.emitted)
    ) { return this.sockWrite(sockets, 'still-ok'); }
    // 调用 sockWrite 方法将 hash 值通过 websocket 发送到浏览器端
    this.sockWrite(sockets, 'hash', stats.hash);
    if (stats.errors.length > 0) {
        this.sockWrite(sockets, 'errors', stats.errors);
    } else if (stats.warnings.length > 0) {
        this.sockWrite(sockets, 'warnings', stats.warnings);
    } else {
        this.sockWrite(sockets, 'ok');
    }
};
```

## 第三步：webpack-dev-server/client接收到服务端信息做出响应

webpack-dev-server修改了webpack配置中的entry属性，在里面添加了webpack-dev-client的代码，这样在最后的bundle.js文件中就会有接收webpack消息的代码了。

webpack-dev-server/client当接收到type为hash消息后会将hash值暂存起来，当接收到type为ok的消息后对应用执行reload操作。

![Image text](https://pic3.zhimg.com/80/v2-90e0f2c5b41f5487014996f87098169e_hd.jpg)

在reload操作中，webpack-dev-server/client会根据hot配置决定是刷新浏览器还是对代码进行热更新(HMR)
```
// webpack-dev-server/client/index.js
hash: function msgHash(hash) {
    currentHash = hash;
},
ok: function msgOk() {
    // ...
    reloadApp();
},
// ...
function reloadApp() {
    // ...
    if (hot) {
        log.info('[WDS] App hot update...');
        const hotEmitter = require('webpack/hot/emitter');
        hotEmitter.emit('webpackHotUpdate', currentHash);
    // ...
    } else {
        log.info('[WDS] App updated. Reloading...');
        self.location.reload();
    }
}
```
首先将hash值暂存到currentHash变量，当接收到ok消息后，对App进行reload，如果配置了模块热更新，就调用webpack/hot/emitter将最新hash值发送给webpack，然后将控制权交给webpack客户端代码。如果没有配置模块热更新，就直接调用location.reload方法刷新页面。

## 第四步：webpack接收到最新的hash值验证并请求模块代码

在这一步，其实是 webpack 中三个模块（三个文件，后面英文名对应文件路径）之间配合的结果，首先是 webpack/hot/dev-server（以下简称 dev-server） 监听第三步 webpack-dev-server/client 发送的 webpackHotUpdate 消息，调用 webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）中的 check 方法，检测是否有新的更新，在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 hotDownloadUpdateChunk 和 hotDownloadManifest ， 第二个方法是调用 AJAX 向服务端请求是否有更新的文件，如果有将发更新的文件列表返回浏览器端，而第一个方法是通过 jsonp 请求最新的模块代码，然后将代码返回给 HMR runtime，HMR runtime 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新。

![Image text](https://pic1.zhimg.com/80/v2-0a0f350809a29ae8aed8d11ac4da6fb4_hd.jpg)

![Image text](https://pic1.zhimg.com/80/v2-3c9983d26d0a4b5e5cd91dd8ed6fa8ec_hd.jpg)

值得注意的是，两次请求的都是使用上一次的 hash 值拼接的请求文件名，hotDownloadManifest 方法返回的是最新的 hash 值，hotDownloadUpdateChunk 方法返回的就是最新 hash 值对应的代码块。然后将新的代码块返回给 HMR runtime，进行模块热更新。

还记得 HMR 的工作原理图解 中的问题 3 吗？为什么更新模块的代码不直接在第三步通过 websocket 发送到浏览器端，而是通过 jsonp 来获取呢？我的理解是，功能块的解耦，各个模块各司其职，dev-server/client 只负责消息的传递而不负责新模块的获取，而这些工作应该有 HMR runtime 来完成，HMR runtime 才应该是获取新代码的地方。再就是因为不使用 webpack-dev-server 的前提，使用 webpack-hot-middleware 和 webpack 配合也可以完成模块热更新流程，在使用 webpack-hot-middleware 中有件有意思的事，它没有使用 websocket，而是使用的 EventSource。综上所述，HMR 的工作流中，不应该把新模块代码放在 websocket 消息中。

## 第五步：HotModuleReplacement.runtime对模块进行热更新

这一步是整个模块热更新（HMR）的关键步骤，而且模块热更新都是发生在HMR runtime 中的 hotApply 方法中，这儿我不打算把 hotApply 方法整个源码贴出来了，因为这个方法包含 300 多行代码，我将只摘取关键代码片段。
```
// webpack/lib/HotModuleReplacement.runtime
function hotApply() {
    // ...
    var idx;
    var queue = outdatedModules.slice();
    while(queue.length > 0) {
        moduleId = queue.pop();
        module = installedModules[moduleId];
        // ...
        // remove module from cache
        delete installedModules[moduleId];
        // when disposing there is no need to call dispose handler
        delete outdatedDependencies[moduleId];
        // remove "parents" references from all children
        for(j = 0; j < module.children.length; j++) {
            var child = installedModules[module.children[j]];
            if(!child) continue;
            idx = child.parents.indexOf(moduleId);
            if(idx >= 0) {
                child.parents.splice(idx, 1);
            }
        }
    }
    // ...
    // insert new code
    for(moduleId in appliedUpdate) {
        if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
            modules[moduleId] = appliedUpdate[moduleId];
        }
    }
    // ...
}
```
从上面 hotApply 方法可以看出，模块热替换主要分三个阶段，第一个阶段是找出 outdatedModules 和 outdatedDependencies，这儿我没有贴这部分代码，有兴趣可以自己阅读源码。第二个阶段从缓存中删除过期的模块和依赖，如下：
```
delete installedModules[moduleId];
delete outdatedDependencies[moduleId];
```
第三个阶段是将新的模块添加到 modules 中，当下次调用 __webpack_require__ (webpack 重写的 require 方法)方法的时候，就是获取到了新的模块代码了。

模块热更新的错误处理，如果在热更新过程中出现错误，热更新将回退到刷新浏览器，这部分代码在 dev-server 代码中，简要代码如下：
```
module.hot.check(true).then(function(updatedModules) {
    if(!updatedModules) {
        return window.location.reload();
    }
    // ...
}).catch(function(err) {
    var status = module.hot.status();
    if(["abort", "fail"].indexOf(status) >= 0) {
        window.location.reload();
    }
});
```
dev-server 先验证是否有更新，没有代码更新的话，重载浏览器。如果在 hotApply 的过程中出现 abort 或者 fail 错误，也进行重载浏览器。

## 第六步：业务代码需要做些什么

当用新的模块代码替换老的模块后，但是我们的业务代码并不能知道代码已经发生变化，也就是说，当 hello.js 文件修改后，我们需要在 index.js 文件中调用 HMR 的 accept 方法，添加模块更新后的处理函数，及时将 hello 方法的返回值插入到页面中。代码如下：
```
// index.js
if(module.hot) {
    module.hot.accept('./hello.js', function() {
        div.innerHTML = hello()
    })
}
```
这样就是整个 HMR 的工作流程了。
