const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const babel = require('babel-core');

let ID = 0;

// 读取文件信息，并获取当前js文件的依赖关系
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babylon.parse(content, {
        sourceType: "module",
    });
    const dependencies = [];
    // console.log(ast);
    traverse(ast, {
        ImportDeclaration: ({node}) => {
            // console.log(node);
            dependencies.push(node.source.value)
        }
    })
    // console.log(dependencies)
    const id = ID++;
    const {code} = babel.transformFromAst(ast, null, {
        presets: ['env']
    });
    return {
        id,
        filename,
        dependencies,
        code
    }
}
// 从入口开始分析所有依赖项，形成依赖图，采用广度遍历
function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];
    for (const asset of queue) {
        const dirname = path.dirname(asset.filename);
        asset.mapping = {};
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}
// 根据生成的依赖关系图，生成浏览器可执行文件
function bundle(graph) {
    let modules = '';

    graph.forEach(mod => {
        modules += `${modules}${mod.id}: [
            function (require, module, exports) {
                ${mod.code}
            },
            ${JSON.stringify(mod.mapping)},
        ],`;
    });

    const result = `
        (function(modules) {
            function require(id) {
                const [fn, mapping] = modules[id];
                function localRequire(relativePath) {
                    return require(mapping[relativePath]);
                }
                const module = { exports: {} };
                
                fn(localRequire, module, module.exports);

                return module.exports;
            }
            require(0);
        })({${modules}})
    `;

    return result;
}

const graph = createGraph('./example/entry.js')
const result = bundle(graph);
console.log(result);