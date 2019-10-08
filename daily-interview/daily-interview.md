https://github.com/Advanced-Frontend/Daily-Interview-Question

18.React中setState什么时候是同步的，什么时候是异步的？
在React中，如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state。所谓“除此之外”，指的是绕过React通过addEventListener直接添加的事件处理函数，还有通过setTimeout/setInterval产生的异步调用。
在React的setState函数实现中，会根据一个变量isBatchingUpdates判断是直接更新this.state还是放到队列中回头再说，而isBatchingUpdates默认是false，也就表示setState会同步更新this.state，但是，有一个函数batchedUpdates，这个函数会把isBatchingUpdates修改为true，而当React在调用事件处理函数之前就会调用这个batchedUpdates，造成的后果，就是由React控制的事件处理过程setState不会同步更新this.state。


39.介绍下BFC及其应用
块级格式上下文，相当于一个独立的容器，里面的元素和外部的元素互相不影响。
创建BFC的方式：html根元素、float浮动、绝对定位、overflow不为visiable、display为表格布局或者弹性布局
BFC的主要作用：清除浮动、防止同一BFC容器中的相邻元素间的外边距重叠问题


52.怎么让一个div水平垂直居中
参考div-center.js


54.冒泡排序如何实现，时间复杂度是多少，还可以如何改进
参考54.js


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
加载渲染过程：
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
子组件更新过程
父beforeUpdate->子beforeUpdate->子updated->父updated
父组件更新过程
父beforeUpdate->父updated
销毁过程
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

79.input搜索如何防抖，如何处理中文输入？
compositionstart触发于一段文字的输入之前（类似于keydown事件，但是该事件仅在若干可见字符的输入之前，而这些可见字符的输入可能需要一连串的键盘操作、语音识别或者点击输入法的备选词）
简单来说就是切换中文输入法时在打拼音时（此时input还没有填入真正的内容），会首先触发compositionstart，然后每打一个拼音字母，触发compositionupdate，最后将输入好的中文填入input时触发compositionend。触发compositionstart时，文本框会填入 “虚拟文本”（待确认文本），同时触发input事件；在触发compositionend时，就是填入实际内容后（已确认文本）,所以这里如果不想触发input事件的话就得设置一个bool变量来控制。
compositionstart => compositionupdate => compositionend

80.介绍下Promise.all使用、原理实现及错误处理
Promise.all方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

81.打出1-10000之间的所有对称数，如121，1331等
参考81.js

82.给定一个数组nums，编写一个函数将所有0移动到数组的末尾，同事保持非零元素的相对顺序。
参考82.js

83.var/let/const区别的实现原理是什么？


84.实现一个add函数，满足以下功能。
参考add.js

85.react-router里的Link标签和a标签有什么区别？
参考85.js

86.给定一个整数数组和一个目标值，找出数组中和为目标值的两个数。
参考86.js

87.在输入框中如何判断输入的是一个正确的网址？
```
function isUrl(url) {
    const a = doucment.createElement('a');
    a.href= url;
    return [
        /^(http|https):$/.test(a.protocol),
        a.host,
        a.pathname !== url,
        a.pathname !== `/${url]`,
    ].find(x => !x) === undefined
}
```

88.实现convert方法，把原始list转换成树形结构，要求尽可能降低时间复杂度。
参考88.js

89.设计并实现Promise.race()
参考89.js

90.实现模糊搜索结果的关键词高亮显示
需要考虑节流、缓存。可以考虑使用正则替换掉关键词。

91.介绍下HTTPS中间人攻击
参考91.js

92.已知数据格式，实现一个函数fn，找出链条中所有父级id
参考92.js

93.给定两个大小为m和n的有序数组nums1和nums2，请找出这两个有序数组的中位数，要求算法的时间复杂度为O(log(m+n))
参考93.js

94.vue在v-for时给每项元素绑定事件需要用事件代理吗？为什么？
事件代理的作用主要是2个：将事件代理程序代理到父节点，减少内存占用率；动态生成子节点时能自动绑定事件处理程序到父节点。
使用事件代理的情况监听器数量和内存占用率都比前两者要少。
一般给v-for绑定事件时，都会让节点指向同一个事件处理程序，一定程度上比每生成一个节点都绑定一个不同的事件处理程序性能好，但是监听器的数量仍不会变，所以使用事件代理会更好一点。

