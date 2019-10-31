const event = {
    clientList: [], // 这里{}也可
    listen: function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger: function() {
        const key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    },
    remove: function(key, fn) {
        var fns = this.clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    fns.splice(i, 1);
                }
            }
        }
    }
}

var testObj = {};
// es6
// Object.assign(testObj, event);
// es5
const installEvent = function(obj) {
    for (var i in event) {
        if (event.hasOwnProperty(i)) {
            obj[i] = event[i];
            // console.log(i,event[i])
        }
    }
};
installEvent(testObj);

testObj.listen('aaa', function() {
    console.log('aaa');
    console.log('bbb');
});
testObj.listen('aaa', function() {
    console.log('test')
})

testObj.trigger('aaa');
