var UglifyJS = require('uglify-js');
// SYNOPSIS
// function visitor(node, descend) {
//     // ...
//  };
//  var walker = new UglifyJS.TreeWalker(visitor);
//  ast.walk(walker);
//  UglifyJS provides a TreeWalker object and every node has a walk method that given a walker will apply your visitor to each node in the tree.
// Your visitor can return a non-falsy value in order to prevent descending the current node. I'll present samples first, scroll down for more API reference.

// Avoiding diving into nodes
// Here's an example of how you would print out all function declarations:
var code = "function foo() {\n\
    function x(){}\n\
    function y(){}\n\
}\n\
function bar() {}";
var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node) {
    if (node instanceof UglifyJS.AST_Defun) {
        // string_template is a cute little function that UglifyJS uses for warnings
        console.log(UglifyJS.string_template("Found function {name} at {line}, {col}", {
            name: node.name.name,
            line: node.start.line,
            col: node.start.col
        }))
    }
});
toplevel.walk(walker)
// The example above defines two toplevel functions ("foo" and "bar") and two functions nested in "foo" ("x" and "y").
// If you run it, it will output:
// Found function foo at 1,0
// Found function x at 2,2
// Found function y at 3,2
// Found function bar at 5,0

// which is correct. What if we're interested only in the toplevel functions? There are two solutions actually:
// (1) check the parent of "node" in the visitor and don't display if it's not an AST_Toplevel, or (2) simply avoid descending into functions.
// The latter is much more convenient in this case. To avoid descending, the visitor must return a non-falsy value. The following version will display only "foo" and "bar":
var code = "function foo() {\n\
    function x(){}\n\
    function y(){}\n\
}\n\
function bar() {}";
var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node){
    if (node instanceof UglifyJS.AST_Defun) {
        // string_template is a cute little function that UglifyJS uses for warnings
        console.log(UglifyJS.string_template("Found function {name} at {line},{col}", {
            name: node.name.name,
            line: node.start.line,
            col: node.start.col
        }));
        return true; // ← that's the modification
    }
});
toplevel.walk(walker);


// Determine the parent node(s)
// The AST doesn't maintain child→parent links in the nodes. However, the walker can easily keep track of upper nodes and provides an API to get them:
walker.parent()         // returns the parent of the current node.
walker.stack            // an array holding all nodes that lead to current node. The last element in this array is the current node itself.
walker.find_parent(type) // finds the innermost parent of the given type. type must be a node constructor, i.e. AST_Scope.

// For example here's how we would list strings that appear as arguments in a function call:
var code = "function f(){}\n\
var x = 'a string';\n\
y = 'foo' + 'bar' + x;\n\
f('a', 'b', (x + 'z'), y, 'c');\n\
";
var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node){
    if (node instanceof UglifyJS.AST_String) {
        var p = walker.parent();
        if (p instanceof UglifyJS.AST_Call && node !== p.expression) {
            console.log("Found string: %s at %d,%d", node.getValue(),
                        node.start.line, node.start.col);
        }
    }
});
toplevel.walk(walker);

// The above prints:
// Found string: a at 4,2
// Found string: b at 4,7
// Found string: c at 4,26
// "a", "b" and "c" are the only strings that appear directly under a “AST_Call” node. In case we'd like to get the "z" too, we could use find_parent:
var code = "function f(){}\n\
var x = 'a string';\n\
y = 'foo' + 'bar' + x;\n\
f('a', 'b', (x + 'z'), y, 'c');\n\
";
var toplevel = UglifyJS.parse(code);
var walker = new UglifyJS.TreeWalker(function(node){
    if (node instanceof UglifyJS.AST_String) {
        var p = walker.find_parent(UglifyJS.AST_Call);
        if (p && node !== p.expression) {
            console.log("Found string: %s at %d,%d", node.getValue(),
                        node.start.line, node.start.col);
        }
    }
});
toplevel.walk(walker);

