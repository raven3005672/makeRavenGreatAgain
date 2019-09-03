1. 关于一个对象 obj 到底包含有多少个属性，下面三个 API 的检测结果可能不完全一致，假如将它们返回的属性个数从大到小排序的话，恒成立的选项是哪个？
A. Reflect.ownKeys(obj).length ≥ Object.getOwnPropertyNames(obj).length ≥ Object.keys(obj).length
B. Object.getOwnPropertyNames(obj).length ≥ Object.keys(obj).length ≥ Reflect.ownKeys(obj).length 
C. Reflect.ownKeys(obj).length ≥ Object.keys(obj).length ≥ Object.getOwnPropertyNames(obj).length 
D. Object.getOwnPropertyNames(obj).length ≥ Reflect.ownKeys(obj).length ≥ Object.keys(obj).length 
E. Object.keys(obj).length ≥ Object.getOwnPropertyNames(obj).length ≥ Reflect.ownKeys(obj).length 
F. Object.keys(obj).length ≥ Reflect.ownKeys(obj).length ≥ Object.getOwnPropertyNames(obj).length

参考答案：A
考查知识点：属性的可枚举性和 Symbol 类型属性键。Reflect.ownKeys() 比 Object.getOwnPropertyNames() 会多返回 Symbol 类型的属性键，Object.getOwnPropertyNames() 比 Object.keys() 会多返回不可枚举的字符串属性键。

2. 关于新的 DOM 方法 append() 和老的 appendChild() 的区别，下面说法错误的是哪个：
A. append() 方法可以直接追加字符串为文本节点，比如 append("text") ，appendChild() 不行
B. append() 方法可以直接追加 HTML 片段字符串为元素节点，比如 append("<p>test</p>") ， appendChild() 不行
C. append() 方法支持追加多个参数，appendChild() 只能追加一个
D. append() 方法没有返回值，而 appendChild() 会返回追加进去的那个节点
E. 和 append() 同时期加入 DOM 规范的方法还有 prepend() 、before()、after() 等。
F. jQuery 中存在的 appendTo() 方法并没有和 append() 一起加入到 DOM 规范里

参考答案：B
考查知识点：对新一代 DOM API 的了解程度。B 为错误项，不支持直接追加 HTML，和 jQuery 的 append() 不一样。

3. 在调试页面中的 JavaScript 代码时，Chrome DevTools 的断点功能是必不可少的，Chrome DevTools 有很多强大的自动断点功能（即你不需要手动找到想要加断点的那行代码），但下面有一个是杜撰的，请挑出它来（本题以 Chrome 当前稳定版 V72 为准）：
A. 在遇到死循环代码的时候自动断点
B. 在每个 <script> 标签第一句代码执行时自动断点
C. 在某个指定的 DOM 方法被调用时自动断点
D. 在未捕获的异常抛出时自动断点
E. 在匹配指定 URL 的 XHR/fetch 请求发起时自动断点
F. 在指定的节点被删除时自动断点

参考答案：A
考查知识点：页面调试能力。A 为错误项，Chrome 开发者工具目前还没有该能力，B 在 Sources 面板中右下角的 Event Listener Breakpoints > Script > Script First Statement，C 用 Console 面板上的 debug() 函数，比如 debug(alert) ，然后所有调用alert() 的地方都会自动中断。D 在 Sources 面板右上角的 Pause on exceptions 按钮。E 在 Sources 面板右下角的 XHR/fetch Breakpoints。F 在 Elements 面板中元素上右键 -> Break on -> node removal。

4. 关于 HTTP 协议，下面说话错误的是哪个一个：
A. 看到网页有乱码，则很有可能是某个请求的 Content-Type 响应头丢失或者是值设置不当造成的
B. 即便是不需要发送请求体的 GET 请求，请求头区域下方也必须留一个空行（CRLF）
C. 服务端可以根据客户端发送的 Accept-Encoding 请求头来分别返回不同压缩格式（Gzip、Brotli）的文件
D. 服务端返回的 Date 响应头表示服务器上的系统时间，除给人读外没有实际用途
E. HTTP 是无状态的，网站是通过 Cookie 请求头来识别出两个请求是不是来自同一个浏览器的
F. Access-Control-Allow-Origin 响应头只支持配置单个的域名或者是 * ，不支持配置多个特定的域名

