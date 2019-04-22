var UglifyJS = require("uglify-js");
var code= "function add(first, second) {return first + second;}";
// 只解析代码，获得原生Uglify AST
var result1 = UglifyJS.minify(code, {
    parse: {},
    compress: false,
    mangle: false,
    output: {
        ast: true,
        code: false         // optional - faster if false
    }
});
// console.log(result1)
// result.ast即是原生Uglify AST

/*
// 输入原生Uglify AST，接着把它压缩并混淆，生成代码和原生ast
var result2 = UglifyJS.minify(ast, {
    compress: {},
    mangle: {},
    output: {
        ast: true,
        code: true          // 可选，false更快
    }
});
console.log(result2)
// result.ast是原生Uglify AST
// result.code是字符串格式的最小化后的代码
*/

var testCode = 'a=1; b = 2;c =3';
var topLevel = UglifyJS.parse(testCode);
var ast = UglifyJS.minify(testCode, {
    parse: {},
    compress: false,
    mangle: false,
    output: {
        ast: true,
        code: false         // optional - faster if false
    }
});
var transformer = new UglifyJS.TreeTransformer(function(node, descend) {

    if (node instanceof UglifyJS.AST_Number && node.value) {
        // console.log(node)
        let resultValue = node.value;
        node.value = '0x' + resultValue.toString(16);
        return node;
    }
});
topLevel.transform(transformer);
// console.log(topLevel.print_to_string({beautify: true}));

// console.log('ast', ast.ast)

function bfs(tree) {
    let result = [];
    if (tree) {
        var queue = [];
        queue.unshift(tree);
        while (queue.length) {
            var item = queue.shift();
            result.push(item);
            var children = item.body;
            for (var i = 0; i < children.length; i++) {
                queue.push(children[i]);
            }
        }
    }
    return result;
}
console.log(bfs(ast.ast))

var code = "function foo() {\n\
    function x() {}\n\
    function y() {}\n\
}\n\
function bar() {}";
var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node) {
    if (node instanceof UglifyJS.AST_Defun) {
        console.log(UglifyJS.string_template("Found funciont {name} at {line}, {col}", {
            name: node.name.name,
            line: node.start.line,
            col: node.start.col
        }));
        return true;
    }
})
toplevel.walk(walker)