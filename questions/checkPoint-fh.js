// 手写代码
// 1.节流、防抖
// 2.Promise finally done实现
// 3.cacheFunction实现（一个函数调用，第二次调用的时候返回缓存结果）

// 5.promise.all实现
// 6.深拷贝
// 7.数组去重

// 表述

// 2.http缓存 协商缓存 强制缓存
// 3.for-in for-of map forEach区别
// 4.module exports exports import export 区别
// 5.函数柯里化


// 8.webpack工作流程
// 9.postmessage通信
// 10.sesstionStorage localStorage indexDB 区别和用法，localStorage变更有事件可以监听

// 算法准备
// LeetCode简单类型刷一刷

// 手写symbol
// 手写const
// 手写promise
// 手写debounce
// 封装fetch支持abort
// setTimout和requestAnimationFrame差异
// 页面优化
// script标签 defer async prefetch

// 页面的渲染从render到绘制（浏览器渲染机制）
// 前端路由控制。不用react-router，比如hash和historyAPI
// react的prueComponent, component, function
// js bridge
// react的diff过程。key作用
// 跨域、jsonp、cors（跨域资源共享）
// 给你一个项目，你要怎么开始搞
// 前端安全，csrf原理和组织方法
// https的安全机制，中间人攻击
// 浏览器缓存
// rn和h5有什么不同，如何实现
// rem移动端怎么适配
// js操作dom为什么耗时？（js引擎和dom通信耗时，会引起回流和重绘）
// documents fragments是什么 创建一个新的空的文档片段
// DocumentFragment。不是真实DOM树的一部分，它的变化不会引起DOM树的重新渲染的操作（reflow），且不会导致性能等问题。

// 布局：屏幕正中间有个a元素，随着屏幕宽度增加，需要满足以下条件
// a元素垂直据中宇屏幕中间
// a元素距离屏幕左右10px
// a元素中的文字水平垂直居中
// a元素高度始终是宽度的50%，搞不定可以实现a元素固定200px

// 函数中的arguments是数组么？转化成真正的数组，伪数组和数组有什么区别？
// 类数组和数组一样，一样可以读写和遍历，但是不能使用数组上的方法。

// if([] == false) {console.log(1)} // 1 数组valueOf().toString()
// if({} == false) {console.log(1)} // void [object Object]
// if([]) {console.log(3)}  // 3 
// if([1] == [1]) {console.log(4)}  // void 两个数组的栈地址不同

const obj = {
    name: 'jsCoder',
    skill: ['es6', 'react', 'angular'],
    say: function() {
        for (var i = 0, len = this.skill.length; i < len; i++) {
            setTimeout(function() {
                console.log('No', +i + this.name);
                console.log(this.skill[i]);
                console.log('----')
            }, 0);
            console.log(i);
        }
    }
}
obj.say();
// 期望输出
// 1 2 3 No1 jscoder es6
// No2 jscoder React
// no3 jscoder angular

// 改法
// var => let
// i从1开始，一直到i<=len
// setTimeout中箭头函数绑定this
for (let i = 1, len = this.skill.length; i <= len; i++) {
    setTimeout(() => {
        console.log('No')
        console.log(this.skill[i]);
        console.log('---')
    }, 0);
    console.log(i);
}

// 实现Function的原型bind方法，使得以下程序最后输出success
function Animal(name, color) {
    this.name = name;
    this.color = color;
}
Animal.prototype.say = function() {
    return `I am ${this.color} ${this.name}`;
}
const Cat = Animal.bind(null, 'cat');
const cat = new Cat('white');
if (cat.say() === 'I am a white cat' && cat instanceof Cat && cat instanceof Animal) {
    console.log('success')
}

// 参考答案
Function.prototype.bindFn = function bind(thisArg) {
    if (typeof this !== 'function') {
        throw new TypeError(this + 'must be a function');
    }
    // 存储函数本身
    var self = this;
    // 去除thisArg的其他参数 转成数组
    var args = [].slice.call(arguments, 1);
    var bound = function() {
        // bind范湖IDE番薯的参数转换成数组
        var boundArgs = [].slice.call(arguments);
        // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
        return self.apply(thisArg, args.concat(boundArgs));
    }
    return bound;
}