参考答案：D
D 为错误选项，Date 响应头有参与缓存时长的计算，不仅仅是给人看看服务器时间。

5. 下面哪个选项不属于现代 Web 页面性能方面的最佳实践？
A. 使用 document.write() 
B. 使用 HTTP/2
C. 使用 passive 的事件监听器
D. 静态文件使用 CDN 
E. 尽量使用更先进的图片格式，比如 WebP
F. 使用同步的 XHR 请求

参考答案：AF
考查知识点：知道要尽量不使用 document.write()，知道 passive 的事件监听器是什么

多选题
1. 关于箭头函数，下面说法错误的有哪些？
A. 箭头函数没有自己的 this，而是会继承上层作用域的 this，就像其他普通的变量一样
B. 箭头函数还可以通过 .call()、.apply()、.bind() 方法来重新绑定它的 this 值
C. 箭头函数可以像普通函数一样使用 arguments 对象
D. 过度追求箭头函数的“单行代码”写法可能会降低代码可读性
E. 箭头函数虽然表面上看是匿名的，但它可以根据前面的变量名和属性名自动推断出同名的 name 属性
F. 箭头函数不可以被 new，也不会像普通函数一样自动拥有 prototype 属性

参考答案：BC
B 是箭头函数不支持动态改变 this 值，C 是箭头函数同样也没有 arguments。

2. 带有 target="_blank" 的 a 标签被认为是有安全风险的，因为点击它后打开的新标签页面可以通过 window.opener.location = 来将来源页面跳转到钓鱼页面，不过给该 a 标签增加下面哪些属性就能阻止这一行为？
A. rel="nofollow" 
B. rel="noopener" 
C. rel="noreferrer" 
D. rel="opener" 
E. rel="external" 
F. rel="parent"

参考答案：BC
noopener 是最合适的属性，不过 noreferrer 同样也包含有 noopener 的功效，noreferrer noopener 同时加是多余的。

rel="opener" 是功能恰好相反的选项，因为其实除了 Chrome，最新版的 Safari 和 Firefox 已经都为 a 链接默认采用 noopener 模式了，真需要 opener 属性的时候可以使用 rel="opener" 开启。

其它的选项都是迷惑性选项，在浏览器中实际都没有任何作用。

3. ES6 里的 Proxy 被认为是个神器，利用它可以实现很多以前只有魔改 JS 引擎底层才能实现的效果，请找出下面是利用 Proxy 实现了的神奇效果：
A. 原型就是自己的对象 —— Object.getPrototypeOf(obj) === obj // true 
B. 任意属性都存在的对象 —— "任意名字的属性" in obj // true 
C. 任意值都是它的实例的对象，甚至 null 和 undefined —— undefined instanceof obj // true 
D. 用 Object.prototype.toString() 检测出来的对象类型是 haha 的对象 —— Object.prototype.toString.call(obj) === "[object haha]" // true 
E. 一元加后的值与加 0 后的值分别恒等于两个不同的数字 —— 比如 +obj 始终 === 1，但 obj + 0 始终等于=== 10 
F. 亦假又亦真的对象 —— if (obj.length) {alert("能执行到")} 但 obj === undefined 为 true

参考答案：AB
A: obj = new Proxy({}, {getPrototypeOf(){return obj}}) 
B: obj = new Proxy({}, {has(){return true}}) 
C: obj = {[Symbol.hasInstance](){return true}} 
D: obj = {[Symbol.toStringTag]: "haha"} 
E: obj = {[Symbol.toPrimitive](hint){return hint === "number" ? 1 : 10}} 
F: document.all

C、D、E 是利用了 ES6 里 Well-Known Symbols 的魔力，不是 Proxy 的。F 是唯一的大奇葩 document.all

