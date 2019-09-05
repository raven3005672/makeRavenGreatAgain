// https://lz5z.com/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-%E9%A6%96%E5%B1%8F%E5%92%8C%E7%99%BD%E5%B1%8F%E6%97%B6%E9%97%B4/
// 白屏时间是指浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间。
// 首屏时间是指浏览器从响应用户输入网络地址，到首屏内容渲染完成的时间。

// 白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素
// 首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成

// 影响白屏时间的因素：网络，服务端性能，前端页面结构设计
// 影响首屏时间的因素：白屏时间，资源下载执行时间

// devtools => performance => start profiling and reload page

// 白屏时间
// 通常认为浏览器开始渲染body或者解析完head的时间是白屏结束的时间点。
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <title>白屏</title>
//     <script>
//         // 不兼容 performance.timing 的浏览器
//         window.pageStartTime = Date.now()
//     </script>
//         <!-- 页面 CSS 资源 -->
//         <link rel="stylesheet" href="xx.css">
//         <link rel="stylesheet" href="zz.css">
//         <script>
//             // 白屏结束时间
//             window.firstPaint = Date.now()
//             // 白屏时间
//             console.log(firstPaint - performance.timing.navigationStart)
//         </script>
// </head>
// <body>
//     <h1>Hello World</h1>
// </body>
// </html>
whitePageTime = firstPaint - performance.timing.navigationStart || pageStartTime

// 首屏时间
// 首屏中的图片加载完成，即是首屏完成
// 计算首屏时间常用的方法有：
// 1.首屏模块标签标记法
// 由于浏览器解析HTML是按照顺序解析的，当解析到某个元素的时候，你觉得首屏完成了，就在此元素后面加入script计算首屏完成时间
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <title>首屏</title>
//     <script>
//         // 不兼容 performance.timing 的浏览器
//         window.pageStartTime = Date.now()
//     </script>
// </head>
// <body>
//     <!-- 首屏可见内容 -->
//     <div class=""></div>
//     <!-- 首屏可见内容 -->
//     <div class=""></div>
//     <script type="text/javascript">
//             // 首屏屏结束时间
//             window.firstPaint = Date.now()
//             // 首屏时间
//             console.log(firstPaint - performance.timing.navigationStart)
//     </script>
//     <!-- 首屏不可见内容 -->
//     <div class=""></div>
//     <!-- 首屏不可见内容 -->
//     <div class=""></div>
// </body>
// </html>
// 2.统计首屏内加载最慢的图片/iframe
// 通常首屏内容中加载最慢的就是图片或者iframe资源，因此可以理解为当图片或者iframe都加载出来了，首屏肯定已经完成了。
// 由于浏览器对每个页面的TCP链接数有限制，使得并不是所有图片都能立刻开始下载和显示。我们只需要监听首屏内所有的图片和onload时间，获取图片onload时间最大值，并用这个最大值减去navigationStart即可获得近似的首屏时间。
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="utf-8">
//     <title>首屏</title>
//     <script>
//         // 不兼容 performance.timing 的浏览器
//         window.pageStartTime = Date.now()
//     </script>
// </head>
// <body>
//     <img src="https://lz5z.com/assets/img/google_atf.png" alt="img" onload="load()">
//     <img src="https://lz5z.com/assets/img/css3_gpu_speedup.png" alt="img" onload="load()">
//     <script>
//         function load () {
//             window.firstScreen = Date.now()
//         }
//         window.onload = function () {
//             // 首屏时间
//             console.log(window.firstScreen - performance.timing.navigationStart)
//         }
//     </script>
// </body>
// </html>

// Performance API
// Performance接口可以获取到当前页面与性能相关的信息