// js实现函数节流

// 从给定的无序，不重复的数组data中，去除n个数，使其和相加为sum，并给出算法的时间和空间复杂度【n数和问题】

// 一个带按钮的搜索框，input部分宽度自适应，按钮部分高度固定

// 隐式类型转换，输出

// 用reduce实现map

// 实现一个函数，每3秒答应出来一个hello world,打印4次
// function repeat(func, alert, 3000);
// fn = repeat('hello wold');

// input和p双向绑定【原生】
// https://www.cnblogs.com/yuqing-o605/p/6790709.html?utm_source=itdadao&utm_medium=referral%EF%BC%89

// es5 es6继承

// react forceupdate

// state改变之后触发什么

// this指向

// new实现

// 双向绑定

// 单例模式

// 浏览器渲染机制的详细描述

// http2.0

// js defer async prefetch

// 输入url到页面显示

// 浏览器缓存

// 优化

// 了解什么新技术，看什么书，学习的途径是什么，高速变化，如何判断自己该学什么

// 项目最大的困难，最大的收获，怎么解决的，优势劣势

// history API
// pushState
// replactState
// 添加和修改历史记录条目

实现debounce实现throttle
实现bind,call,apply
打印出来html里所有标签
实现一个lazyman
实现一个deepclone
实现快速排序
实现一个数组乱序
实现一个Promise
实现一个LRU
求第K大树
二叉树的深度
两数之和
四数之和
找出一个集合所有的子集

flex 已经是移动端的标配了。今年面试中基本很多都考察flex。所以对于flex-grow和flex-shrink，flex-direction 这些属性必须灵活掌握。而且对于弹性盒里面的元素的是否会被缩减，以及缩减的规则都会被考察到。对于高级前端一些深度的特性也会被考察到。

vertical-align 为什么没有绝对垂直居中？
line-height 的具体含义是什么？

http2 是今年一个必考题了。所以HTTP2 分帧的，多路复用，server push 这些都得深度掌握，只肤浅理解到基本概念 还是很容易被问住的。推荐大家看两篇文章 MDN HTTP
另外缓存(协商缓存和强缓存)，跨域 这些都不赘述了。


Virtual Dom 是否可以提高性能？
怎么看待Dom Diff？Dom Diff算法是啥？
如何设计一个组件？
Vue发展问题在哪里？


Web性能啥时候都是一个必考题。针对Web性能。推荐大家看Google的文档。
Webpack 
webpack 基本会考察到各种loader，plugin的名字和使用方法 

用过哪些插件？
如何做性能优化？
code split 怎么做？
什么是treeshaking？注意些什么？


移动端
JSBridge 原理 和 离线包成了必考题。

移动端如何做适配？
一像素问题怎么解决？
JSBridge原理是什么？如何设计一个JSBridge？
离线包怎么设计？
Hybrid H5开发需要注意些什么？
Webview的缓存机制是什么？

直播方向
直播协议都有什么？
WebRTC是什么？基本原理是什么？


Nodejs
高级码农都或多或少写过一些nodejs。但是nodejs 的面试问题很难准备。平时可能写的很6，但是面试不一定能答得出来。通常大家都会问你的Nodejs在处理什么模块。 
项目中的中间层Node 在处理什么问题？
Node 的Cluster模式是什么？
Node 中的进程和线程啥区别？
Node 中如何创建一个进程？
Node的多个进程如何通信？
Koa2 中的 context如何实现？
如何监控Node？
Node中的日志如何保整串行？
Node 挂掉怎么办？怎么发现其中的问题？
Node中的事件循环是什么？


安全
HTTPS原理是什么？
如何劫持HTTPS？
XSS 是什么？如何防范？
CSRF是什么？如何防范？
如何应对重放攻击？


https://juejin.im/post/5d7f80796fb9a06b24434d4e

WebSocket

