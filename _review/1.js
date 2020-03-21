Promise.all = function(ps) {
    return new Promise((resolve, reject) => {
        if (ps.length === 0) {
            resolve([])
        } else {
            let result = [];
            let index = 0;
            for (let i = 0; i < ps.length; i++) {
                Promise.resolve(ps[i]).then(data => {
                    result[i] = data;
                    if (++index === ps.length) {
                        resolve(result);
                        // return;
                    }
                }, err => {
                    reject(err);
                    return;
                });
            }
        }
    })
}



Promise.prototype.finally = function(callback) {
    return this.then(
        value => Promise.resolve(callback()).then(() => value),
        error => Promise.resolve(callback()).then(() => {throw error})
    )
}

class eventEmitter {
    constructor() {}
    on(event, cb) {
        if (!this.eventPool) this.eventPool = {};
        this.eventPool[event] ? this.eventPool[event].push(cb) : this.eventPool[event] = [cb]
    }
    off(event) {
        if (this.eventPool[event]) {
            delete this.eventPool[event];
        }
    }
    emit(event, ...args) {
        if (this.eventPool[event]) {
            for (let i = 0; i < this.eventPool[event].length; i++) {
                this.eventPool[event][i](...args);
            }
        }
    }
    once(event, cb) {
        this.on(event, (...args) => {
            cb(...args);
            this.off(event);
        })
    }
}