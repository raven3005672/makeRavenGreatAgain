setTimeout(() => {
    console.log('timeout0');
    Promise.resolve().then(() => {
        console.log('p1')
    });
    process.nextTick(() => {
        console.log('nextTick1');
        process.nextTick(() => {
            console.log('nextTick2');
        });
    });
    Promise.resolve().then(() => {
        console.log('p2')
    });
    process.nextTick(() => {
        console.log('nextTick3');
    });
    console.log('sync');
    setTimeout(() => {
        console.log('timeout2');
    }, 0);
}, 0);