// 1.Performance.timing
// 此处有图
// 左边红线代表的是网络传输层面的过程，右边红线代表了服务器传输回字节后浏览器的各种事件状态，这个阶段包含了浏览器对文档的解析，DOM树构建，布局，绘制等等。
navigationStart // 表示从上一个文档卸载结束时的unix时间戳，如果没有上一个文档，这个值将和fetchStart相等。
unloadEventStart    // 表示前一个网页（与当前网页同域）unload的时间戳，如果无前一个网页unload或者前一个网页与当前页面不同域，则值为0
unloadEventEnd  // 返回前一个页面unload时间绑定的回调函数执行完毕的时间戳
redirectStart   // 第一个http重定向发生时的时间，有跳转且是同域名内的重定向才算，否则值为0
redirectEnd     // 最后一个http重定向完成时的时间，有跳转且是同域名内部的重定向才算，否则值为0
fetchStart      // 浏览器准备好使用HTTP请求抓取文档的时间，这发生在检查本地缓存之前
domainLookupStart/domainLookupEnd   // DNS域名查询开始/结束的时间，如果使用了本地缓存（即无DNS查询）或持久连接，则与fetchStart值相等
connectStart    // http(tcp)开始/重新建立链接的时间，如果是持久连接，则与fetchStart值相等
connectEnd      // http(tcp)完成建立链接的时间（完成握手），如果是持久连接，则与fetchStart值相等
secureConnectionStart   // https链接开始的时间，如果不是安全连接，则值为0
requestStart        // http请求读取真实文档开始的时间（完成建立连接），包括从本地读取缓存
responseStart       // http开始接收响应的时间（获取到第一个字节），包括从本地读取缓存
responseEnd         // http响应全部接收完成的时间（获取到最后一个字节），包括从本地读取缓存
domLoading          // 开始解析渲染DOM树的时间，此时Document.readyState变为loading，并将抛出readystatechange相关事件
domInteractive      // 完成解析DOM树的时间，document.readyState变为interactive，并将抛出readystatechange相关事件，注意只是DOM树解析完成，这时候并没有开始加载网页内的资源
domContentLoadedEventStart  // DOM解析完成后，网页内资源加载开始的时间，在DOMContentLoaded事件抛出前发生
domContentLoadedEventEnd    // DOM解析完成后，网页内资源加载完成的时间（如JS脚本加载执行完毕）
domComplete         // DOM树解析完成，且资源也准备就绪的时间，document.readyState变为complete，并将抛出readystatechange相关事件
loadEventStart      // load事件发送给文档，也即load回调函数开始执行的时间
loadEventEnd        // load事件的回调函数执行完毕的时间

// 计算加载时间
function getPerformanceTiming() {
    var t = performance.timing;
    var times = {};
    // 页面加载完成的时间，用户等待页面可用的时间
    times.loadPage = t.loadEventEnd - t.navigationStart;
    // 解析DOM树结构的时间
    times.domReady = t.domComplete - t.responseEnd;
    // 重定向的时间
    times.redirect = t.redirectEnd - t.redirectStart;
    // DNS查询时间
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
    // 读取页面第一个字节的时间
    times.ttfb = t.responseStart - t.navigationStart;
    // 资源请求加载完成的时间
    times.request = t.responseEnd - t.requestStart;
    // 执行onload回调函数的时间
    times.loadEvent = t.loadEventEnd - t.loadEventStart;
    // DNS缓存时间
    times.appcache = t.domainLookupStart - t.fetchStart;
    // 卸载页面的时间
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
    // TCP 建立链接完成握手的时间
    times.connect = t.connectEnd - t.connectStart;
    return times;
}

// 2.performance.navigation
// redirectCount: 0     // 页面经过了多少次重定向
// type: 0
// 0    表示正常进入页面
// 1    表示通过window.location.reload()刷新页面
// 2    表示通过浏览器前进后退进入页面
// 255  表示其他方式

// 3.performance.memory
// jsHeapSizeLimit  内存大小限制
// totalJSHeapSize  可使用的内存
// usedJSHeapSize   js对象占用的内存


// DOMContentLoaded vs. load
// 1. DOMContentLoaded是指页面元素加载完毕，但是一些资源比如图片还无法看到，但是这个时候页面是可以正常交互的，比如滚动，输入字符等。
// jQuery中经常使用的$(document).ready()其实监听的就是DOMContentLoaded事件
// 2. load是指页面上所有的资源（图片，音频，视频等）加载完成。
// jQuery中$(document).load()监听的是load事件

// load
window.onload = function() {}
// DOMContentLoaded
function ready(fn) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false)
            fn()
        }, false)
    } else if (document.attachEvent) {
        // ie
        // 确保当页面是在iframe中加载时，事件依旧会被安全触发
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee)
                fn()
            }
        })
        // 如果是ie且页面不在iframe中时，轮询调用doScroll方法检测DOM是否加载完毕
        if (document.documentElement.doScroll && typeof window.frameElement === 'undefined') {
            try {
                document.documentElement.doScroll('left')
            } catch (error) {
                return setTimeout(arguments.callee, 20)
            }
            fn()
        }
    }
}




