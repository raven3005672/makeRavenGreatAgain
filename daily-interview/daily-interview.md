https://github.com/Advanced-Frontend/Daily-Interview-Question

1.key的作用是为了在diff算法执行时更快的找到对应的节点，提高diff速度
没有绑定key的情况下，并且在遍历模板简单的情况下，会导致虚拟新旧节点对比更快，节点也会复用。

2.['1','2','3'].map(parseInt)
结果是[parseInt('1', 0), parseInt('2', 1), parseInt('3', 2)] => [1, NaN, NaN]

3.节流与防抖的理解
防抖：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
思路：每次触发事件时都取消之前的延时调用方法
```
function debounce(fn) {
    let timeout = null;     // 创建一个标记用来存放定时器的返回值
    return function () {
        clearTimeout(timeout);      // 每当用户输入的时候把前一个setTimeout clear掉
        timeout = setTimeout(() => {        // 然后传建一个新的setTimeout，这样就能保证输入字符后的interval间隔内如果还有字符输入的话，就不会执行fn函数
            fn.apply(this, arguments);
        }, 500);
    };
}
function sayHi() {
    console.log('防抖成功')
}
var inp = document.getElementById('inp');
inp.addEventListener('input', debounce(sayHi));     // 防抖
```

节流：高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
思路：每次触发事件时都判断当前是否有等待执行的延时函数
```
function throttle(fn) {
    let canRun = true;          // 通过闭包保存一个标记
    return function() {
        if (!canRun) return;    // 在函数开头判断标记是否为true，不为true则return
        canRun = false;         // 立即设置为false
        setTimeout(() => {      // 将外部传入的函数的执行放在setTimeout中
            fn.apply(this.arguments);       // 最后在setTimeout执行完毕后再把编辑设置为true（关键）表示可以执行下一次循环了。当定时器没有执行的时候永远是false，在开头被return掉
            canRun = true;
        }, 500);
    }
}
function sayHi(e) {
    console.log(e.target.innerWidth, e.target.innerHeight);
}
window.addEventListener('resize', throttle(sayHi));
```

4.Set/Map/WeakSet/WeakMap
Set/Map的主要应用场景在于数据重组和数据储存

Set(集合)
类似数组，成员唯一无重复且排列无序。[1,2,3]
属性与操作方法：size——内容数；add——新增；delete——存在即删除；has——判断是否存在；clear——清空
遍历方法：keys——所有键；values——所有值；entries——所有键值对；forEach(callbackFn, thisArg)——对所有成员执行callback，this指向thisArg
便于实现交集并集差集
```
let set1 = new Set([1,2,3]);
let set2 = new Set([4,3,2]);
let intersect = new Set([...set1].filter(value => set2.has(value)))
let union = new Set([...set1, ...set2])
let difference = new Set([...set1].filter(value => !set2.has(value)))
```

WeakSet
只能储存对象引用，不能存放值；set对象都可以
储存的对象值都是被弱引用的，垃圾回收机制不考虑weakset对该对象的引用，如果没有其他变量或属性引用这个对象值，则这个对象将会被垃圾回收掉。
WeakSet不可遍历


Map(字典)
键值对存储[[1,1], [2,2], [3,3]]
只有对同一个对象的引用，Map结构才将其视为同一个键 => 是和内存地址绑定的，只要内存地址不同，就视为两个键。解决了同名碰撞问题。
简单类型（数字、字符串、布尔值）需要两个值严格相等，则视为同一个键。
```
const map = new Map();
map.set(['a'], 555);
map.get(['a'])      // undefined
```
操作方法：set，get，has，delete，clear
遍历方法：keys，values，entries，forEach

WeakMap
键值对的集合，其中的键是弱引用对象，值可以是任意。弱引用只是键名，不是键值。

5.深度优先遍历DFS、广度优先遍历BFS
参考 graph.js

6.实现深度拷贝
参考deepCloneLodash.js/deepClone.js

7.ES5/6的继承除了写法以外还有什么区别？
class 声明不会提升[暂时性死区]，其实是声明提前但是赋值未提前
```
var Foo = function() {
    this.foo = 21;
}
{
    const foo = new Foo();
    class Foo {
        constructor() {
            this.foo = 2312;
        }
    }
}
```
class 内部使用严格模式
class 的所有方法（包括静态方法和实例方法）都是不可枚举的
class 的所有方法（包括静态方法和实例方法）都没有原型对象prototype，所以也米有[[construct]]，不能new调用
class 本身必须用new调用
class 内部不能重写类名
class 子类可以通过__proto__找到父类，ES5的__proto__为Function.prototype
ES5的继承先生成子类实例，再调用父类的构造函数修饰子类实例 <=> ES6的继承先生成父类实例，再调用子类的构造函数修饰父类实例

