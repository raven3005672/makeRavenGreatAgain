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

26.介绍模块化发展历程

27.全局作用域中，从const和let声明的变量不在window上，那到底在哪里？如何去获取

28.cookie和token都存放在header中，为什么不会劫持token

29.Vue的双向数据绑定，Model如何改变View，View如何改变Model

30.把两个数组合并为一个数组

31.改造下面的代码，使之输出0-9，尽量多的解法
for (var i = 0; i< 10; i++) {
	setTimeout(() => {
		console.log(i);
    }, 1000)
}

32.Virtual DOM真的比操作原生DOM块么？

33.写出下面代码的输出结果
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();

34.简单改造下面的代码，使之分别打印10和20
var b = 10;
(function b(){
    b = 20;
    console.log(b); 
})();