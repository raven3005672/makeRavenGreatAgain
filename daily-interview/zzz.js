Number.prototype.add = function(n) {
    return this + n;
}
Number.prototype.minus = function(n) {
    return this - n;
}
console.log((5).add(2).minus(1))