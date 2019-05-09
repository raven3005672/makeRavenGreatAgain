// 测试
const sleep = (time) => {
    return new Promise(resolve => setTimeout(() => resolve(100), time))
}
async function sleepAsync() {
    console.log('fuck the code');
    let a = await sleep(5000);
    console.log('fuck the code again', a);
}

sleepAsync();
console.log('noraml')


// 四种方式
// Promise
const sleep = time => {
    return new Promise(resolve => setTimeout(resolve, time));
}
sleep(1000).then(() => {
    console.log(1)
});

// Generator
function* sleepGenerator(time) {
    yield new Promise(function(resolve, reject) {
        setTimeout(resolve, time);
    })
}
sleepGenerator(1000).next().value.then(() => {
    console.log(1)
})

// async
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function output() {
    let out = await sleep(1000);
    console.log(1);
    return out;
}
output();

// ES5
function sleep(callback, time) {
    if (typeof callback === 'function') {
        setTimeout(callback, time);
    }
}
function output() {
    console.log(1);
}
sleep(output, 1000);