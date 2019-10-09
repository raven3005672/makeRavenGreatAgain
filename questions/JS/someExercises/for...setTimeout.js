for (var i = 0; i < 10; i++) {
	setTimeout(() => {
		console.log(i);
    }, 1000)
}

// 方法1
// 利用setTimeout函数的第三个参数，会作为回调函数的第一个参数传入
for (var i = 0; i < 10; i++) {
    setTimeout(i => {
        console.log(i)
    }, 1000, i);
}
for (var i = 0; i < 10; i++) {
    setTimeout(console.log, 1000, i);
}
// 利用bind函数部分执行的特性
for (var i = 0; i < 10; i++) {
    setTimeout(console.log.bind(Object.create(null), i), 1000)
}

// 方法2
// 利用let变量块级作用域
for (let i = 0; i < 10; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}

// 方法3
// 利用函数自执行的方式，把当前for循环过程中的i传递进去，构建出块级作用域IIFE
for (var i = 0; i < 10; i++) {
    (i => {
        setTimeout(() => {
            console.log(i);
        }, 1000);
    })(i);
}

