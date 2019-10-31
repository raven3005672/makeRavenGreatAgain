var async = require('async');
const init = 100;
function add(callback) {
    var num = init || 100;
    var result = num + 1;
    callback(null, result);
}
function minus(num, callback) {
    var result = num - 2;
    callback(null, result);
}
function multiply(num, callback) {
    var result = num * 3;
    callback(null, result);
}
function divide(num, callback) {
    var result = num / 4;
    callback(null, result);
}
async.waterfall([
    add,
    minus,
    multiply,
    divide
], function(err, result) {
    console.log(result)
})
