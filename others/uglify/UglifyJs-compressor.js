// The compressor is a tree transformer which reduces the code size by applying various optimizations on the AST:

// SYNOPSIS
ast = UglifyJS.parse(code);
ast.figure_out_scope();
compressor = UglifyJS.Compressor(compressor_options);
ast = ast.transform(compressor);
code = ast.print_to_string();       // get compressed code

// The default options should yield to best compression on most scripts. The following options are supported:
// sequences     : true,  // join consecutive statemets with the “comma operator”
// properties    : true,  // optimize property access: a["foo"] → a.foo
// dead_code     : true,  // discard unreachable code
// drop_debugger : true,  // discard “debugger” statements
// unsafe        : false, // some unsafe optimizations (see below)
// conditionals  : true,  // optimize if-s and conditional expressions
// comparisons   : true,  // optimize comparisons
// evaluate      : true,  // evaluate constant expressions
// booleans      : true,  // optimize boolean expressions
// loops         : true,  // optimize loops
// unused        : true,  // drop unused variables/functions
// hoist_funs    : true,  // hoist function declarations
// hoist_vars    : false, // hoist variable declarations
// if_return     : true,  // optimize if-s followed by return/continue
// join_vars     : true,  // join var declarations
// cascade       : true,  // try to cascade `right` into `left` in sequences
// side_effects  : true,  // drop side-effect-free statements
// warnings      : true,  // warn about potentially dangerous optimizations/code
// global_defs   : {}     // global definitions


// Global definitions
// This is a feature you can use in order to conditionally drop code, For example if you pass:
global_defs: {
    DEBUG: false
} 
// the compressor will assume that's a constant defintion and will discard code like this as being unreachable:
if (DEBUG) {
    // ...
}
// This is useful in order to discard stuff that you need only inthe development version from production builds.

