// filename .babelrc
{
    "presets": [
        "lastest",
        "react",
        "stage-2"
    ],
    "plugins": []
}

// 最新转码规则
npm install --save-dev babel-preset-latest
// react转码规则
npm install --save-dev babel-preset-react
// 不同阶段语法提案的转码规则（选装一个）
npm install --save-dev babel-preset-stage-0
npm install --save-dev babel-preset-stage-1
npm install --save-dev babel-preset-stage-2
npm install --save-dev babel-preset-stage-3

// 命令行转码
npm install --global babel-cli
// 转码结果输出到标准输出
babel example.js
// 转码结果写入一个文件 --out-file 或 -o 参数指定输出文件
babel example.js --out-file compiled.js
babel example.js -o compiled.js
// 整个目录转码 --out-dir 或 -d 参数指定输出目录
babel src --out-dir lib
babel src -d lib
// -s 参数生成source map文件
babel src -d lib -s

// babel-node
// 执行babel-node进入REPL环境 或者直接执行脚本
babel-node [filename]

// babel-register
npm install --save-dev babel-register
// register模块改写了require命令，加上了一个钩子，此后，每当使用require加载后缀为.js/.jsx/.es/.es6的文件，就会先用babel转码
require("babel-register");
require("./index.js");

// babel-core 调用Babel的api进行转码
npm install babel-core --save
var babel = require('babel-core');
// 字符串转码
babel.transform('code();', options);
// => {code, map, ast}
// 文件转码(异步)
babel.transformFile('filename.js', options, function(err, result) {
    result; // => {code, map, ast}
});
// 文件转码(同步)
babel.transformFileSync('filename.js', options);
// => {code, map, ast}
// Babel AST转码
babel.transformFromAst(ast, code, options);
// => {code, map, ast}

// babel-polyfill
// babel默认只转换新的js语法，而不转换新的api【Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise】
npm install --save babel-polyfill
import 'babel-polyfill';
require('babel-polyfill');
