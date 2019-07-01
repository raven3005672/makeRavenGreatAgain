// bind
// bind方法会创建一个新函数，当这个新函数被调用时，它的this值会传递给bind的第一个参数，传入bind方法的第二个以及以后的参数加上绑定函数运行时本身的参数，按照顺序作为原函数的参数来调用原函数。
// bind返回的绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器，提供的this值被忽略，同事调用时的参数被提供给模拟函数。

// fun.bind(thisArg[, arg1[, args[, ...]]])
// bind方法与call/apply最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。

// bind有如下特性：可以指定this；返回一个函数；可以传入参数；柯里化

// 使用场景
// 1.业务场景
// 2.验证是否是数组
// 3.柯里化

// 模拟实现
// 模拟实现第一步：指定this + 返回一个函数
Function.prototype.bind2 = function(context) {
    var self = this;
    return function() {
        return self.apply(context);
    }
}
// 模拟实现第二步：可以传入参数 + 获取返回的参数合并参数数组
Function.prototype.bind2 = function(context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}
// 模拟实现第三步：bind返回的函数也能使用new操作符创建对象，这种行为就像把原函数当做构造器，提供的this值被忽略，同时调用时的参数被提供给模拟函数。
Function.prototype.bind2 = function(context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fBound = function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数使用时，this指向实例，测试this instanceof fBound结果为true，可以让实例获得来自绑定函数的值
        // 当作为普通函数时，this指向window，测试结果为false，将绑定函数的this指向context
        return self.apply(
            this instanceof fBound ? this : context,
            args.concat(bindArgs)
        );
    }
    // 修改返回函数的prototype为绑定函数的prototype，实例就可以继承绑定函数的原型中的值。
    fBound.prototype = this.prototype;
    return fBound;
}
// 模拟实现第四步：fBound.prototype = this.prototype有一个缺点，直接修改fBound.prototype的时候，也会直接修改this.prototype
Function.prototype.bind2 = function(context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(
            this instanceof fNOP ? this : context,
            args.concat(bindArgs)
        );
    }
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
// 模拟实现第五步：调用bind的不是函数，这时候需要抛出异常
Function.prototype.bind2 = function (context) {
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};
    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}









