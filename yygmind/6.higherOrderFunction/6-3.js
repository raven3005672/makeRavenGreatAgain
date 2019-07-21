// 深入浅出节流函数throttle

// 函数节流指的是某个函数在一定时间间隔内(例如3秒)只执行一次，在这3秒内无视后来产生的函数调用请求，也不会延长时间间隔。
// 3秒间隔结束后第一次遇到新的函数调用会触发执行，然后在这新的3秒内依旧无视后来产生的函数调用请求，以此类推。

// 原理及实现
// 函数节流非常适合用于函数被频繁调用的场景，例如：window.onresize事件，mousemove事件，上传进度等情况。
// 实现方案有以下两种
// 第一种是用时间戳来判断是否已到执行时间，记录上次执行的时间戳，然后每次触发事件执行回调，回调中判断当前时间戳距离上次执行时间戳的间隔是否已经达到时间差，如果是则执行，并更新上次执行的时间戳，如此循环。
// 第二种方法是使用定时器，比如当scroll事件刚触发时，打印一个xxx，然后设置个1000ms的定时器，伺候每次触发scroll事件触发回调，如果存在定时器，则回调不执行方法，直到定时器触发，handler被清除，然后重新设置定时器。

// 使用方案1
const throttle = (fn, wait) => {
    // 上一次执行fn的时间
    let previous = 0;
    // 将throttle处理结果当做函数返回
    return function(...args) {
        // 获取当前时间，转换成时间戳，单位毫秒
        let now = +new Date();
        // 将当前时间和上一次执行函数的时间进行对比
        // 大于等待时间就把previous设置为当前时间并执行函数fn
        if (now - previous > wait) {
            previous = now;
            // 执行fn函数
            fn.apply(this, args);
        }
    }
}
// 执行throttle函数返回新函数
const betterFn = throttle(() => console.log('fn run'), 1000);
// 每10毫秒执行一次betterFn函数，但是只有时间差大于1000时才会执行fn
setInterval(betterFn, 10);


// underscore源码解读
// underscore实现了两个新增的功能
// 配置是否需要响应事件刚开始的那次回调(leading参数，false时忽略)
// 配置是否需要响应事件结束后的那次回调(trailing参数，false时忽略)
// 配置{leading: false}时，事件刚开始的那次回调不执行；配置{trailing：false}时，事件结束后的那次回调不执行，不过需要注意的是，这两者不能同时配置。
// 所以在underscore中的节流函数有3中调用方式，默认的(有头有尾)，设置{leading: false}的，以及设置{trailing: false}的。
// underscore采用两种方案搭配使用来实现功能
const throttle = function(func, wait, options) {
    var timeout, context, args, result;
    // 上一次执行回调的时间戳
    var previous = 0;
    // 无传入参数时，初始化options为空对象
    if (!options) options = {};
    var later = function() {
        // 当设置{leading: false}时
        // 每次触发回调函数后设置previous为0
        // 不然为当前时间
        previous = options.leading === false ? 0 : _.now();
        // 防止内存泄漏，置为null便于后面根据!timeout设置新的timeout
        timeout = null;
        // 执行函数
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    // 每次触发事件回调都执行这个函数
    // 函数内判断是否执行func
    // func才是我们业务层代码想要执行的函数
    var throttled = function() {
        // 记录当前时间
        var now = _.now();
        // 第一次执行时（此时previous为0，之后为上一次时间戳）
        // 并且设置了{leading: false}（表示第一次回调不执行）
        // 此时设置previous为当前值，表示刚执行过，本次就不执行了
        if (!previous && options.leading === false) previous = now;
        // 距离下次触发func还需要等待的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // 要么是到了间隔时间了，随机触发方法(remaining <= 0)
        // 要么是没有传入{leading: false}，且第一次触发回调，即立即触发
        // 此时previous为0，wait - (now - previous)也满足 <= 0
        // 之后便会把previous值迅速置为now
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                // clearTimeout(timeout)并不会把timeout设为null
                // 手动设置，便于后续判断
                timeout = null;
            }
            // 设置previous为当前时间
            previous = now;
            // 执行func函数
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            // 最后一次需要触发的情况
            // 如果已经存在一个定时器，则不会进入该if分支
            // 如果{trailing: false}，即最后一次不需要出发了，也不会进入这个分支
            // 间隔时间remaining milliseconds后触发later方法
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
    // 手动取消
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    // 执行_.throttle返回throttled函数
    return throttled;
}