// Another way: descend manually into call nodes
// There are multiple ways to do it.. It could be more convenient (perhaps even faster) to keep track of certain “parents” ourselves.
// UglifyJS does this in a few places. Your visitor receives a secondary argument which is a function that will descend the current node then return back to our visitor. Here goes:
var code = "function f(){}\n\
var x = 'a string';\n\
y = 'foo' + 'bar' + x;\n\
f('a', 'b', (x + 'z'), y, 'c');\n\
";
var toplevel = UglifyJS.parse(code);
var call_expression = null;
var walker = new UglifyJS.TreeWalker(function(node, descend){
    if (node instanceof UglifyJS.AST_Call) {
        var tmp = call_expression;
        call_expression = node;
        descend();
        call_expression = tmp;
        return true; // prevent descending again
    }
    if (node instanceof UglifyJS.AST_String && call_expression) {
        console.log("Found string: %s at %d,%d", node.getValue(),
                    node.start.line, node.start.col);
    }
});
toplevel.walk(walker);

// It displays the same result as the previous sample.
// Advantage to this is that by keeping track of the current call expression ourselves, the walker needs not search for it at every string node (so should be faster).
// But also, let's look at the same example but on a different input code (dumping it in a function this time and use toString() to make it source code; it's too painful to write code in JS strings):
var code = function toplevel() {
    var a = foo("x", "y", (function(){
        var b = "stuff";
        var c = "bar";
    })(), 1, "z");
};
code = code.toString();
var toplevel = UglifyJS.parse(code);
var call_expression = null;
var walker = new UglifyJS.TreeWalker(function(node, descend){
    if (node instanceof UglifyJS.AST_Call) {
        var tmp = call_expression;
        call_expression = node;
        descend();
        call_expression = tmp;
        return true; // prevent descending again
    }
    if (node instanceof UglifyJS.AST_String && call_expression) {
        console.log("Found string: %s at %d,%d", node.getValue(),
                    node.start.line, node.start.col);
    }
});
toplevel.walk(walker);
// This one prints:
// Found string: x at 2,16
// Found string: y at 2,21
// Found string: stuff at 3,16
// Found string: bar at 4,16
// Found string: z at 5,13

// but perhaps it's not what we wanted... Although there is a parent AST_Call node, the "stuff" and "bar" strings are present in another function and clearly not used in a call expression.
// There's no easy way to work around this with find_parent(), but by keeping track of certain parent nodes manually and by using the descend function it's pretty trivial:
var code = function toplevel() {
    var a = foo("x", "y", (function(){
        var b = "stuff";
        var c = "bar";
    })(), 1, "z");
};
code = code.toString();
var toplevel = UglifyJS.parse(code);
var call_expression = null;
var walker = new UglifyJS.TreeWalker(function(node, descend){
    if (node instanceof UglifyJS.AST_Call) {
        var tmp = call_expression;
        call_expression = node;
        descend();
        call_expression = tmp;
        return true; // prevent descending again
    }
    if (node instanceof UglifyJS.AST_Lambda) { // ← here
        // when encounters a lambda, temporarily forget
        // the call expression.
        var tmp = call_expression;
        call_expression = null;
        descend();
        call_expression = tmp;
        return true; // again, to prevent diving this node twice
    }
    if (node instanceof UglifyJS.AST_String && call_expression) {
        console.log("Found string: %s at %d,%d", node.getValue(),
                    node.start.line, node.start.col);
    }
});
toplevel.walk(walker);
// What it does is pretty simple, when it encounters a function it “forgets” for the moment the current call_expression while walking that lambda.
// After descending the lambda it restores the previous call_expression.
// Perhaps, might you think, an easier solution would be to not walk lambda expressions at all, but then it would fail to find the "qwe" string here:
var a = foo("x", "y", (function(){
    var b = "stuff";
    var c = "bar";
    return x("qwe");
})(), 1, "z");


// API reference
// Construct a TreeWalker by passing to it a visitor function.
// Your visitor receives two arguments: the current node, and a descend function which you may call to descend the node manually.
// If your visitor returns true, then the TreeWalker itself will not descend the node.

// The walker object has the following methods:
parent(n)                       // the n is optional, default zero. Returns the n-th parent of the current node, where zero means the direct parent.
find_parent(constructor)        // finds the innermost parent of the specified type.
in_boolean_context()            // returns true if the result of the current node is expected in a boolean context (that is, the value of the node doesn't matter, except for its truth value).
loopcontrol_target(label)       // returns the block that the specified label refers to. If label is null, returns the block that a break/continue statement in the current position would refer to.
has_directive(dir)              // returns a non-falsy value if the directive is in effect at the current node. Pass a complete directive value, i.e. "use strict" or "use asm". If the directive is defined in the current scope, it returns true, if it's defined in an upper scope it returns the string "up".

