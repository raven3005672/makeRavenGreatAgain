// 防抖函数debounce

// 防抖指的是某个函数在某段时间内，无论触发了多少次回调，都只执行最后一次。
// 假如我们设置了一个等待时间3秒的函数，在这3秒内如果遇到函数调用请求就重新计时3秒，直至新的3秒内没有函数调用请求，此时执行函数，不然就以此类推重新计时。

// 原理及实现
// 实现原理就是利用定时器，函数第一次执行时设定一个定时器，之后调用时发现已经设定过定时器就清空之前的定时器，并重新设定一个新的定时器，如果存在没有被清空的定时器，当定时器计时结束后触发函数执行。

// 实现1——略
// 实现2——增加第一次触发立即执行的功能
function debounce(fn, wait = 50, immediate) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        // 增加部分
        if (immediate && !timer) {
            fn.apply(this, args);
        }
        // 增加部分完
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    }
}
const betterFn = debounce(() => console.log('fn run'), 1000);
document.addEventListener('scroll', betterFn);

// 加强版throttle
// 节流防抖合二为一，关键点在于：wait时间内，可以重新生成定时器，但只要wait的时间到了，必须给用户一个响应。
function throttle(fn, wait) {
    let previous = 0, timer = null;
    return function (...args) {
        let now = +new Date();
        // 新增
        if (now - previous < wait) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                previous = now;
                fn.apply(this, args);
            }, wait);
        // 新增完
        } else {
            previous = now;
            fn.apply(this, args);
        }
    }
}

// underscore源码解析1.9.1版本
_.debounce = function(func, wait, immediate) {
    // timeout表示定时器
    // result表示func执行返回值
    var timeout, result;
    // 定时器计时结束后
    // 1.清空计时器，使之不影响下次连续事件的触发
    // 2.触发执行func
    var later = function(context, args) {
        timeout = null;
        // if (args)判断是为了过滤立即触发的
        // 关联在于_.delay和restArguments
        if (args) result = func.apply(context, args);
    };
    // 将debounce处理结果当作函数返回
    var debounced = restArguments(function(args) {
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 第一次触发后设置timeout
            // 根据timeout是否为空可以判断是否是首次触发
            var callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
        } else {
            // 设置定时器
            timeout = _.delay(later, wait, this, args);
        }
        return result;
    });
    // 手动取消
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
}
// 根据给定的毫秒wait延迟执行函数func
_.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
        return func.apply(null, args);
    }, wait);
});

// 相比上文的基本版实现，undercsore多了以下几点功能
// 函数func的执行结束后返回结果值result
// 定时器即时结束后清除timeout，使之不影响下次连续事件的触发
// 新增了手动取消功能cancel
// immediate为true后只会在第一次触发时执行，频繁触发回调结束后不会再执行
