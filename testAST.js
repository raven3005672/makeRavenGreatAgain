var esprima = require('esprima');
var UglifyJS = require('uglify-js');
var code = function a () {
    let a = 1;
    let b = 2;
    let c = 3;
    let d = 45;
        if (a > 0) {
            return a;
        } else {
            return (a+b+c+d);
        }
}


// var ast = esprima.parse(code);
// console.log(ast)
// console.log('*'.repeat(50))
// var token = esprima.tokenize(code);
// console.log(token)
console.log(UglifyJS.parse(code))