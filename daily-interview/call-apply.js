// Function.prototype.apply和Function.prototype.call 的作用是一样的，区别在于传入参数的不同；
// 1.第一个参数都是，指定函数体内this的指向；
// 2.第二个参数开始不同，apply是传入带下标的集合，数组或者类数组，apply把它传给函数作为参数，call从第二个开始传入的参数是不固定的，都会传给函数作为参数。
function test(a) {
    console.log(a)
}

test.call(null, 1);         // 1
test.call(null, 1, 2);      // 1

test.apply(null, [1]);      // 1
test.apply(null, [1, 2]);   // 1
test.apply(null, 1);        // error

// call比apply的性能要好，平常可以多用call, call传入参数的格式正是内部所需要的格式