95.模拟实现一个深拷贝，并考虑对象相互引用以及Symbol拷贝的情况
参考4-3.js

96.介绍下前端加密的常见场景和方法
HTTPS，加密，爬虫与反爬虫

97.React和Vue的diff时间复杂度从O(n^3)优化到O(n)，那么O(n^3)和O(n)是如何计算出来的？

98.写出如下代码的打印结果
```
// 函数的形参是值的传递，传递对象的话，函数接受的是这个对象的指针。
// weiSite引用地址的值copy给o了
function changeObjProperty(o) {
    // 改变应用地址内的对象属性值
    o.siteUrl = 'http://www.baidu.com';
    // 变量o指向新的地址，以后的变动和旧地址无关
    o = new Object();
    o.siteUrl = 'http://www.google.com';
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl);
```
'http://www.baidu.com'

99.用javascript写一个函数，输入int型，返回整数逆序后的字符串，如输入整型1234，返回字符串'4321'，要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。
参考99.js

100.请写出如下代码的打印结果
```
function Foo() {
    Foo.a = function() {
        console.log(1)
    }
    this.a = function() {
        console.log(2)
    }
}
Foo.prototype.a = function() {
    console.log(3)
}
Foo.a = function() {
    console.log(4)
}
Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```
4 - 2 - 1

101.修改一下print函数，使之输出0-99，或者99-0.要求：只能修改setTimeout到Math.floor(Math.random() * 1000)的代码，不能修改Math.floor(Math.random() * 1000)，不能使用全局变量。
```
function print(n) {
    setTimeout(() => {
        console.log(n);
    }, Math.floor(Math.random() * 1000))
}
for (var i = 0; i < 100; i++) {
    print(i)
}
```
```
function print(n) {
    setTimeout((() => {
        console.log(n);
    })(), Math.floor(Math.random() * 1000))
}
function print(n) {
    setTimeout(console.log(n), Math.floor(Math.random() * 1000))
}
function print(n) {
    setTimeout(() => {
        console.log(n);
    }, 1, Math.floor(Math.random() * 1000))
}
function print(n) {
    setTimeout((() => {
        console.log(n);
    }).apply(n), Math.floor(Math.random() * 1000))
}
for (var i = 0; i < 100; i++) {
    print(i)
}
```

102.不用加减乘除运算符，求整数的7倍
参考102.js

103.模拟实现一个localStorage
参考103.js

104.模拟localStorage时如何实现过期时间功能
略

105.url有三种情况
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800&local_province_id=33
https://www.xx.cn/api?keyword=&level1=&local_batch_id=&elective=800,700&local_province_id=33
匹配elective后的数字输出(写出你认为的最优解法)
[] || ['800'] || ['800', '700']

```
function getUrlValue(url) {
    if (!url) return;
    let res = url.match(/(?<=elective=)(\d+(,\d+)*)/);
    return res ? res[0].split(',') : [];
}
new URLSearchParams(url).get('elective')        // IE不支持
```

106.分别写出如下代码的返回值
String('11') == new String('11')        // true
String('11') === new String('111')      // false
new String返回的是对象，调用==隐式转换使用toString方法

107.考虑到性能问题，如何快速从一个巨大的数组中随机获取部分元素。比如有个数组有100k个元素，从中不重复随机选取10k个元素。
由于随机从100K个数据中随机选取10k个数据，可采用统计学中随机采样点的选取进行随机选取，如在0-50之间生成五个随机数，然后依次将每个随机数进行加50进行取值，性能应该是最好的。

