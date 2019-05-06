var b = 10;
(function b() {
    b = 20;
    console.log(b);
})();

// print 10
var b = 10;
(function b(b) {
    console.log(b);
    b = 20;
})(b);

// print 20
var b = 10;
(function b() {
    var b = 20;
    console.log(b);
})();

var b = 10;
(function a() {
    b = 20;
    console.log(b);
})();

var b = 10;
(function () {
    b = 20;
    console.log(b);
})();