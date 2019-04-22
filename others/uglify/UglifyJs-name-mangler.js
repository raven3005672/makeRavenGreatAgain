// UglifyJS can reduce names of local variables and functions usually to single-letters.
// That's a safe optimization provided the following stand:
// you don't directly call the global eval function.
// you don't use the with statement.
// you don't access the Function.name property.
// UglifyJS can detect hte first two cases and it will disable the mangler automatically in code areas that are poisoned by usage of eval or with.
// UglifyJS cnnnot detect if you're using the function's name property, however; insuce code the mangler can potentially break your code.
// For example the JADE template engine is affeted by this issue(coupled with its author "I am the smartest and know what's best" attitude).


// SYNOPSIS
ast = UglifyJS.parse(code);
ast.figure_out_scope();
ast.compute_char_frequency();
ast.mangle_names();
code = ast.print_to_string();


// That's all there is to it. Make sure to call figure_out_scope() first, then call mangle_names() on the toplevel node.
// Optionally insert the compute_char_frequency() there to get names that are optimized for GZip compression (names will be generated using the most frequent characters first).
// If you also compress your code, then you want to mangle names after compression, since the compressor might drop unused identifiers, unreachable code etc.
// The full sequence would be this:
ast = UglifyJS.parse(code);

// compressor needs figure_out_scope too
ast.figure_out_scope();
compressor = UglifyJS.Compressor()
ast = ast.transform(compressor);

// need to figure out scope again so mangler works optimally
ast.figure_out_scope();
ast.compute_char_frequency();
ast.mangle_names();

// get Ugly code back :)
code = ast.print_to_string();








