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
参考deepClone.js




