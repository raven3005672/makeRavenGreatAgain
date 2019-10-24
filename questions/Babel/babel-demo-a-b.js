// import * as babel from '@babel/core';
let babel = require('@babel/core')

const c = `var a = 1`;
const {code} = babel.transform(c, {
    plugins: [
        function({types: t}) {
            return {
                visitor: {
                    VariableDeclarator(path, state) {
                        if (path.node.id.name == 'a') {
                            path.node.id = t.identifier('b');
                        }
                    }
                }
            }
        }
    ]
})

console.log(code);