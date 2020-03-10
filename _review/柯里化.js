function add() {
    // var tmpSlice = [].slice,
    //     params = tmpSlice.apply(arguments);
    var params = Array.prototype.slice.call(arguments);
    function currying() {
        // var arr = tmpSlice.apply(arguments);
        var arr = Array.prototype.slice.call(arguments);
        params = params.concat(arr);
        return currying;
    }
    currying.toString = function() {
        return params.reduce((a,b) => {
            return a + b;
        }, 0);
    };
    return currying;
}

console.log(add(1,2))
console.log(add(1)(2)(3,4,5))