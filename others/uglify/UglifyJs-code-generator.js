// The code generator is a recursive process of getting back source code from an AST returned by the parser.
// Every AST node has a "print" method that takes on OutputStream and dumps the code from that node into it.
// The stream object supports a lot of options that control the output.
// You can specify whether you'd like to get human-readable(indented) output, the indentation level, whether you'd like to quote all properties in object literals etc.


// Synopsis
var UglifyJS = require('uglify-js');
var stream = UglifyJS.OutputStream(options);
var code = ast.print(stream);
alert(stream.toString())
// the options is a js object. Here are the default options:
// indent_start  : 0,     // start indentation on every line (only when `beautify`)
// indent_level  : 4,     // indentation level (only when `beautify`)
// quote_keys    : false, // quote all keys in object literals?
// space_colon   : true,  // add a space after colon signs?
// ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
// inline_script : false, // escape "</script"?
// width         : 80,    // informative maximum line width (for beautified output)
// max_line_len  : 32000, // maximum line length (for non-beautified output)
// ie_proof      : true,  // output IE-safe code?
// beautify      : false, // beautify output?
// source_map    : null,  // output a source map
// bracketize    : false, // use brackets every time?
// comments      : false, // output comments?
// semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines)


// Source map
// The output stream keeps track of the current line/column in the output and can trivially generate a source mapping to the original code via Mozilla's source-map library.
// To use this functionality, you must load this library(it's automatically require-d by UglifyJS in the NodeJS version, but in a broswer you must load it yourself) and make it available via the global MOZ_SourceMap variable.
// Next, in the code generator options you'd pass a UglifyJS.SourceMap object(that's a thin wrapper around the source-map library), like this:
var source_map = UglifyJS.SourceMap(source_map_options);
var stream = UglifyJS.OutputStream({
    // ...
    source_map: source_map
})
ast.print(stream);
var code = stream.toString();
var map = source_map.toString();        // json output for your source map
// The source_map_options is an optional JS object that you may pass to specify additional properties for your source map:
// file : null, // the compressed file name
// root : null, // the root URL to the original sources
// orig : null, // the input source map
// The orig is useful when you compress code that was generated from some other source(possibly other programming language).
// If you have an input source map, pass it in this argument(either as a JS object, or as a JSON string) and UglifyJS will generate a mapping that maps back to the original source(as opposed to the compiled code that you are compressing).


// Comments
// The code generator can keep certain comments in the output. If you pass comments: true it'll keep all comments.
// You can pass a RegExp to retain only comments whose body matches that regexp. You can pass a function for custom filtering.
// For example, when --comments is passed with no argument the command-line tool will keep all comments containing "@license", "@preserve" or "@cc_on".
// Here is the function that is uses to filter them:
function(node, comment) {
    var test = comment.value;
    var type = comment.type;
    if (type == "comment2") {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test(test);
    }
}
// The code generator will pass two arguments: thie node that the current comment is attached to, and the comment token.
// Note that some comments might still be lost, dut to compressor optimizations that cut whole nodes from the tree(for example unused function declarations).
// The safest place where to put comments that you might want to keep is at toplevel(not nested in brackets or functions).


// OutputStream
// Construct an OutputStream as described above in synopsis. The object exports the following methods:
get(), toString()   // return the output so far as a string
indent(half)        // insert one indentation string(usually 4 characters). Optionally pass true to indent half the width(I'm using that for case and default lines in switch blocks. If beautify is off, this function does nothing.)
indentation()       // return the current indentation width(not level; for example if we're in level 2 and indent_level is 4, this method would return 8)
current_width()     // return the width of the current line text minus indentation.
should_break()      // return true if current_width() is bigger than options.width (assuming options.width is non-null, non-zero).
newline()           // if beautification is on, this inserts a newline. Otherwise it does nothing.
print(str)          // include the given string into the output, adjusting current_line, current_col and current_pos accordingly.
space()             // if beautification is on this always includes a space character. Otherwise it saves a hint somewhere that a space might be needed at current point. The space will go in at the next output but only when absolutely required, for example it will insert the space in return 10 but not in return"stuff".
comma()             // inserts a comma, and calls space() — that is, if beautification is on you'll get a space after the comma.
colon()             // inserts a colon, and calls space() if options.space_colon is set.
last()              // returns the last printed chunk.
semicolon()         // if beautification is on it always inserts a semicolon. Otherwise it saves a hint that a semicolon might be needed at current point. The semicolon is inserted when the next output comes in, only if required to not break the JS syntax.
force_semicolon()   // always inserts a semicolon and clears the hint that a semicolon might be needed.
to_ascii(str)       // encodes any non-ASCII characters in string with JavaScript's conventions (using \uCODE).
print_name(name)    // prints an identifier. If options.ascii_only is set, non-ASCII chars will be encoded with JavaScript conventions.
print_string(str)   // prints a string. It adds quotes automatically. It prefers double-quotes, but will actually count any quotes in the string and will use single-quotes if the output proves to be shorter (depending on how many backslashes it has to insert). It encodes to ASCII if options.ascii_only is set.
next_indent()       // returns the width of the next indentation level. For example if current level is 2 and options.indent_level is 4, it'll return 12.
with_indent(col, func) // sets the current indentation to col (column), calls the function and thereafter restores the previous indentation level. If beautification is off it simply calls func.
with_block(func)    // this is used to output blocks in curly brackets. It'll print an open bracket at current point, then call newline() and with the next indentation level it calls your func. Lastly, it'll print an indented closing bracket. As usual, if beautification is off you'll just get {x} where x is whatever func outputs.
with_parens(func)   // adds parens around the output that your function prints.
with_square(func)   // adds square brackets around the output that your function prints.
add_mapping(token, name) // if options.source_map is set, this will generate a source mapping between the given token (which should be an AST_Token-like object) and the current line/col. The name is optional; in most cases it will be inferred from the token.
option(name)        // returns the option with the given name.
line()              // returns the current line in the output (1-based).
col()               // returns the current column in the output (zero-based).
push_node(node)     // push the given node into an internal stack. This is used to keep track of current node's parent(s).
pop_node()          // pops the top of the stack and returns it.
stack()             // returns that internal stack.
parent(n)           // returns the n-th parent node (where zero means the direct parent).









