// var esprima = require('esprima');

// var a = esprima.parseScript('answer=42', {tokens: true});
// console.log(a);
// var b = esprima.parseScript('if(x) {function y(){}} else {console.log(2)}', {tokens: true});
// console.log(b);

const esprima = require('esprima');
const readline = require('readline');

function isConsoleCall(node) {
    return (node.type === 'CallExpression') &&
        (node.callee.type === 'MemberExpression') &&
        (node.callee.object.type === 'Identifier') &&
        (node.callee.object.name === 'console');
}

function removeCalls(source) {
    const entries = [];
    esprima.parseScript(source, {}, function(node, meta) {
        if (isConsoleCall(node)) {
            entries.push({
                start: meta.start.offset,
                end: meta.end.offset
            });
            console.log(meta)
        }
    });
    entries.sort((a,b) => {
        return b.end - a.end
    }).forEach(n => {
        source = source.slice(0, n.start) + source.slice(n.end);
    });
    return source;
}

let source = '';
readline.createInterface({input: process.stdin, terminal: false})
.on('line', line => {source += line + '\n'})
.on('close', () => {console.log(removeCalls(source))});