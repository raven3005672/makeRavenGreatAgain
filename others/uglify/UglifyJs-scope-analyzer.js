// UglifyJS contains a scope analyzer which figures out variable/function definitions, references etc.
// You need to call it manually before compression or mangling:
toplevel.figure_out_scope();
// The figure_out_scope method is defined only on the AST_Toplevel node.


// Methods
// Several methods do meaningful things after a call to figure_out_scope:
// AST_Scope::find_variable(name) — looks up the variable by name and if found it returns the associated SymbolDef.
// AST_Scope::references(def) — returns non-null if this scope references the given SymbolDef.
// AST_Symbol::unmangleable() — returns true if this symbol cannot be renamed (it's either global, undeclared, or defined in scope where eval or with are in use.
// AST_Symbol::unreferenced() — returns true if this symbol is not referenced.
// AST_Symbol::undeclared() — returns true if this symbol is undeclared.
// AST_Symbol::global() — returns true if this symbol is defined in the global (toplevel) scope.
// AST_Symbol::definition() — returns the associated SymbolDef for this symbol.


// Internals
// figure_out_scope will supplement nodes with additional information:

// In AST_Scope nodes
// directives — an array of directives that appear in this scope.
// variables — a mapping from name to SymbolDef object for all definitions in this scope, including functions.
// functions — a like variables but only for function declarations.
// uses_with — becomes true if the with statement is used in this scope or any subscopes.
// uses_eval — becomes true if a direct call to the global eval is seen in this scope or any subscope.
// parent_scope — a pointer to the parent scope, or null of this is the toplevel scope.
// enclosed — a list of SymbolDef-s defined in this or in the outer scopes which are used from this or from inner scopes.

// In AST_Symbol nodes
// scope — pointer to the current scope.
// thedef — pointer to the SymbolDef associated with this symbol

// In AST_LabelRef nodes
// scope — pointer to the current scope.
// thedef — pointer to the AST_Label declaration that this symbol refers to


// Symbol definitions
// After parsing you'll want to call the toplevel.figure_out_scope() in order to supply additional information in the AST.
// This function will create an unique definition for each symbol. Think of code like this, for example:
function f(x) {
    if (something) {
        var x = 10;
    }
    var x = 20;
}
// Are the x-es the same variable? Well, they should be, although in the AST they are different AST_SymbolDeclaration nodes. The scope analyzer will create a single definition and point each of them to the same definition.
// This definition is a SymbolDef object and it has the following properties:
// name — the original symbol name
// orig — an array of AST_SymbolDeclaration-s where this variable is defined; for the case above it would contain all 3 x-es.
// scope — points to the AST_Scope where this is defined.
// references — an array of AST_SymbolRef nodes that were determined to point to this definition.
// global — boolean, tells us if this is a global definition.
// undeclared — boolean, tells us if this is an undeclared definition (more below about undeclared names).
// constant — boolean, true if this is a constant definition (occurring in const).
// mangled_name — the mangled name for this node, created by toplevel.mangle_names(). If present, the code generator will use this name when printing symbols.


// When it sees an undeclared symbol such as the Q below:
function f(x) {
    return Q + Q + x;
}
// UglifyJS will still create a SymbolDef, but mark it "undeclared".
// This is for consistency, so that every symbol's definition() method returns something usable.
// It also might be useful for various applications to track access to undeclared globals, which can be found in the SymbolDef's references property.
