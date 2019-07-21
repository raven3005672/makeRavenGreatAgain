// 7个角度吃透lodash防抖节流原理

// 节流函数Throttle
// 1
lodash.throttle(fn, 200, {leading: true, trailing: true})
// 头触发，每次尾-触发当前

// 2
lodash.throttle(fn, 200, {leading: true, trailing: false})
// 头触发，每次尾-触发下一个

// 3
lodash.throttle(fn ,200, {leading: false, trailing: true})
// 头不触发，每次尾-触发当前

// 防抖函数Debounce
// 4
lodash.debounce(fn, 200, {leading: false, trailing: true})
// 头不触发，尾触发

// 5
lodash.debounce(fn, 200, {leading: true, trailing: false})
// 头触发，尾不触发

// 6
lodash.debounce(fn, 200, {leading: true, trailing: true})
// 头触发，尾触发

// 7
lodash.debounce(fn, 200, {leading: false, trailing: true, maxWait: 400})
// 头不触发，尾触发，中间等待效果类似节流