8.setTimeout、Promise、Async/Await的区别
宏任务队列、微任务队列
setTimeout的回调函数放在宏任务队列里，执行栈清空之后执行；
p本身同步立即执行，p.then的回调函数放在宏任务队列的微任务队列里，等宏任务里面的同步代码执行完再执行；
async表示函数里可以会有异步方法，await后面跟一个表达式，async方法执行时，遇到await会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行。可以理解为让出的线程，跳出了async函数体。

9.async/await如何通过同步的方式实现异步
？

10.写出运行结果
参考taskQueue.js

11.数组扁平化并除其中重复部分，最终得到一个升序且不重复的数组
参考arrayFlat.js

12.js异步解决方案的发展历程以及优缺点
回调callback：解决同步问题、回调地狱
Promise：解决回调地狱、不能取消Promise
Generator：可以控制函数的执行.next()
Aysnc/await：语法糖，代码清晰，但是同步改写后如果多个一步操作没有依赖性而使用await会导致性能上的降低

13.Promise构造函数是同步执行还是异步执行？then方法？
本身同步执行，then方法异步执行，详情参考taskQueue.js

14.实现一个new
参考new.js

15.简单讲解一下http2的多路复用
HTTP2采用二进制格式传输，取代了HTTP1.x的文本格式，二进制格式解析更高效。
多路复用代替了HTTP1.x的序列和阻塞机制，所有的相同域名请求都通过同一个TCP链接并发完成。
在HTTP1.x中，并发多个请求需要多个TCP链接，浏览器为了控制资源会有6-8个TCP链接都限制。
HTTP2中，同域名下所有通信都在单个链接上完成，消除了因多个TCP链接而带来的延时和内存消耗。
单个链接上可以并行交错的请求和相应，之间互不干扰。

16.TCP三次握手和四次挥手
参考图片tcp3-4。
TCP连接是全双工的，每个防线都必须单独进行关闭，所以即时没有最后一个包，也要先回复断开连接的请求，然后再发送关闭请求。

17.A、B机器正常连接后，B机器突然重启，问A此时处于TCP什么状态
服务器和客户端建立连接后，若服务器主机崩溃，有两种可能：
服务器不重启，客户端继续工作，就会发现对方没有回应（ETIMEOUT），路由器聪明的话，则是目的地不可达（EHOSTUNREACH）
服务器重启后，客户端继续工作，然而服务器已丢失客户端信息，收到客户端数据后响应RST

18.React中setState什么时候是同步的，什么时候是异步的？
在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。
在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。

19.React setState笔试题，下面的代码输出什么
```
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```
输出0 0 2 3
具体解析参考react-setState.js

20.介绍下npm模块安装机制，为什么输入npm install就可以自动安装对应的模块
参考npmInstall.js

21.有以下三个判断数组的方法，请分别介绍它们之间的区别和优劣
参考methodOfcheckIsArray.js

22.介绍下重绘Repaint和回流Reflow，以及如何进行优化
参考repaint&reflow.js

23.介绍下观察者模式和订阅发布模式的区别，各自适用于什么场景
参考Observer&Publish-Subscribe.js

24.聊聊Redux和Vuex的设计思想
参考Vuex-Flux-Redux-ReduxSaga-Dva-MobX.js

25.说说浏览器和Node事件循环的区别
参考eventLoop.js

26.介绍模块化发展历程
IIFE——立即执行函数表达式
AMD——requireJS【define】
CMD——seaJS支持动态引入依赖【define。require】
CommonJS——node【require】
UMD——兼容AMD+CommonJS
webpack(require.ensure)
ES Module——import
参考front-modules.js

27.全局作用域中，从const和let声明的变量不在window上，那到底在哪里？如何去获取
在块级作用域Script中。

28.cookie和token都存放在header中，为什么不会劫持token
浏览器会自动带上cookie，而浏览器不会自动带上token
相关安全问题：XSS、CSRF

29.Vue的双向数据绑定，Model如何改变View，View如何改变Model
M->V的映射Data Binding
V->M的事件监听DOM Listeners

30.把两个数组合并为一个数组
请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']。
```
let a1 =  ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let a2 = ['A', 'B', 'C', 'D'].map((item) => {
  return item + 3
})
let a3 = [...a1, ...a2].sort().map((item) => {
  if(item.includes('3')){
    return item.split('')[0]
  }
  return item
})
```

31.改造下面的代码，使之输出0-9，尽量多的解法
```
for (var i = 0; i< 10; i++) {
	setTimeout(() => {
		console.log(i);
    }, 1000)
}
```
参考31.js

