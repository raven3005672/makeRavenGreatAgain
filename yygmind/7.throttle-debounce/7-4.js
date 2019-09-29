// 防抖函数debounce

// 代码结构
function debounce(func, wait, options) {
    // 通过闭包保存一些变量
    let lastArgs,       // 上一次执行debounced的arguments，起一个标记位的作用，用于trailingEdge方法，invokeFunc后清空
        lastThis,       // 保存上一次this
        maxWait,        // 最大等待时间，数据来源与options，实现节流效果，保证大于一定时间后一定能执行
        result,         // 函数func执行后的返回值，多次触发但未满足执行func条件时，返回result
        timerId,        // setTimeout生成的定时器句柄
        lastCallTime;   // 上一次调用debounce的时间
    let lastInvokeTime = 0;         // 上一次执行func的时间，配合maxWait多用于节流相关
    let leading = false;            // 是否响应事件刚开始的那次回调，即第一次触发，false时忽略
    let maxing = false;             // 是否有最大等待时间，配合maxWait多用于节流相关
    let trailing = true;            // 是否响应事件结束后的那次回调，即最后一次触发，false时忽略
    // 没传wait时调用window.requestAnimationFrame()
    // window.requestAnimationFrame()告诉浏览器希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画，差不多16ms执行一次
    const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function');
    // 保证输入的func是函数，否则报错
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    // 转成Number类型
    wait = +wait || 0;
    // 获取用户传入的配置options
    if (isObject(options)) {
        leading = !!options.leading;
        // options中是否有maxWait属性，节流函数预留
        maxing = 'maxWait' in options;
        // maxWait为设置的maxWait和wait中最大的，如果maxWait小于wait，那maxWait就没有意义了
        maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    // 开闭定时器
    // 开启定时器
    // 防抖和节流的核心还是使用定时器，当事件触发时，设置一个执行超时时间的定时器，并传入回调函数，此时的回调函数pendingFunc其实就是timerExpired，这里区分两种情况，一种是使用requestAnimationFrame，另一种是使用setTimeout
    function startTimer(pendingFunc, wait) {
        // 没传wait时调用window.requestAnimationFrame()
        if (useRAF) {
            // 若想在浏览器下次重绘之前继续更新下一帧动画
            // 那么回调函数自身必须再次调用window.requestAnimationFrame()
            root.cancelAnimationFrame(timerId);
            return root.requestAnimationFrame(pendingFunc);
        }
        // 不使用RAF时开启定时器
        return setTimeout(pendingFunc, wait);
    }
    // 取消定时器
    // 关闭定时器只要区分好RAF和非RAF时的情况即可，取消时传入时间id
    function cancelTimer(id) {
        if (useRAF) {
            return root.cancelAnimationFrame(id);
        }
        clearTimeout(id);
    }
    // 定时器回调函数，表示定时结束后的操作
    // startTimer函数中传入的回调函数pendingFunc其实就是定时器回调函数timerExpired，表示定时结束后的操作
    // 定时结束后无非两种情况，一种是执行传入函数func，另一种就是不执行。对于第一种需要判断下是否需要执行传入函数func，需要的时候执行最后一次回调。对于第二种计算剩余等待时间并重启定时器，保证下一次时延的末尾触发
    function timerExpired() {
        const time = Date.now();
        // 1.是否需要执行
        // 执行事件结束后的那次回调，否则重启定时器
        if (shouldInvoke(time)) {
            return trailingEdge(time);
        }
        // 2.否则 计算剩余等待时间，重启定时器，保证下一次时延的末尾触发
        timerId = startTimer(timerExpired, remainingWait(time));
    }
    // 计算仍需等待的时间
    function remainingWait(time) {
        // 单钱事件距离上一次调用debounce的时间差
        const timeSinceLastCall = time - lastCallTime;
        // 当前时间距离上一次执行func的时间差
        const timeSinceLastInvoke = time - lastInvokeTime;
        // 剩余等待时间
        const timeWaiting = wait - timeSinceLastCall;
        // 是否设置了最大等待时间
        // 是(节流)：返回【剩余等待时间】和【距上次执行func的剩余等待时间】中的最小值
        // 否：返回剩余等待时间
        return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    // 执行传入函数
    // 执行连续事件刚开始的那次回调，即事件刚触发就执行，不再等待wait时间之后，在这个方法里主要有三步。
    // 设置上一次执行func上的时间lastInvokeTime、开启定时器、执行传入函数func
    function leadingEdge(time) {
        // 1.设置上一次执行func的时间
        lastInvokeTime = time;
        // 2.开启定时器，为了事件结束后的那次回调
        timerId = startTimer(timerExpired, wait);
        // 3.如果配置了leading执行传入函数func
        // leading来源自!!options.leading
        return leading ? invokeFunc(time) : result;
    }
    // 执行连续事件结束后的那次回调
    function trailingEdge(time) {
        // 清空定时器
        timerId = undefined;
        // trailing和lastArgs两者同时存在时执行
        // trailing来源自'trailing' in oprtions ? !!options.trailing : trailing
        // lastArgs标记位的作用，意味着debounce至少执行过一次
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        // 清空参数
        lastArgs = lastThis = undefined;
        return result;
    }
    // 执行func函数
    function invokeFunc(time) {
        // 获取上一次执行debounced的参数
        const args = lastArgs;
        // 获取上一次的this
        const thisArg = lastThis;
        // 重置
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    // 判断此时是否应该执行func函数
    function shouldInvoke(time) {
        // 当前时间距离上一次调用debounce的时间差
        const timeSinceLastCall = time - lastCallTime;
        // 当前时间距离上一次执行func的时间差
        const timeSinceLastInvoke = time - lastInvokeTime;
        
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
    }
    // 对外3个方法
    // 取消函数延迟执行，清除定时器，清除必要的闭包变量，回归初始状态
    function cancel() {
        // 清除定时器
        if (timerId !== undefined) {
            cancelTimer(timerId);
        }
        // 清除闭包变量
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    // 立即执行func
    // 如果不存在定时器，意味着还没有触发事件或者事件已经执行完成，则此时返回result结果
    // 如果存在定时器，立即执行trailingEdge，执行完成后会清空定时器id，lastArgs和lastThis
    function flush() {
        return timerId === undefined ? result : trailingEdge(Date.now());
    }
    // 检查当前是否在计时中
    function pending() {
        return timerId !== undefined;
    }
    // 入口函数
    // 事件每次触发后都会执行debounced函数，而且会频繁的执行，所以在这个方法里需要[判断是否应该执行传入函数func]，然后根据条件开启定时器，debounced函数做的就是这件事。
    function debounced(...args) {
        // 获取当前时间
        const time = Date.now();
        // 判断此时是否应该执行func函数
        const isInvoking = shouldInvoke(time);
        // 赋值给闭包，用于其他函数调用
        lastArgs = args;
        lastThie = this;
        lastCallTime = time;
        // 执行
        if (isInvoking) {
            // 无timerId的情况有两种：
            // 1.首次调用
            // 2.trailingEdge执行过函数
            if (timerId === undefined) {
                return leadingEdge(lastCallTime);
            }
            // 如果设置了最大等待时间，则立即执行func
            // 1.开启定时器，到时间后触发trailingEdge这个函数
            // 2.执行func，并返回结果
            if (maxing) {
                // 循环定时器中处理调用
                timerId = startTimer(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        // 一种特殊情况，trailing设置为true时，前一个wait的trailingEdge已经执行了函数
        // 此时函数被调用时shouldInvoke返回false，所以要开启定时器
        if (timerId === undefined) {
            timedId = startTimer(timerExpired, wait);
        }
        // 不需要执行时，返回结果
        return result;
    }
    // 绑定方法
    debounced.cancel = cancel;
    debounced.flush = flush;
    debounced.pending = pending;
    // 返回入口函数
    return debounced;
}


// 节流函数throttle
// 相比防抖来说只是触发条件不同，说白了就是maxWait为wait的防抖函数
function throttle(func, wait, options) {
    // 首尾调用默认为true
    let leading = true;
    let trailing = true;
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    // options是否是对象
    if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    // maxWait为wait的防抖函数
    return debounce(func, wait, {
        leading,
        trailing,
        'maxWait': wait
    });
}

function isObject(value) {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}


// 思考
// 如果leading和trailing选项都是true，在wait期间只调用了一次debounce函数时，总共会调用几次func，1次还是2次？为什么？
// 如何给debounce(func, time, options)中的func传参数

