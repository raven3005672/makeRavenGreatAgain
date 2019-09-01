// 两者都会并行下载，不会影响页面的解析
// defer会按照顺序在DOMContentLoaded前按照页面出现顺序依次执行
// async则是下载完立即执行

// 普通的script标签
{/* <script src="a.js" /> */}
// 停止解析document
// 请求a.js
// 执行a.js中的脚本
// 继续解析document

// defer标签
{/* <script src="d.js" defer /> */}
{/* <sciprt src="e.js" defer /> */}
// 不阻止解析document，并行下载d.js, e.js
// 即使下载完d.js, e.js仍继续解析document
// 按照页面中出现的顺序，在其他同步脚本执行完后，DOMContentLoaded事件前，依次执行d.js e.js

// async标签
{/* <script src="d.js" async /> */}
{/* <sciprt src="e.js" async /> */}
// 不阻止解析document，并行下载d.js, e.js
// 当脚本下载完后立即执行。（两者执行顺序不确定，执行阶段不确定，可能在DOMContentLoaded事件前或者后）

// 动态添加的script标签隐含async属性

// 两者都不会阻止 document 的解析
// defer 会在 DOMContentLoaded 前依次执行 （可以利用这两点哦！）
// async 则是下载完立即执行，不一定是在 DOMContentLoaded 前
// async 因为顺序无关，所以很适合像 Google Analytics 这样的无依赖脚本