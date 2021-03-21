```js
// 已加载的chunk缓存
var installedChunks = {
  "main": 0
};
// ...
__webpack_require__.e = function requireEnsure(chunkId) {
  // promises 队列，等待多个异步 chunk 都加载完成才执行回调
  var promises = [];

  // JSONP chunk loading for javascript
  var installedChunkData = installedChunks[chunkId];
  // 0 代表已经 installed
  if(installedChunkData !== 0) { // 0 means "already installed".

    // a Promise means "currently loading".
    // 目标chunk正在加载，则将 promise push到 promises 数组
    if(installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      // setup Promise in chunk cache
      // 利用Promise去异步加载目标chunk
      var promise = new Promise(function(resolve, reject) {
        // 设置 installedChunks[chunkId]
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      // i设置chunk加载的三种状态并缓存在 installedChunks 中，防止chunk重复加载
      // nstalledChunks[chunkId]  = [resolve, reject, promise]
      promises.push(installedChunkData[2] = promise);
      // start chunk loading
      // 使用 JSONP
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      script.charset = 'utf-8';
      script.timeout = 120;

      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
      // 获取目标chunk的地址，__webpack_require__.p 表示设置的publicPath，默认为空串
      script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";
      // 请求超时的时候直接调用方法结束，时间为 120 s
      var timeout = setTimeout(function(){
        onScriptComplete({ type: 'timeout', target: script });
      }, 120000);
      script.onerror = script.onload = onScriptComplete;
      // 设置加载完成或者错误的回调
      function onScriptComplete(event) {
        // avoid mem leaks in IE.
        // 防止 IE 内存泄露
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        var chunk = installedChunks[chunkId];
        // 如果为 0 则表示已加载，主要逻辑看 webpackJsonpCallback 函数
        if(chunk !== 0) {
          if(chunk) {
            var errorType = event && (event.type === 'load' ? 'missing' : event.type);
            var realSrc = event && event.target && event.target.src;
            var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
            error.type = errorType;
            error.request = realSrc;
            chunk[1](error);
          }
          installedChunks[chunkId] = undefined;
        }
      };
      head.appendChild(script);
    }
  }
  return Promise.all(promises);
};
```