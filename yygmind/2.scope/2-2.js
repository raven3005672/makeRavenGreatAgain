// 从作用域链理解闭包
// 红宝书定义：闭包是指有权访问另外一个函数作用域中的变量的函数。
// MDN定义：闭包是指那些能够访问自由变量的函数。
// 其中自由变量，指在函数中使用的，但即不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。
function getOuter() {
    var date = '1127';
    function getDate(str) {
        console.log(str + date);
    }
    return getDate('今天是: ');
}
getOuter();
// 其中date既不是参数arguments，也不是局部变量，所以date是自由变量。
// 总结起来就是下面两点：
// 1.是一个函数（比如，内部函数从父函数中返回）
// 2.能访问上级函数作用域中的变量（哪怕上级函数上下文已经销毁）

// 分析
var scope = 'global scope';
function checkscope() {
    var scope = 'local scope';
    function f() {
        return scope;
    }
    return f;
}
var foo = checkscope();
foo();
// 简要的执行过程如下：图2-2-1
// 1.进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
// 2.全局执行上下文初始化
// 3.执行checkscope函数，创建checkscope函数执行上下文，checkscope执行上下文被压入执行上下文栈
// 4.checkscope执行上下文初始化，创建变量对象、作用域链、this等
// 5.checkscope函数执行完毕，checkscope执行上下文从执行上下文栈中弹出
// 6.执行f函数，创建f函数执行上下文，f执行上下文北亚茹执行上下文栈
// 7.f执行上下文初始化，创建变量对象、作用域链、this等
// 8.f函数执行完毕，f函数上下文从执行上下文栈中弹出

// 函数f执行的时候，checkscope函数上下文已经被销毁了，函数f执行上下文维护了一个作用域链，会指向checkscope作用域，作用域链是一个数组，结构如下。
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
    // ...
}
// 所以指向关系是当前作用域 -> checkscope作用域 -> 全局作用域，即使checkscopeContext被销毁了，但是javascript依然会让checkscopeContext.AO(活动对象)活在内存中，f函数依然可以通过f函数的作用域链找到它，这就是闭包实现的关键。


// 概念
// 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
// 从实践角度：以下函数才算是闭包：
// -即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
// -代码中引用了自由变量


// 常见问题
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = function() {
        console.log(i);
    };
}
data[0]();
data[1]();
data[2]();
// 答案都是3
// 循环结束后，全局执行上下文的VO是
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
// 执行data[0]函数的时候，data[0]函数的作用域链为：
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
// 由于其自身没有i变量，就会向上查找，所有从全局上下文查找到i为3，data[1]和data[2]是一样的

// 解决办法
// 改成闭包，方法就是data[i]返回一个函数，并访问变量i
var data = [];
for (var i = 0; i < 3; i++) {
    data[i] = (function (i) {
        return function() {
            console.log(i);
        }
    })(i);
}
data[0]();
data[1]();
data[2]();
// 循环结束后的全局执行上下文没有变化。
// 执行data[0]函数的时候，data[0]函数的作用域链发生了改变：
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO, globalContext.VO]
}
// 匿名函数执行上下文的AO为：
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
// 因为闭包执行上下文中存储了变量i，所以根据作用域链会在globalContext.VO中查找到变量i，并输出0。


// 更改写法var变成let
var data = [];

for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
// 0 1 2



