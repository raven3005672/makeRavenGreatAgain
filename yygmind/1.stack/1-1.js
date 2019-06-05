// 执行上下文的类型
// 执行上下文总共有三种类型：
// 全局执行上下文：只有一个，浏览器中的全局对象就是window对象，this指向这个全局对象。
// 函数执行上下文：存在无数个，只有在函数被调动的时候才会被创建，每次调用函数都会创建一个新的执行上下文。
// Eval函数执行上下文：指的是运行在eval函数中的代码，很少用而且不建议使用。


// 执行栈
// 执行栈，也叫调用栈，具有LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。
// 首次运行JS代码时，会创建一个全局执行上下文并Push到当前的执行栈中。每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文，并Push到当前执行栈的栈顶。
// 根据执行栈LIFO规则，当栈顶函数运行完成后，其对应的函数执行上下文将会从执行栈中pop出，上下文控制权将移到当前执行栈的下一个执行上下文。
var a = "Hello World!";
function first() {
    console.log('Inside first function');
    second();
    console.log('Again inside first function');
}
function second() {
    console.log('Inside second function');
}
first();
console.log('Inside Global Execution Context');
// Inside first function
// Inside second function
// Again inside first function
// Inside Global Execution Context

// 如图1-1-1


// 执行上下文的创建
// 执行上下文分两个阶段创建：1.创建阶段；2.执行阶段

// 1.创建阶段
// 确定this的值，也被称为This Binding
// LexicalEnvironment（词法环境）组件被创建。
// VariableEnvironment（变量环境）组件被创建。
// 伪代码
// ExecutionContext = {
//     ThisBinding = <this value>,         // 确定this
//     LexicalEnvironment = { ... },       // 词法环境
//     VariableEnvironment = { ... }       // 变量环境
// }

// This Binding
// 全局执行上下文中，this的值指向全局对象，在浏览器中this的值指向window对象，而在nodejs中指向这个文件的module对象。
// 函数执行上下文中，this的值取决于函数的调用方式。具体有：默认绑定、隐式绑定、显式绑定（硬绑定）、new绑定、箭头函数，具体内容会在【第三章this】部分详解。

// 词法环境 Lexical Environment
// 词法环境由两个组成部分：环境记录+对外部环境的引用
// 环境记录：存储变量和函数声明的实际位置
// 对外部环境的引用：可以访问其外部词法环境
// 词法环境有两种类型：全局环境or函数环境
// 全局环境：是一个没有外部环境的词法环境，其外部环境引用为null。拥有一个全局对象（window对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，this的值指向这个全局对象。
// 函数环境：用户在函数中定义的变量被存储在环境记录中，包含了arguments对象。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。
// 伪代码
// GlobalExetionContent = {            // 全局执行上下文
//     LexicalEnvironment: {           // 词法环境
//         EnvironmentRecord: {        // 环境记录
//             Type: "Object",
//             // 标识符绑定在这里
//         },
//         outer: <null>           // 对外部环境的引用
//     }
// }
// FunctionExectionContext = {             // 函数执行上下文
//     LexicalEnvironment: {               // 词法环境
//         EnvironmentRecord: {            // 环境记录
//             Type: "Declarative",        // 函数环境
//             // 标识符绑定在这里
//         }
//         outer: <Global or outer function environment reference>     // 对外部环境的引用
//     }
// }

// 变量环境
// 变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性。
// 在ES6中，词法环境和变量环境的区别在于前者用于存储函数声明和变量(let和const)绑定，而后者仅用于存储变量(var)绑定。

let a = 20;
const b = 30;
var c;
function multiply(e,f) {
    var g = 20;
    return e * f * g;
}
c = multiply(20, 30);
// 执行上下文如下所示
// GlobalExectionContext = {
//     ThisBinding: <Global Object>,

//     LexicalEnvironment: {
//         EnvironmentRecord: {
//             Type: "Object",
//             // 标识符绑定在这里
//             a: < uninitialized >,
//             b: < uninitialized >,
//             multiply: < func >
//         },
//         outer: <null>
//     },

//     VariableEnvironment: {
//         EnvironmentRecord: {
//             Type: "Object",
//             // 标识符绑定在这里
//             c: undefined
//         },
//         outer: <null>
//     }
// }
// FunctionExectionContext = {
//     ThisBinding: <Global Object>,

//     LexicalEnvironment: {
//         EnvironmentRecord: {
//             Type: "Declarative",
//             // 标识符绑定在这里
//             Arguments: {0: 20, 1: 30, length: 2},
//         },
//         outer: <GlobalExectionContext>
//     },

//     VariableEnvironment: {
//         EnvironmentRecord: {
//             Type: "Declarative",
//             // 标识符绑定在这里
//             g: undefined
//         },
//         outer: <GlobalExectionContext>
//     }
// }

// 变量提升的原因：
// 在创建阶段，函数声明存储在环境中，而变量会被设置为undefined（在var的情况下）或保持未初始化（在let和const的情况下）。
// 所以这就是为什么可以在声明之前访问var定义的变量（尽管是undefined），但如果在声明之前访问let和const定义的变量就会提示引用错误的原因。

// 执行阶段
// 此阶段，完成对所有变量的分配，最后执行代码。
// 如果javascript引擎在源代码中声明的实际位置找不到let变量的值，那么将为其分配undefined值。



// https://heyingye.github.io/2018/03/19/js%E5%BC%95%E6%93%8E%E7%9A%84%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B%EF%BC%88%E4%B8%80%EF%BC%89/
// 结合此篇理解