4. ES6 中首次对函数的 name 属性进行了标准化，而且为了方便在调用栈里看到具体的函数名，ES6 里还增加了函数名推断的功能。下面哪个选项中函数的 name 属性并不完全等于 foo ？
A. const foo = () => {}
B {foo: function(){}} 
C. {*foo(){}} 
D. {[Symbol("foo")](){}} 
E. class C {static get foo(){}}
F. {async foo(){}}

参考答案：DE
考查知识点：对 ES6 中函数 name 属性的了解。D 中 name 属性为 [foo] ，Symbol 类型的属性键需要加中括号，E 中 name 属性为 get foo，getter 和 setter 分别加 get 和 set 前缀。

5. 下面这些 Element 上的方法，有哪些是支持传入一个选择器作为参数的？
A. Element.prototype.querySelector() 
B. Element.prototype.querySelectorAll() 
C. Element.prototype.matches() 
D. Element.prototype.closest() 
E. Element.prototype.remove() 
F. Element.prototype.contains()

参考答案：ABCD
考查知识点：原生的 remove() 方法和 jQuery 的不一样，只能删除自己，所以不支持传入选择器。contains() 方法也很容易被误认为支持选择器，比如 document.body.contains(".header > a") ，实际只支持传入节点。

编程题
1. JavaScript 采用原型继承，即一个对象继承自另外一个对象，另外一个对象再继承自别的对象，依此往复。请写一个通用的 JavaScript 函数，来找出某个对象身上的某个属性继承自哪个对象。
函数签名：
function findPrototypeByProperty(obj, propertyName){
  // 请实现函数体
}
使用举例：
const foo = {a: 1}

const bar = Object.create(foo)
bar.b = 2

const baz = Object.create(bar)
baz.c = 3

console.log(findPrototypeByProperty(baz, "c") === baz) // true
console.log(findPrototypeByProperty(baz, "b") === bar) // true
console.log(findPrototypeByProperty(baz, "a") === foo) // true
参考答案：
function findPrototypeByProperty(obj, propertyName) {
  do {
    if (obj.hasOwnProperty(propertyName)) {
      return obj
    }
  } while (obj = Object.getPrototypeOf(obj))
}
2. URLSearchParams() 接口是用来解析和处理 URL 参数的 API，目前最新的浏览器和 Node 都支持它。请用 class URLSearchParams {} 语法实现一个该接口的 polyfill，考虑到时间因素，答题者只需实现下面列举的要求即可：
// 构造函数支持传入 URL 参数串
searchParams = new URLSearchParams("foo=1&bar=2") 

// 构造函数也支持传入一个包含参数键值对的对象
searchParams = new URLSearchParams({foo: "1", bar: "2"})

// 实例支持 get()、set()、has()、append() 四个方法
console.log(searchParams.get("foo")) // "1"
searchParams.set("foo", "10") 
console.log(searchParams.has("bar")) // true
searchParams.append("foo", "100") 

// 实例支持 toString() 方法
console.log(searchParams.toString()) // "foo=10&bar=2&foo=100"

// 实例支持 for-of 迭代
for(const [key, value] of searchParams) {
  console.log([key, value])
  // ["foo", "10"]
  // ["bar", "2"]
  // ["foo", "100"]
}
参考答案：
考察学生对 URL 的认识以及对 class 语法、for-of 语法的熟悉程度，以下代码在 Chrome 74 中可用。实现逻辑不需要完全依照规范，能跑通题干中的要求即可。

class URLSearchParams {
  #searchParams = []

  constructor(init) {
    if (typeof init === "string") {
      this.#searchParams = init.split("&").map(kv => kv.split("="))
    } else {
      this.#searchParams = Object.entries(init)
    }
  }

  get(key) {
    const param = this.#searchParams.find(param => param[0] === key)
    return param && param[1]
  }

  set(key, value) {
    const param = this.#searchParams.find(param => param[0] === key)

    if (param) {
      param[1] = value
    } else {
      this.#searchParams.push([key, value])
    }
  }

  has(key) {
    return this.#searchParams.some(param => param[0] === key)
  }

  append(key, value) {
    this.#searchParams.push([key, value])
  }

  toString() {
    return this.#searchParams.map(param => param.join("=")).join("&")
  }

  *[Symbol.iterator]() {
    yield* this.#searchParams
  }
} 