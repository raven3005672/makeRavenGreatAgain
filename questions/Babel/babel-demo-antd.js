// import * as babel from '@babel/core';
let babel = require('@babel/core');
const c = `import {Button} from 'antd'`;
const {code} = babel.transform(c, {
    plugins: [
        function({types: t}) {
            return {
                visitor: {
                    ImportDeclaration(path) {
                        const {node: {specifiers, source}} = path;
                        // 对specifiers进行判断，是否默认导入
                        if (!t.isImportDefaultSpecifier(specifiers[0])) {
                            const newImport = specifiers.map(specifier => (
                                t.importDeclaration(
                                    [t.ImportDefaultSpecifier(specifier.local)],
                                    t.stringLiteral(`${source.value}/lib/${specifier.local.name}`)
                                )
                            ));
                            path.replaceWithMultiple(newImport);
                        }
                    }
                }
            }
        }
    ]
})

console.log(code);  // import Button from "antd/lib/Button";
