var UglifyJS = require("uglify-js");

// parser
var ast = UglifyJS.parse("function sum(x, y) {return x + y}");
var ast = UglifyJS.parse(code, {
    strict: true,                   // default is false
    filename: "Input file name",    // default is null
    toplevel: ast                   // default is null
});
// when no toplevel argument is given, the parser will create an AST——Toplevel node an place into its body all statments from the code;
// However, to generate a proper source map it was useful to have the ability to parse multiple files into a single toplevel node. To do this you would say:

var ast = UglifyJS.parse(file1_content, {filename: "file1.js"});
ast = UglifyJS.parse(file2_content, {filename: "file2.js", toplevel: ast});
ast = UglifyJS.parse(file3_content, {filename: "file3.js", toplevel: ast});
// or in general, if in 'files' array you have the list of files:
var ast = null;
files.forEach(function(file) {
    var code = fs.readFileSync(file, "utf8");
    ast = UglifyJS.parse(code, {filename: file, ast: ast});
});
