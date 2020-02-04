# Progressive Web App

* PWA——基于Web策略
* RN，hybrid，native——基于Native策略

* Reliable：https
* Fast：离线缓存service worker
* Engaging：桌面图标manifest、推送通知push notification

## manifest

web app manifest是一个简单的json文件，他告诉浏览器您的Web应用程序以及在用户的移动设备或桌面上‘安装’时它应该如何表现。一般浏览器需要提供清单才能显示‘添加到主屏幕’提示。

```json
{
    "short_name": "Maps",
    "name": "Google Maps",
    "icons": [
        {
            "src": "/images/icons-192.png",
            "type": "image/png",
            "sizes": "192x192"
        },
        {
            "src": "/images/icons-512.png",
            "type": "image/png",
            "sizes": "512x512"
        }
    ],
    "start_url": "/maps/?source=pwa",
    "background_color": "#3367d6",
    "display": "standalone",
    "scope": "/maps/",
    "theme_color": "#3367d6"
}
```

manifest目前支持度不是特别好。

## Service Worker

Service Worker是浏览器在后台独立于网页运行的脚本。

* https页面（调试时host可以为localhost或者127.0.0.1）
* Worker线程独立于主线程，无window、dom对象
* 一旦被install，就永远存在，除非被手动unregister
* 可编程拦截代理请求和返回，缓存文件
* 有自己的生命周期，需在主线程注册

### Service Worker声明周期

* installing：Service Worker注册完成，触发install事件回调指定一些静态资源进行离线缓存
* installed：Service Worker完成安装，等待其他的Service Worker线程关闭
* activating：清除其他worker以及关联缓存的旧缓存资源，等待新Service Worker线程被激活
* activated：Service Worker激活，在这个状态会处理activate事件回调
* redundant：Service Worker的生命周期结束

### Service Worker线程与主线程

No Service Worker

                Register
                    |
                 Install
                    |
                /       \
        Activated       Error
            |
           Idle
            |
        /       \
Termidnated     Fetch/message

Has Service Worker

                 Update
                    |
                 Install
                    |
                /       \
         Waiting       Error
            |
         Activated
            |
           Idle
            |
        /       \
Termidnated     Fetch/message

### Service Worker跟Http缓存对比

- | HTTP | SW
- | - | -
文件预加载 | no | ok
离线处理 | no | ok
缓存和更新并存 | no | ok
精准自定义缓存 | no | ok

浏览器支持情况国内大概70%。

## Push Notification

国内push service缺失，前景不明朗，不做赘述。

## 使用

### Webpack插件

原生API很复杂且麻烦。建议使用插件。

* pwa相关：webpack-pwa-manifest
* sw相关：workbox-webpack-plugin、workbox-window

#### webpack-pwa-manifest

npm install webpack-pwa-manifest

HTML中增加manifest.json文件的引用

```html
<link rel="manifest" href="/manifest.v1.json?__WB_REVISION__==v1" />
```

webpack配置

