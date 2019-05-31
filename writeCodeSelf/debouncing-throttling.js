// 防抖debouncing
// 当一次事件发生后，事件处理器要等一定阈值的时间，如果这段时间过去后再也没有事件发生，就处理最后一次发生的事件。
// 如果在等待时间内发生了新事件，则重新等待指定时间。
function debounce(fn, wait = 50, immediate) {
    let timer;
    return function () {
        if (immediate) {
            fn.apply(this, arguments);
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, wait);
    }
}

// 节流throttling
// 将一个函数的调用频率限制在一定阈值内
function throttle(fn, wait) {
    let prev = new Date();
    return function () {
        const args = arguments;
        const now = new Date();
        if (now - prev > wait) {
            fn.apply(this, args);
            prev = new Date();
        }
    }
}


const throttleOrDebounce = function (fn, delay, isDebounce) {
    let timer
    let lastCall = 0
    return function (...args) {
        if (isDebounce) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                fn(...args)
            }, delay)
        } else {
            const now = new Date().getTime()
            if (now - lastCall < delay) return
            lastCall = now
            fn(...args)
        }
    }
}