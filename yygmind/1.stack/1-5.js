// 垃圾回收算法
// 常用垃圾回收算法叫做“标记清除（Mark-and-sweep）”，算法由以下几步组成：
// 1、垃圾回收器创建了一个“roots”列表。roots通常是代码汇总全局变量的引用。javascript中，“window”对象是一个全局变量，被当作root。window对象总是存在，因此垃圾回收器可以检查它和它的所有子对象是否存在（即不是垃圾）；
// 2、所有的roots被检查和标记为激活（即不是垃圾）。所有的子对象也被递归地检查。从root开始的所有对象如果是可达的，它就不被当做垃圾。
// 3、所有未被标记的内存会被当做垃圾，收集器现在可以释放内存，归还给操作系统了。
// 现代的垃圾回收器改良了算法，但是本质是相同的：可达内存被标记，其余的被当做垃圾回收。


// 四种常见的JS内存泄漏
// 1、意外的全局变量
// 未定义的变量会在全局对象创建一个新变量，如下
function foo(arg) {
    bar = 'this is a hidden global variable';
}
// 函数foo内部忘记使用var，实际上JS会把bar挂载到全局对象上，意外创建一个全局变量。
function foo(arg) {
    window.bar = 'this is an explicit global variable';
}
// 另一个意外的全局变量可能由this创建。
function foo() {
    this.variable = 'potential accidental global';
}
// foo调用自己，this指向了全局对象（window）
// 而不是undefined
foo();
// 解决办法：在javascript文件头部加上'use strict'，使用严格模式避免意外的全局变量，此时上例中的this指向undefined。如果必须使用全局变量存储大量数据时，确保用完以后把它设置为null或者重新定义。

// 2、被遗忘的计时器或回调函数
// 计时器setInterval代码很常见
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if (node) {
        // 处理node和someResource
        node.innerHTML = JSON.stringify(someResource);
    }
}, 1000);
// 上面的例子表明，在节点node或者数据不再需要时，定时器依旧指向这些数据。所以哪怕当node节点被移除后，interval依然存活并且垃圾回收器没办法回收，它的依赖也没办法被回收，除非终止定时器。
var element = document.getElementById('button');
function onClick(event) {
    element.innerHTML = 'text';
}
element.addEventListener('click', onClick);
// 对于上面观察者的例子，一旦它们不再需要（或者关联的对象变成不可达），明确地移除它们非常重要。老的IE6是无法处理循环引用的。因为老版本的IE是无法检测DOM节点与JavaScript代码之间的循环引用，会导致内存泄漏。
// 但是，现代的浏览器（包括IE和Microsoft Edge）使用了更先进的垃圾回收算法（标记清除），已经可以正确检测和处理循环引用了。即回收节点内存时，不必非要调用removeEventListener了。

// 3、脱离DOM的引用
// 如果把DOM存成字典（JSON键值对）或者数组，此时，同样的DOM元素存在两个引用：一个在DOM树中，另一个在字典中。那么将来需要把两个引用都清除。
var elements = {
    button: document.getElementById('button'),
    image: document.getElementById('image'),
    text: document.getElementById('text')
}
function doStuff() {
    iamge.src = 'http://some.url/image';
    button.click();
    console.log(text.innerHTML);
}
function removeButton() {
    // 按钮是body的后代元素
    document.body.removeChild(document.getElementById('button'));
    // 此时，依旧存在一个全局的#button的引用
    // elements字段，button元素依旧在内存中，不能被GC回收。
}
// 如果代码中保存了表格某一个<td>的引用。将来决定删除整个表格的时候，直觉认为GC会回收除了已保存的<td>以外的其它节点。
// 实际情况并非如此：此<td>是表格的子节点，子元素与父元素是引用关系。由于代码保留了<td>的引用，导致整个表格仍待在内存中。所以保存DOM元素引用的时候，要小心谨慎。

// 4、闭包
// 闭包的关键是匿名函数可以访问父级作用域的变量。
var theThing = null;
var replaceThing = function() {
    var originalThing = theThing;
    var unused = function() {
        if (originalThing) {
            console.log('hi');
        }
    }
    theThing = {
        longStr: new Array(100000).join('*'),
        someMethod: function() {
            console.log(someMessage);
        }
    }
}
setInterval(replaceThing, 1000);
// 每次调用replaceThing，theThing得到一个包含一个大数组和一个新闭包（someMethod）的新对象。同时，变量unused是一个引用originalThing的闭包（先前的replaceThing又调用了theThing）。
// someMethod可以通过theThing使用，someMethod与unused分享闭包作用域，尽管unused从未使用，它引用的originalThing迫使它保留在内存中（防止被回收）。
// 解决办法：在replaceThing的最后添加originThing = null；



// 思考输出结果
{/* <script>
    console.log(fun)        // err
    console.log(person)     // 不会执行
</script>
<script>
    console.log(person)     // undefined    变量提升
    console.log(fun)        // fun() {...}  变量提升
    var person = "Eric";
    console.log(person)     // Eric
    function fun() {
        console.log(person) // undefined    重新定义
        var person = "Tom";
        console.log(person) // Tom
    }
    fun()
    console.log(person)     // Tom
</script> */}

// 第一个script里，fun就报错了，不会执行person
// 第二个script里，