108.写出下面代码运行结果
```
var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
var name提升，先undefined，再赋值
Goodbye Jack

109.写出下面代码运行结果
```
var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```
作用域链上找name
Hello Tom

110.写出一个函数，完成以下功能。输入"1，2，3，5，7，8，10"输出"1~3,5,7~8,10"
参考110.js

111.编程题，把entry转换成如下对象
var entry = {
    a: {
        b: {
            c: {
                dd: 'abcdd'
            }
        },
        d: {
            xx: 'adxx'
        },
        e: 'ae'
    }
}
var output = {
    'a.b.c.dd': 'abcdd',
    'a.d.xx': 'adxx',
    'a.e': 'ae'
}
参考111.js

112.跟111题相反
参考111.js

113.根据以下要求，写一个数组去重函数
1.[123, "meili", "123", "mogu", 123]    =>    [123, "meili", "123", "mogu"]
2.[123, [1, 2, 3], [1, "2", 3], [1, 2, 3], "meili"]     =>      [123, [1, 2, 3], [1, "2", 3], "meili"]
3.[123, {a: 1}, {a: {b: 1}}, {a: "1"}, {a: {b: 1}}, "meili"]    =>    [123, {a: 1}, {a: {b: 1}}, {a: "1"}, "meili"]
参考113.js

114.找出字符串中连续出现最多的字符和个数
'abcaakjbb' => {'a': 2, 'b': 2}
'abbkejsbcccwqaa' => {'c':3}
参考114.js

115.写一个单项链数据结构的js实现并标注复杂度
参考115.js

116.写出以下代码运行结果
1 + "1"         // "11"
2 * "2"         // 4
[1,2] + [2,1]   // "1,22,1"     Javascript中所有对象基本都是先调用valueOf方法，如果不是数值，再调用toString方法。
"a" + + "b"     // "aNaN"   => 理解为  [undefined] + "b" -> NaN   "a" + NaN -> "aNaN"

117.http1.0/1.1/2.0协议的区别
参考117.js





124.永久重定向301和临时重定向302对SEO有什么影响？
301redirect——301代表永久性转译(Permanently Moved)，301重定向是网页更改地址后对搜索引擎友好的最好方法，只要不是临时搬移的情况，都建议使用301来做转址。
如果我们把一个地址采用301跳转方式跳转的话，搜索引擎会把老地址的PageRank等信息待到新地址，同时在搜索引擎索引库中彻底废弃掉原先的老地址。旧网址的排名完全清零。
302redirect——301代表暂时性转移(Temporarily Moved)，在前些年，不少Black Hat SEO曾广泛应用这项技术作弊，目前，各大主要搜索引擎均加强了打击力度，像Google前些年对Business.com以及进来对BMW德国网站的惩罚。即时网站客观上不是spam，也很容易被搜索引擎容易误判为spam而遭到惩罚。

125.如何将[{id: 1}, {id: 2, pId: 1}, ...]的重复数组（有重复数据）转成树形结构的数组 [{id: 1, child: [{id: 2, pId: 1}]}, ...]（需要去重）
参考125.js

126.有一堆扑克牌，将排队第一张放到桌子上，再将接下来的牌堆的第一张放到牌底，如此往复：
最后桌子上的牌顺序为：底-1,2,3,4,5,6,7,8,9,10,11,12,13-顶
问原来那堆牌的顺序，用函数实现
参考126.js

127.如何用css或js实现多行文本溢出省略效果，考虑兼容性
参考127.css

128.http状态码301和302的应用场景分别是什么
参考124.js

129.输出以下代码执行结果
```
function wait() {
    return new Promise(resolve => 
        setTimeout(resolve, 10 * 1000)
    )
}
async function main() {
    console.time();
    const x = wait();
    const y = wait();
    const z = wait();
    await x;
    await y;
    await z;
    console.timeEnd();
}
main();
```
三个任务[x,y,z]发起的时候没有await，可以认为是同时发起了三个异步，之后各自await任务的结果。
结果按照最高耗时计算，由于三个耗时一样，所以结果是10*1000ms
如果const x = await wait(); 就可以得到30*1000ms以上的结果了

130.输出以下代码执行结果
```
function wait() {
    return new Promise(resolve =>
        setTimeout(resolve, 10 * 1000)
    )
}
async function main() {
    console.time();
    await wait();
    await wait();
    await wait();
    console.timeEnd();
}
main();
```
30 * 1000 解释参考129


132.实现一个Dialog类，Dialog可以创建dialog对话框，对话框支持可拖拽
参考132.js

133.用setTimeout实现setInterval，参数实现的效果与setInterval的差异
参考133.js

134.求两个日期中间的有效日期
如2015-2-8到2015-3-3，返回【2015-2-8 2015-2-9...】
参考134.js

135.在一个字符串数组中有红黄蓝三种颜色的球，且个数不相等、顺序不一致，请为该数组排序。使得排序后数组中秋的顺序为：黄、红、蓝
参考135.js


137.如何在H5和小程序项目中计算白屏时间和首屏时间
参考137.js

138.反转链表，每k个节点反转一次，不足k就保持原有顺序
参考138.js


