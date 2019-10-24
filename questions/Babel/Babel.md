# Babel

## Babel是怎么工作的

Babel是一个JavaScript编译器。

Babel只转译新标准引入的语法，比如：箭头函数、let/const、解构...

对于新标准引入的全局变量、部分原生对象新增的原型链上的方法，Babel不作处理：全局变量、Promise、Symbol、WeakMap、Set、includes、generator... 需要引入polyfill来解决。

## Babel编译的三个阶段

Babel的编译过程和大多数其他语言的编译器相似，可以分为三个阶段：

* 解析(Parsing): 将代码字符串解析成抽象语法树。
* 转换(Transformation): 对抽象语法树进行转换操作。
* 生成(Code Generation): 根据变换后的抽象语法树再生成代码字符串。

### 解析（Parsing）

Babel拿到源代码会把代码抽象出来，变成AST抽象语法树，Abstract Syntax Tree。

抽象语法树是源代码的抽象语法结构的树状表示，树上的每个节点都便是源代码中的一种结构，之所以说是抽象的，是因为抽象语法树并不会表示出真是语法出现的每一个细节，比如说，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现，它们主要用于源代码的简单转换。
```
console.log('zcy')
// AST结构如下
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "name": "log"
          }
        },
        "arguments": [
          {
          "type": "Literal",
          "value": "zcy",
          "raw": "'zcy'"
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}
```

#### AST是怎么来的：分词+语法分析

分词：将整个代码字符串分割成语法单元数组。语法单元通俗点说就是代码中的最小单元，不能再被分割。

Javascript代码中的语法单元主要包括以下几种：

* 关键字：const、let、var等
* 标识符：可能是一个变量，也可能是if、else这些关键字，又或者是true、false这些常量
* 运算符
* 数字
* 空格
* 注释：对于计算机来说，知道这段代码是注释就行了，不关心其具体内容

其实分词说白了就是简单粗暴地对字符串一个个遍历。为了模拟分词的过程，写了一个简单的Demo，仅仅适用于和上面一样的简单代码。Babel的实现比这要复杂得多，但是思路大体上是相同的。
```
function tokenizer(input) {
    const tokens = [];
    const punctuators = [',', '.', '(', ')', '=', ';'];
    let current = 0;
    while (current < input.length) {
        let char = input[current];
        if (punctuators.indexOf(char) !== -1) {
            tokens.push({
                type: 'Punctuator',
                value: char,
            });
            current++;
            continue;
        }
        // 检查空格，连续的空格放到一起
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }
        // 标识符是字母、$、_开始的
        if (/[a-zA-Z\$\_]/.test(char)) {
            let value = '';
            while (/[a-zA-Z0-9\$\_]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({
                type: 'Identifier',
                value
            });
            continue;
        }
        // 数字从0-9开始，不止一位
        const NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            let value = '';
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({
                type: 'Numeric',
                value
            });
            continue;
        }
        // 处理字符串
        if (char === '"') {
            let value = '';
            char = input[++current];
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
            char = input[++current];
            tokens.push({
                type: 'String',
                value
            });
            continue;
        }
        // 最后遇到不认识的字符就抛出个异常出来
        throw new TypeError('Unexpected charactor: ' + char);
    }
    return tokens;
}

const input = `console.log("zcy");`

console.log(tokenizer(input));
// 结果
[ { type: 'Identifier', value: 'console' },
  { type: 'Punctuator', value: '.' },
  { type: 'Identifier', value: 'log' },
  { type: 'Punctuator', value: '(' },
  { type: 'String', value: 'zcy' },
  { type: 'Punctuator', value: ')' },
  { type: 'Punctuator', value: ';' } ]
```

语法分析：建立分析语法单元之间的关系

语义分析则是将得到的词汇进行一个立体的组合，确定词语之间的关系。考虑到编程语言的各种从属关系的复杂性，语义分析的过程又是在遍历得到的语法单元组，相对而言就会变得更复杂。

简单来说语法分析是对语句和表达式识别，这是个递归过程，在解析中，Babel会在解析每个语句和表达式的过程中设置一个暂存器，用来暂存当前读取到的语法单元，如果解析失败，就会返回之前的暂存点，再按照另一种方式进行解析，如果解析成功，则将暂存点销毁，不断重复以上操作，知道最后生成对应的语法树。

### 转换（Transformation）

#### Plugins

插件应用于babel的转译过程，尤其是第二个阶段Transformation，如果这个阶段不使用任何插件，那么babel会原样输出代码。

#### Presets

