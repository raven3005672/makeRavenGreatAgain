function f1(callback) {
    console.log('f1 start');
    setTimeout(function() {
        // f1的任务代码
        callback();
    }, 1000);
    console.log('f1 end');
}

function f2() {
    console.log('f2 run');
}

console.log('node test callback');
f1(f2);