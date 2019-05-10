/*
LazyMan('Tony');
// Hi I am Tony
LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch
LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner
LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
*/

class LazyManClass {
    constructor(name) {
        this.taskList = [];
        this.name = name;
        console.log(`Hi I am ${this.name}`);
        setTimeout(() => {
            this.next();
        }, 0);
    }
    eat (name) {
        let that = this;
        let fn = (function(n) {
            return function() {
                console.log(`I am eating ${n}`);
                that.next();
            }
        })(name);
        this.taskList.push(fn);
        return this;
    }
    sleepFirst(time) {
        let that = this;
        let fn = (function(t) {
            return function() {
                setTimeout(() => {
                    console.log(`等待了${t}秒...`);
                    that.next();
                }, t * 1000);
            }
        })(time);
        this.taskList.unshift(fn);
        return this;
    }
    sleep(time) {
        let that = this;
        let fn = (function(t) {
            return function() {
                setTimeout(() => {
                    console.log(`等待了${t}秒...`);
                    that.next();
                }, t * 1000);
            }
        })(time);
        this.taskList.push(fn);
        return this;
    }
    next() {
        let fn = this.taskList.shift();
        fn && fn();
    }
}
function LazyMan(name) {
    return new LazyManClass(name);
}

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');