// 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

// 假如我们想使用第三方库jQuery，一种常见的方式是在html中通过script标签引入jQuery，然后就可以使用全局变量$或者jQuery了
// 我们需要使用declare var来定义它的类型：
declare var jQuery: (selector: string) => any;
jQuery('#f00')
// declare var并没有真的定义一个变量，只是定义了全局变量jQuery的类型，仅仅会用于编译时的检查，在编译结果中会被删除。

// 声明文件
// 通常我们会把声明语句放到一个单独的文件(jQuery.d.ts)中，这就是声明文件：
// src/jQuery.d.ts
declare var jQuery: (selector: string) => any;
// 一般来说，ts会解析项目中所有的*.ts文件，当然也包含以.d.ts结尾的文件。所以当我们将jQuery.d.ts放到项目中时，其他所有*.ts文件就都可以获得jQuery的类型定义了。
// 例如仍然无法解析，那么可以检查下tsconfig.json中的files、include和exclude配置，确保其包含了jQuery.d.ts文件。

// 第三方声明文件
// 使用@types统一管理第三方库的声明文件。
npm install @types/jquery --save-dev
// http://microsoft.github.io/TypeSearch/

// 书写声明文件
// 当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。前面只介绍了最简单的声明文件内容，而真正书写一个声明文件并不是一件简单的事。以下会详细介绍如何书写声明文件。
// 在不同的场景下，声明文件的内容和使用方式会有所区别。
// 库的使用场景主要有以下几种：
// 全局变量：通过 <script> 标签引入第三方库，注入全局变量
// npm 包：通过 import foo from 'foo' 导入，符合 ES6 模块规范
// UMD 库：既可以通过 <script> 标签引入，又可以通过 import 导入
// 模块插件：通过 import 导入后，可以改变另一个模块的结构
// 直接扩展全局变量：通过 <script> 标签引入后，改变一个全局变量的结构。比如为 String.prototype 新增了一个方法
// 通过导入扩展全局变量：通过 import 导入后，可以改变一个全局变量的结构

// 全局变量
// 全局变量是最简单的一种场景，之前举的例子就是通过 <script> 标签引入 jQuery，注入全局变量 $ 和 jQuery。
// 使用全局变量的声明文件时，如果是以 npm install @types/xxx --save-dev 安装的，则不需要任何配置。如果是将声明文件直接存放于当前项目中，则建议和其他源码一起放到 src 目录下（或者对应的源码目录下）：
// 如果没有生效，可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。
// 全局变量的声明文件主要有以下几种语法：
// declare var 声明全局变量
// declare function 声明全局方法
// declare class 声明全局类
// declare enum 声明全局枚举类型
// declare namespace 声明全局对象（含有子属性）
// interface 和 type 声明全局类型

declare var
// 在所有的声明语句中，declare var 是最简单的，如之前所学，它能够用来定义一个全局变量的类型。与其类似的，还有 declare let 和 declare const，使用 let 与使用 var 没有什么区别，而使用 const 定义时，表示此时的全局变量是一个常量，不允许再去修改它的值了：
declare let jQuery: (selector: string) => any;
jQuery('#foo');
// 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
}

declare const jQuery: (selector: string) => any;
jQuery('#foo');
// 使用 declare const 定义的 jQuery 类型，禁止修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
}                               // error

// 一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 const 而不是 var 或 let。
// 需要注意的是，声明语句中只能定义类型，切勿在声明语句中定义具体的值：
declare const jQuery = function(selector) {
    return document.querySelector(selector)
};                              // error

declare function
// declare function 用来定义全局函数的类型。jQuery 其实就是一个函数，所以也可以用 function 来定义：
declare function jQuery(selector: string): any;
jQuery('#foo');
// 在函数类型的声明语句中，函数重载也是支持的：
declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any): any;
jQuery('#foo');
jQuery(function() {
    alert('Dom Ready!');
});

declare class
// 当全局变量是一个类的时候，我们用 declare class 来定义它的类型：
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
let cat = new Animal('Tom');
// 同样的，declare class 语句也只能用来定义类型，不能用来定义具体的值，比如定义 sayHi 方法的具体实现则会报错：
declare class Animal {
    constructor(name: string);
    sayHi() {
        return `My name is ${this.name}`;
    };
    // ERROR: An implementation cannot be declared in ambient contexts.
}










