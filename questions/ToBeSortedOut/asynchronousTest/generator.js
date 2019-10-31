function* testGenerator() {
    yield 'hello';
    yield 'world';
    // return 'xxx';
    yield 'ending';
}

var test = testGenerator();
console.log(test.next());
console.log(test.next());
console.log(test.next());
console.log(test.next());


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

function* longRunningTask() {
    try {
        var value1 = yield step1();
        var value2 = yield step2(value1);
        var value3 = yield step3(value2);
        var value4 = yield step4(value3);
    } catch (e) {
        console.log(e)
    }
}

function trigger(task) {
    setTimeout(function() {
        var taskObj = task.next(task.value);
        if (!taskObj.done) {
            task.value = taskObj.value;
            trigger(task);
        }
    }, 0)
}

trigger(longRunningTask());