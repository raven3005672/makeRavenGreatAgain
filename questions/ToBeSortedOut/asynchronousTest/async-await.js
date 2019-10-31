function step1() {
    console.log('step1')
    return 1;
}
function step2(value) {
    console.log('step2', value)
    // return 2;
}
function step3(value) {
    console.log('step3', value)
    // return 3
}
function step4(value) {
    console.log('step4', value)
    // return 4
}

async function longRunningTask() {
    try {
        var value1 = await step1();
        var value2 = await step2(value1);
        var value3 = await step3(value2);
        var value4 = await step4(value3);
    } catch(e) {
        console.log(e)
    }
}

longRunningTask();