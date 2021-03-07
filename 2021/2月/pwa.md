App Manifest、service worker、Push api

PWA能做什么：
1.安装添加桌面图标
2.提供前端网络代理
3.利用cache api对response进行缓存
4.发送push通知

工作原理：service worker
通常遵循以下基本步骤来使用 service worker：
1.service worker URL 通过 serviceWorkerContainer.register() 来获取和注册。
2.如果注册成功，service worker 就在 ServiceWorkerGlobalScope 环境中运行； 这是一个特殊类型的 worker 上下文运行环境，与主运行线程（执行脚本）相独立，同时也没有访问 DOM 的能力。
3.service worker 现在可以处理事件了。

受 service worker 控制的页面打开后会尝试去安装 service worker。最先发送给 service worker 的事件是安装事件。
1.当 oninstall 事件的处理程序执行完毕后，可以认为 service worker 安装完成了。
2.下一步是激活。当 service worker 安装完成后，会接收到一个激活事件(activate event)。onactivate 主要用途是清理先前版本的service worker 脚本中使用的资源。
3.service worker 现在可以控制页面了，但仅是在 register() 成功后的打开的页面。

```js
navigator.serviceWorker.register(opts.url).then(function(registration) {
  console.log("Service worker successfully registered.");
})
```

主线程js封装如下

```js
/**
 * service worker sdk
 * 
 * @param {string} opts.url [required] sw文件地址
 * @param {function} opts.onReady [optional] sw注册成功
 * @param {function} opts.onBeforeInstallPrompt [optional] 未安装pwa事件触发
 * @param {function} opts.onClickInstallPrompt [optional] 点击安装确认弹窗
 * @param {function} opts.onInstalled [optional] pwa安装成功时触发
 * @param {function} opts.onNotificationPermission [optional] 点击通知授权确认弹窗
 *  
 */
export function SWSdk(opts) {
  /**
   * 初始化sw
   */
  /**
   * sw注册成功
   */
  /**
   * 未安装pwa事件触发
   */
  /**
   * pwa安装成功时触发
   */
  /**
   * 弹出安装确认弹窗
   */
  /**
   * 监听sw事件
   */
  /**
   * 触发sw事件
   */
  /**
   * 弹出通知授权确认弹窗
   */
  /**
   * 发送一条通知
   */
  /**
   * 缓存资源
   */
  /**
   * 删除缓存资源
   */
}
```

sw线程js封装如下

```js
/**
 * SW
 * 
 * @param {string} opts.CACHE_NAME [optional] 缓存命名空间，建议每个应用独立命名
 * @param {number} opts.tickTime [optional] 每个tick的时间间隔，单位ms，默认1000
 * @param {function} opts.onTick [optional] 每个时间间隔调用一次
 * @param {function} opts.onProxy [optional] 代理网络请求
 * @param {function} opts.onInstall [optional] 安装事件的回调
 * @param {function} opts.onActivate [optional] 激活事件的回调
 * @param {function} opts.onPush [optional] 收到服务端事件的回调
 * @param {function} opts.notificationOnClick [optional] 点击push通知的回调
 */
var SW = function (opts) {
  /**
   * 初始化sw
   */
  /**
   * 监听窗口事件
   */
  /**
   * 触发窗口事件
   */
  /**
   * 设置cache
   */
  /**
   * 获取cache
   */
  /**
   * 发送一条通知
   */
};
```

线程间通讯。主线程和service worker线程之间需要频繁的通信，因此需要封装比较友好的通信方法

主线程

```js
/**
 * 监听sw事件
 * 
 * @param {string} eventName [required] 事件名称
 * @param {function} handler [required] 处理函数
 */
this.on = function(eventName, handler) {
  this.eventListener.push({
    eventName: eventName,
    handler: handler
  })
};
/**
 * 触发sw事件
 * 
 * @param {string} eventName [required] 事件名称
 * @param {any} payload [optional] 传递的数据
 */
this.emit = function(eventName, payload) {
  const data = {
    eventName: eventName,
    payload: payload
  };
  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(data);
    } else {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        navigator.serviceWorker.controller.postMessage(data);
      });
    }
  } catch(err) {
    console.error(err);
  }
}
```

service worker线程

