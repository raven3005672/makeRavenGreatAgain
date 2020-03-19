var _fib_ = (function () {
    let cache = {};
    return function(n,a1=1,a2=1) {
        if (cache[n]) return cache[n];
        if (n <= 1) return a2;
        return cache[n] = _fib_(n-1,a2,a1+a2);
    }
})()

console.log(_fib_(86))