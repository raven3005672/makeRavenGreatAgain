function f1(a) {
    return new Promise(function(resolve, reject) {
        if (a) {
            resolve('111');
        } else {
            reject('222');
        }
    });
}

var x;

f1(x)
.then(function(res) {
    console.log('res',res)
    return res; // te
})
.then(function(te) {
    console.log('te',te)
})
.catch(function(err) {
    console.error('err',err)
})