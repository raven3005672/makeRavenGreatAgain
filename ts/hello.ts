// 使用:指定变量的类型，:前后有没有空格都可以
function sayHello(person: string) {
    return 'Hello, ' + person;
}
let user = 'Tom';
console.log(sayHello(user));
// TypeScript只会进行静态检查，如果发现有错误，编译的时候就会报错
// let user = [0, 1, 2];
// console.log(sayHello(user));