32.Virtual DOM真的比操作原生DOM块么？
参考VirtualDOM-NativeDOM.js

33.写出下面代码的输出结果
```
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();
```
打印function b...
如果var b = 20或者function名字非b; 则输出20

34.简单改造下面的代码，使之分别打印10和20
```
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
```
参考34.js

35.浏览器缓存读取规则
可以分成 Service Worker、Memory Cache、Disk Cache 和 Push Cache，那请求的时候 from memory cache 和 from disk cache 的依据是什么，哪些数据什么时候存放在 Memory Cache 和 Disk Cache中？
参考cache.js

36.使用迭代的方式实现flatten函数
参考flatten.js

37.为什么Vuex的mutation和Redux的reducer中不能做异步操作？
参考37.js

38.下面代码中a在什么情况下会打印1？
```
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```
参考38.js

39.介绍下BFC及其应用
块级格式上下文，相当于一个独立的容器，里面的元素和外部的元素互相不影响。
创建BFC的方式：html根元素、float浮动、绝对定位、overflow不为visiable、display为表格布局或者弹性布局
BFC的主要作用：清除浮动、防止同一BFC容器中的相邻元素间的外边距重叠问题

40.在Vue中，子组件为何不可以修改父组件传递的Prop
如果修改了，Vue 是如何监控到属性的修改并给出警告的。
简要：单向数据流，易于检测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置。
如果修改了会基于当前环境触发warning提示

41.下面代码输出什么？
```
var a = 10;
(function () {
    console.log(a)
    a = 5
    console.log(window.a)
    var a = 20;
    console.log(a)
})()
```
undefined/10/20
简单解析，IIFE内部变量声明提升，var a = undefined, 输出undefined，内部a=20，window.a外部作用域为10，内部a=20

42.实现一个sleep函数
比如 sleep(1000) 意味着等待1000毫秒，可从 Promise、Generator、Async/Await 等角度实现
参考sleep.js

43.使用sort()对数组[3,15,8,29,102,22]进行排序，输出结果
[3,15,8,29,102,22].sort((a,b) => a - b);

44.介绍HTTPS握手过程
参考https.js

45.HTTPS握手过程中，客户端如何验证证书的合法性
参考https.js

46.输出以下代码执行的结果并解释为什么
```
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```
obj [empty x 2, 1, 2, splice: f, push: f, length: 4]
伪数组，类型仍是obj
push方法是根据数组的length为参数，给数组创建一个下标为length的属性。
因为存在splice方法和length属性，将其作为数组进行打印。

47.双向绑定和vuex是否冲突
略，参考https://vuex.vuejs.org/zh/guide/forms.html

48.call和apply的区别是什么，哪个性能好一些
参考call-apply.js

49.为什么通常在发送数据埋点请求的时候使用的是1x1像素的透明gif图片
能够完成整个http请求+响应
触发get请求之后不需要获取和处理数据、服务器也不要求发送数据
跨域友好
执行过程无阻塞
相比XMLHttpRequest对象发送GET请求，性能上更好
gif最低合法体积最小

50.实现(5).add(3).minus(3)功能
```
Number.prototype.add = function(n) {
    return this.valueOf() + n;
}
Number.prototype.minus = function(n) {
    return this.valueOf() - n;
}
```

51.Vue的响应式原理中Object.defineProperty有什么缺陷？
为什么Vue3.0采用了Proxy，抛弃了Object.defineProperty
Object.defineProperty无法监控到数组下标的变化，导致通过数组下标添加元素，不能实时响应；
Object.defineProperty只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历。Proxy可以劫持整个对象，并返回一个新的对象。
Proxy不仅可以代理对象，还可以代理数组，还可以代理动态增加的属性。

52.怎么让一个div水平垂直居中
参考div-center.js

53.输出以下代码的执行结果并解释为什么
```
var a = {n: 1};
var b = a;
a.x = a = {n: 2};
console.log(a.x)
console.log(b.x)
```
参考53.js

54.冒泡还需如何实现，时间复杂度是多少，还可以如何改进
参考54.js

55.某公司1到12月份的销量额存在一个对象里面
如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]。
```
let obj = {1:222, 2:123, 5:888};
let result = Array.from({length: 12}, () => null);
for (key in obj) {
    result[key - 1] = obj[key]
}
console.log(result)
```

56.要求设计LazyMan类，实现以下功能
```
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```
参考56.js

57.分析比较opacity: 0、visibility: hidden、display: none优劣和使用场景。
参考57.js

58.箭头函数和普通函数的区别是什么？构造函数可以使用new生成实例，name箭头函数可以么？为什么？
参考58.js

59.给定两个数组，写一个方法来计算它们的交集。
给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]。
参考59.js 哈希表，不能用indexOf这种方法

