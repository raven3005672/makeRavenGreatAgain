// http://www.javascriptobfuscator.com/
// https://www.npmjs.com/package/javascript-obfuscator

// npm usage
// npm install javascript-obfuscator
var JavaScriptObfuscator = require('javascript-obfuscator');
 
var obfuscationResult = JavaScriptObfuscator.obfuscate(
    `
        (function(){
            var variable1 = '5' - 3;
            var variable2 = '5' + 3;
            var variable3 = '5' + - '2';
            var variable4 = ['10','10','10','10','10'].map(parseInt);
            var variable5 = 'foo ' + 1 + 1;
            console.log(variable1);
            console.log(variable2);
            console.log(variable3);
            console.log(variable4);
            console.log(variable5);
        })();
    `,
    {
        compact: false,
        controlFlowFlattening: true
    }
);
console.log(obfuscationResult.getObfuscatedCode());


obfuscate(sourceCode, options)
// Returns ObfuscationResult object which contains two public methods:

// getObfuscatedCode() - returns string with obfuscated code;
// getSourceMap() - if sourceMap option is enabled - returns string with source map or an empty string if sourceMapMode option is set as inline.
// Calling toString() for ObfuscationResult object will return string with obfuscated code.

// Method takes two parameters, sourceCode and options – the source code and the opitons respectively:

// sourceCode (string, default: null) – any valid source code, passed as a string;
// options (Object, default: null) – an object with options.
// For available options see options.


// CLI usage
javascript-obfuscator input_file_name.js [options]
javascript-obfuscator input_file_name.js --output output_file_name.js [options]

// Obfuscation of single input file with .js extension.
// If the destination path is not specified with the --output option, obfuscated file will saved into the input file directory with INPUT_FILE_NAME-obfuscated.js name.

// Example
javascript-obfuscator samples/sample.js --compact true --self-defending false
// creates a new file samples/sample-obfuscated.js
javascript-obfuscator samples/sample.js --output output/output.js --compact true --self-defending false
// creates a new file output/output.js


// Obfuscate directory recursively
// Usage:
javascript-obfuscator ./dist [options]
// creates a new obfuscated files under `./dist` directory near the input files with `obfuscated` postfix
 
javascript-obfuscator ./dist --output ./dist/obfuscated [options]
// creates a folder structure with obfuscated files under `./dist/obfuscated` path
// Obfuscation of all .js files under input directory. If this directory contains already obfuscated files with -obfuscated postfix - these files will ignored.

// Obfuscated files will saved into the input directory under INPUT_FILE_NAME-obfuscated.js name.


// Conditional comments
// You can disable and enable obfuscation for specific parts of the code by adding following comments:

// disable: // javascript-obfuscator:disable or /* javascript-obfuscator:disable */;
// enable: // javascript-obfuscator:enable or /* javascript-obfuscator:enable */.

// Example:
// input
var foo = 1;
// javascript-obfuscator:disable
var bar = 2;

// output
var _0xabc123 = 0x1;
var bar = 2;

// Conditional comments affect only direct transformations of AST-tree nodes. All child transformations still will be applied to the AST-tree nodes.

// For example:
// Obfuscation of the variable's name at its declaration is called direct transformation;
// Obfuscation of the variable's name beyond its declaration is called child transformation.


// Antiviruses false positive virus alerts
// Some input source code that will obfuscated with some obfuscation options can trigger false positive alerts in a few antiviruses. If you will get this false positive triggers, try to play with obfuscation options.

// Try to change stringArrayEncoding option value between rc4 and base64 values or disable it completely;
// Try to change identifierNamesGenerator option value from hexadecimal on mangled;
// Try to disable selfDefending.
// If this wont help - attach your source code and describe your obfuscation options here: https://github.com/javascript-obfuscator/javascript-obfuscator/issues/51


// JavaScript Obfuscator Options
// options:
opstions = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    domainLock: [],
    identifierNamesGenerator: 'hexadecimal',
    identifiersPrefix: '',
    inputFileName: '',
    log: false,
    renameGlobals: false,
    reservedNames: [],
    reservedStrings: [],
    rotateStringArray: true,
    seed: 0,
    selfDefending: false,
    sourceMap: false,
    sourceMapBaseUrl: '',
    sourceMapFileName: '',
    sourceMapMode: 'separate',
    stringArray: true,
    stringArrayEncoding: false,
    stringArrayThreshold: 0.75,
    target: 'browser',
    transformObjectKeys: false,
    unicodeEscapeSequence: false
}

// CLI options:
// -v, --version
// -h, --help

// -o, --output

// --compact <boolean>
// --config <string>
// --control-flow-flattening <boolean>
// --control-flow-flattening-threshold <number>
// --dead-code-injection <boolean>
// --dead-code-injection-threshold <number>
// --debug-protection <boolean>
// --debug-protection-interval <boolean>
// --disable-console-output <boolean>
// --domain-lock '<list>' (comma separated)
// --exclude '<list>' (comma separated)
// --identifier-names-generator <string> [hexadecimal, mangled]
// --identifiers-prefix <string>
// --log <boolean>
// --rename-globals <boolean>
// --reserved-names '<list>' (comma separated)
// --reserved-strings '<list>' (comma separated)
// --rotate-string-array <boolean>
// --seed <number>
// --self-defending <boolean>
// --source-map <boolean>
// --source-map-base-url <string>
// --source-map-file-name <string>
// --source-map-mode <string> [inline, separate]
// --string-array <boolean>
// --string-array-encoding <boolean|string> [true, false, base64, rc4]
// --string-array-threshold <number>
// --target <string> [browser, browser-no-eval, node]
// --transform-object-keys <boolean>
// --unicode-escape-sequence <boolean>