```js
/**
 * 监听窗口事件
 * 
 * @param {string} eventName [required] 事件名称
 * @param {function} handler [required] 处理函数
 */
this.on = function(eventName, handler) {
  this.eventListener.push({
    eventName: eventName,
    handler: handler
  })
};
/**
 * 触发窗口事件
 * 
 * @param {string} eventName [required] 事件名称
 * @param {any} payload [optional] 传递的数据
 */
this.emit = function(eventName, payload) {
  clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(function(matchClient) {
    matchClient.forEach(function(client) {
      client.postMessage({
        eventName: eventName,
        payload: payload
      });
    })
  });
};
```

本地存储。在service worker 线程中，我们无法使用cookie，localStorage和sessionStorage，我们只能使用cache api或者indexDB作为存储key-value数据的载体。

```js
/**
 * 设置cache
 * 
 * @param {string} key cache的key
 * @param {any} value cache的值
 */
this.setCache = function (key, value) {
  try {
    return caches.open(this.CACHE_NAME).then(function(cache) {
      return cache.put(key, new Response(value));
    })
  } catch (err) {
    const that = this;
    return new Promise(function(resolve) {
      if (!that.cacheStorage[that.CACHE_NAME]) {
        that.cacheStorage[that.CACHE_NAME] = {};
      }
      that.cacheStorage[that.CACHE_NAME][key] = value;
      resolve();
    })
  }
};
/**
 * 获取cache
 * 
 * @param {string} key cache的key
 */
this.getCache = function(key) {
  try {
    return caches.open(this.CACHE_NAME).then(function(cache) {
      return cache.match(key);
    }).then(function(response) {
      return response ? response.text() : '';
    })
  } catch (err) {
    const that = this;
    return new Promise(function(resolve) {
      resolve(new String(that.cacheStorage[that.CACHE_NAME][key]));
    })
  }
};
```

通知

主线程申请授权

```js
/**
 * 弹出通知授权确认弹窗
 */
this.requestNotificationPermission = function() {
  Notification.requestPermission().then((result) => {
    that.onNotificationPermission.bind(that)(result);
  });
};
```

service worker线程发送通知

```js
/**
 * 发送一条通知
 * 
 * @param {object} params [required]
 * @param {string} params.title [required] 标题
 * @param {string} params.desc [optional] 描述
 * @param {string} params.icon [optional] 图标
 * @param {any} params.data [optional] 传递参数
 * @param {string} params.url [optional] 点击跳转地址
 */
this.showNotification = function(params) {
  try {
    self.registration.showNotification(params.title, {
      body: params.desc,
      icon: params.icon,
      image: params.image,
      data: Object.assign({ url: params.url }, params.data)
    })
  } catch (err) {
    console.log(err);
  }
};
```

安装桌面快捷方式
未安装事件
弹出询问安装弹窗api

本地推送通知
询问授权通知api
发送通知

sw内埋点
fetch api
请求数据构造

拉活桌面pwa
需要安装google play服务
需要由不同域的页面发起重定向跳转
与pwa同域的链接均可拉活pwa，且pwa展示跳转链接，而非start_url中配置的链接
中转页策略

视频预加载
使用cache api

识别用户访问的是web页面还是桌面pwa
桌面入口拉活
链接拉活



manifest配置
参考https://web.dev/add-manifest/
```html
<link rel="manifest" href="/manifest.json">
```
配置文件示例:manifest.json
```json
{
    "name": "Sharee PWA",  // 用于安装横幅、启动画面显示
    "short_name": "Sharee PWA",  // 用于主屏幕显示
    // 浏览器会根据有效图标的 sizes 字段进行选择。首先寻找与显示密度相匹配并且尺寸调整到 48dp 屏幕密度的图标
    "icons": [
      {
        "src": "../logo/180.png",
        "sizes": "180x180",
        "type": "image/png"
      },
      {
        "src": "../logo/192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "../logo/512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "start_url": "/?from=homescreen",  // 启动网址，相对于manifest.json所在路径
    "scrope": "/", // sw的作用范围只能在此路径或子路径
    "display": "standalone",
    "theme_color": "#FFF",
    "background_color": "#FFF"  // 启动时的背景色
  }
```
```html
<!-- iOS不支持manifest配置，通过meta标签添加到head中 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="#fff">
  <meta name="apple-mobile-web-app-title" content="Sharee PWA">
  <link rel="apple-touch-icon" sizes="180x180" href="../logo/180.jpg">
  <meta name="msapplication-TileColor" content="#fff">
  <meta name="theme-color" content="#fff" />
```
  