```js
appConfig.plugins.push(new WebpackPwaManifest({
    name: 'xxxx',
    short_name: 'xxxx',
    description: 'xxxx',
    background_color: '#333',
    theme_color: '#333',
    start_url: 'https://touch.qxxxx.com/hotelindex?bd_source=m_hotel_pwa',
    filename: 'manifest.v1.json',
    publicPath: isDev ? `http://${process.env.DACE_HOST}:${devServerPort}/` : '/',
    icons: [
        {
            src: 'https://s.qxxxxzz.com/mobile_hotel_cn/img/q_hotel_icon.png',
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('icons')
        }
    ],
    ios: {
        'apple-mobile-web-app-title': 'xxxx',
        'apple-mobile-web-app-status-bar-style': '#000',
        'apple-mobile-web-app-capable': 'yes',
        'apply-touch-icon': 'https://s.qxxxxzz.com/mobile_hotel_cn/img/q_hotel_icon.png'
    }
}));
```

#### manifest调试

application - manifest

#### manifest生效条件

* manifest的必备字段无缺失
* service worker
* HTTPS
* 使用频率高，一般五分钟两次

#### Workbox

Google官方的PWA框架

主要功能：

* precaching——预缓存文件，借助webpack可自己生成，内容为prd下所有静态资源
* routing——将网络请求“路由”映射到不同的响应
* strategies——路由配置成功后，提供设置相应策略的方法

#### Workbox使用

npm install workbox-webpack-plugin

```js
const WorkboxPlugin = require('workbox-webpack-plugin');
appConfig.plugins.push(new WorkboxPlugin.InjectManifest({
    swSrc: path.resolve(appDirectory, 'sw.js'),
    swDest: 'sw.js'     // 输出Service Worker文件
}));
```

npm install workbox-window

```js
// js中注册
if('serviceWorker' in navigator) {
    const {Workbox} = await import('workbox-window');
    const wb = new Workbox('/sw.js');
    wb.register();
}
```

#### Workbox使用——Sw预缓存

如未特殊设置，webpack插件会帮我们生成默认预缓存文件(打包产物)，也可以自行在sw.js配置和添加

```js
// 自定义预缓存
const customPrecache = [{
    revision: 'v1',
    url: '//qreport.qxxxx.com/s2/js/qreport-lite.js'
}, {
    // ...
}, {
    revision: 'v1',
    url: '//s.qxxxxzz.com/mobile_hotel_cn/img/detail-no-img-big.png'
}];
workbox.precaching.precacheAndRoute(
    self.__precacheManifest ?
        self.__precacheManifest.filter(item => item.revision).concat(customPrecache) : customPrecache
)
```

#### Workbox使用-路由

```js
// 字符串方式
workbox.routing.registerRoute(
    '/logo.png',
    handler
)
// 正则表达式方式
workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    handler
)
// 回调函数方式
const matchFunction = ({url, event}) => {
    // 匹配成功返回true，可以返回一个对象作为handler的参数
    return false;
}
workbox.routing.registerRoute(
    matchFunction,
    handler
)
```

#### Workbox使用-策略

Stale While Revalidate
Cache First
Cache Only
Network First
Network Only
自定义

* Stale While Revalidate：一定情况下非常安全的策略，能保证用户最快速的拿到请求的结果。——有缓存就用缓存，请求结果存入缓存下次返回。

Page —1— ServiceWorker —2— Cache —3— Page
            |4
         NewWork —5— Cache

* Network First：对实时性要求比较高的数据请求，缓存只做兜底。——先请求，请求失败就返回缓存。

Page -1- ServiceWorker -2- NetWork
            |3
            Cache -4- Page

* Cache First：更新频率很低且实时性要求不高的文件。——缓存没有才请求网络。

Page -1- ServiceWorker -2- Cache
            |3
            Network -4- Page

* Cache Only：预缓存中包含的文件，且确保缓存成功。——只走缓存。

Page -1- ServiceWorker -2- Cache -3- Page

* Network Only：实时性要求特别高，且数据不容有误。——只走网络。

Page -1- ServiceWorker -2- Network -3- Page

```js
// 缓存优先 用于静态文件
workbox.routing.registerRoute(
    new RegExp('(.*).(jpg|webp|gif|png|woff)$'),
    new workbox.strategies.CacheFirst({
        cacheName: 'mhq-images',
        maxEntries: 100,
        maxAgeSeconds: 90 * 24 * 60 * 60
    })
);
// 缓存优先 用于城市、关键字接口
workbox.routing.registerRoute(
    new RegExp('/h-api/hotel/(hotelcity/en|wi/navigate)'),
    new workbox.strategies.CacheFirst({
        networkTimeoutSeconds: 500,
        cacheName: 'mhq-h-api-static',
        maxEntries: 10,
        maxAgeSeconds: 90 * 24 * 60 * 60
    })
)
// 自定义
workbox.routing.registerRoute(
    ({url, event}) => {
        return {
            name: 'world'
        };
    },
    ({url, event, params}) => {
        // 返回的结果是Hello world
        return new Response(
            `Hello ${params.name}`
        )
    }
);
// 无路由匹配策略
// 无匹配路由处理
const defaultStrategy = new workbox.strategies.NetworkOnly();
workbox.routing.setDefaultHandler((args) => {
    if (args.event.request.method === 'GET') {
        return defaultStrategy.handle(args);
    }
    return fetch(args.event.request);
});
```

错误拦截

```js
// 默认catch
workbox.routing.setCatchHandler((e) => {
    Response.error();
});
const FALLBACK_URL = '/offline?__WB_REVISION__=v2';
workbox.routing.setCatchHandler((e) => {
    Response.error();
    switch(e.event.request.destination) {
        case 'document':
            // 页面加载失败进入离线提醒页
            return caches.match(FALLBACK_URL).then(res => {
                return res;
            }).catch((err) => {
                console.log(err);
            });
            break;
        default:
            return Response.error();
    }
});
```

#### workbox调试模式

console输出执行日志

```js
// 设置为开发模式 生产模式改为false
workbox.setConfig({debug: false});
```
