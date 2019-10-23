function wait() {
    return new Promise(resolve => 
        setTimeout(resolve, 10 * 1000)
    )
}
async function main() {
    console.time();
    const x = wait();
    const y = wait();
    const z = wait();
    await x;
    await y;
    await z;
    console.timeEnd();
}
main();
// 10 * 1000

// 三个任务[x,y,z]发起的时候没有await，可以认为是同时发起了三个异步，之后各自await任务的结果。
// 结果按照最高耗时计算，由于三个耗时一样，所以结果是10*1000ms
// 如果const x = await wait(); 就可以得到30*1000ms以上的结果了

function wait() {
    return new Promise(resolve =>
        setTimeout(resolve, 10 * 1000)
    )
}
async function main() {
    console.time();
    await wait();
    await wait();
    await wait();
    console.timeEnd();
}
main();
// 30 * 1000