Babel官方帮我们做了一些预设的插件集，称之为Preset，这样我们只需要使用对应的Preset就可以了。每年每个Preset只编译当年批准的内容。而babel-preset-env相当于ES2015，ES2016，ES2017及最新版本。

#### Plugin/Preset路径

如果Plugin是通过npm安装，可以传入Plugin名字给Babel，Babel将检测它是否安装在node_modules中
```
"plugins": ["babel-plugin-myPlugin"]
```

也可以指定你的Plugin/Preset的相对或绝对路径
```
"plugins": ["./node_modules/asdf/plugin"]
```

#### Plugin/Preset排序

如果两次转译都访问相同的节点，则转译将按照Plugin或Preset的规则进行排序然后执行。

* Plugin会运行在Preset之前
* Plugin会从第一个开始顺序执行
* Preset的顺序则刚好相反（从最后一个逆序执行）

```
{
    "plugins": [
        "transform-decorators-legacy",
        "transform-class-properties"
    ]
}
// 先执行transform-decorators-legacy，再执行transform-class-properties

{
    "presets": [
        "es2015",
        "react",
        "stage-2"
    ]
}
// 执行顺序：stage-2，react，es2015

// .babelrc文件
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ],
    "plugins": [
        ["@babel/plugin-proposal-decorators", {"legacy": true}],
        ["@babel/plugin-proposal-class-properties", {"loose": true}],
        "@babel/plugin-transform-runtime"
    ]
}
// 执行顺序：
// @babel/plugin-proposal-decorators
// @babel/plugin-proposal-class-properties
// @babel/plugin-transform-runtime
// @babel/preset-env
```

### 生成（Code Generation）

用babel-generator通过AST树生成ES5代码

## 如何编写一个Babel插件

### 插件格式

先从一个接收了当前Babel对象作为参数的Function开始。
```
export default function(babel) {
    // plugin contents
}
```

我们经常会这样写：
```
export default function({types: t}) {
    // ...
}
```

接着返回一个对象，其visitor属性是这个插件的主要访问者。
```
export default function({types: t}) {
    return {
        visitor: {
            // visitor contents
        }
    }
}
```

visitor中的每个函数接收2个参数：path和state
```
export default function({types: t}) {
    return {
        visitor: {
            CallExpression(path, state) {}
        }
    }
}
```

### 写一个简单的插件

我们先写一个简答的插件，把所有定义变量名为a的换成b，先从astexplorer看下var a = 1的AST
```
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 9,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```

从这里看，我们要找的节点类型就是VariableDeclarator
```
export default function({types: t}) {
    return {
        visitor: {
            VariableDeclarator(path, state) {
                if (path.node.id.name == 'a') {
                    path.node.id = t.identifier('b')
                }
            }
        }
    }
}
```

我们要把id属性是a的替换成b就好了。但是这里不能直接path.node.id.name = 'b'。如果操作的是Object，就没问题，但是这里是AST语法树，所以想改变某个值，就是用对应的AST来替换，现在我们用新的标识符来替换这个属性。

最后测试一下，详情见babel-demo-a-b.js

### 实现一个简单的按需打包功能

例如我们要实现把import {Button} from 'antd'转成import Button from 'antd/lib/button'

通过对比AST发现，specifiers里的type和source不同。
```
// import {Button} from 'antd';
"specifiers": [
    {
        "type": "ImportSpecifier",
        ...
    }
]
// import Button from 'antd/lib/button'
"specifiers": [
    {
        "type": "ImportDefaultSpecifier",
        ...
    }
]
```

详情见babel-demo-antd.js

babel-plugin-import这个插件是有配置项的，我们可以对代码做以下更改
```
export default function({types: t}) {
    return {
        visitor: {
            ImportDeclaration(path, {opts}) {
                const {node: {specifiers, source}} = path;
                if (source.value === opts.libraryName) {
                    // ...
                }
            }
        }
    }
}
```

## Babel常用API

### @babel/core

Babel的编译器，核心API都在这里面，比如常见的transform、parse。

### @babel/cli

cli是命令行工具，安装了@babel/cli就能够在命令行中使用babel命令来编译文件。当然我们一般不会用到，打包工具已经帮我们做好了。

### @babel/node

直接在node环境中，运行ES6的代码

### babylon

Babel的解析器

### babel-traverse

用于对AST的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点。

### babel-types

用于AST节点的Lodash式工具库，它包含了构造、验证以及变换AST节点的方法，对编写处理AST逻辑非常有用。

### babel-generator

Babel的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）