60.已知如下代码，如何修改才能让图片宽度为300px？注意下面代码不可修改
```
<img src="1.jpg" style="width:480px!important;”>
```
max-width:300px;覆盖其样式；
transform: scale(0.625)；按比例缩放图片；

61.介绍下如何实现token加密
jwt距离：
需要一个随机数secret，后端利用secret和加密算法对payload生成一个字符串token，返回前端，前端每次请求都在header中戴上token，后端用同样的算法解密。

62.redux为什么要把reducer设计成纯函数
思路：reducer作用是接受旧的state和action，返回新的state。防止副作用。

63.如何设计实现无缝轮播
无缝轮播的核心是制造一个连续的效果，最简单的方法是复制一个轮播的元素，当复制元素将要滚到目标位置后，把原来的元素进行归位的操作，以达到无缝的轮播效果。
另一个回答【其实就是一次滚动两张？】
无限轮播基本插件都可以做到,不过要使用原生代码实现无缝滚动的话我可以提点思路,
因为轮播图基本都在ul盒子里面的li元素,
首先获取第一个li元素和最后一个li元素,
克隆第一个li元素,和最后一个li元素,
分别插入到lastli的后面和firstli的前面,
然后监听滚动事件,如果滑动距离超过x或-x,让其实现跳转下一张图或者跳转上一张,(此处最好设置滑动距离),
然后在滑动最后一张实现最后一张和克隆第一张的无缝转换,当到克隆的第一张的时候停下的时候,,让其切入真的第一张,则实现无线滑动,向前滑动同理

64.模拟实现一个Promise.finally
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {throw reason})
    )
}

65.a.b.c.d和a['b']['c']['d']那个性能更好？
dot更快，AST树解析dot结构更简单

66.ES6代码转成ES5代码的实现思路是什么
ES6 =》 AST语法树 =》转换 =》 生成ES5
babel/parse的parser方法，babel/core的transformFromAstSync方法，babel/traverse获取依赖

67.数组编程
随机生成一个长度为 10 的整数类型的数组，例如 [2, 10, 3, 4, 5, 11, 10, 11, 20]，将其排列成一个新数组，要求新数组形式如下，例如 [[2, 3, 4, 5], [10, 11], [20]]。
参考67.js

68.如何解决移动端Retina屏1px像素问题
viewport + rem: 根元素html设置font-size，将元素转换成rem，通过window.devicePixelRatio拿到dpr再写meta设置viewport的scale：1/dpr

69.如何把一个字符串的大小写取反，AbC => aBc
```
function processString(s) {
    var arr = s.split('');
    var new_arr = arr.map((item) => {
        return item === item.toUppderCase() ? item.toLowerCase() : item.toUpperCase();
    });
    return new_arr.join('');
}
```

70.介绍下webpack热更新原理，是如何做到在不刷新浏览器的前提下更新页面的
参考webpackHMR.js

71.实现一个字符串匹配算法，长度为n的字符串S中，查找是否存在字符串T，T的长度是m，若存在返回所在位置
```
const find = (s, t) => {
    if (s.length < t.length) {
        return -1;
    }
    for (let i = 0; i < s.length - t.length; i++) {
        if (s.slice(i, i + t.length) === t) {
            return i;
        }
    }
    return -1;
}
```
实际考查KMP算法

72.为什么普通for循环的性能远远高于forEach的性能，请解释其中的原因
for循环没有额外的函数调用栈和上下文
forEach函数实际上是array.forEach(function(currentValue, index, arr), thisValue);

73.介绍下BFC、IFC、GFC和FFC
BFC块级格式化上下文
IFC内联格式化上下文
GFC网格格式化上下文
FFC弹性格式化上下文

74.使用javaScript Proxy实现简单的数据绑定
model-data.js

75.数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少?
基本没有区别，js数组实质是哈希映射关系，通过键名key直接计算出值存储的位置

76.输出以下代码运行结果
```
// example 1
var a={}, b='123', c=123;  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'c'    数字自动转字符串覆盖
---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'b'    Symbol类型都不相等
---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'c'    都是a.[object Object]
```

77.旋转数组算法题，给定一个数组，将数组中的元素向右移动k个位置，其中k是非负数。
```
示例 1：

输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
输出: [5, 6, 7, 1, 2, 3, 4]
解释:
向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]
示例 2：

输入: [-1, -100, 3, 99] 和 k = 2
输出: [3, 99, -1, -100]
解释: 
向右旋转 1 步: [99, -1, -100, 3]
向右旋转 2 步: [3, 99, -1, -100]
```
参考77.js

78.Vue的父组件和子组件声明后期钩子执行顺序是什么？