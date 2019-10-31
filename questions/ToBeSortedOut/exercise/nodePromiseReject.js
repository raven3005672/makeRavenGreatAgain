let rejected;

process.on("unhandledRejection", function(reason, promise) {
    console.log('uncatch', reason.message);
    console.log(rejected === promise);
});

process.on("rejectionHandled", function(promise) {
    console.log(rejected === promise);
});

rejected = Promise.reject(new Error('Explosion!'))
// 添加以下代码则两者都不触发
// .catch((err) => {
//     console.log('imd', err.message)
// });

setTimeout(function() {
    rejected.catch(function(value) {
        console.log('catch', value.message);
    });
}, 2000);

// 拒绝跟踪器
let possiblyUnhandledRejections = new Map();

process.on("unhandledRejection", function(reason, promise) {
    possiblyUnhandledRejections.set(promise, reason);
});

process.on("rejectionHandled", function(promise) {
    possiblyUnhandledRejections.delete(promise);
});

setInterval(function() {
    possiblyUnhandledRejections.forEach(function(reason, promise) {
        console.log(reason.message ? reason.message : reason);
        // some handle
        handleRejection(promise, reason);
    });
    possiblyUnhandledRejections.clear();
}, 60000);
