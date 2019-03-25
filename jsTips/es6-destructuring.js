// 只要具有Iterator接口
let [a, b, c] = [1, 2, 3];
let [x, y, z] = new Set(['a', 'b', 'c']);
// 字符串类数组
let [a, b, c, d, e] = 'hello';
// 默认值：仅在严格===undefined时生效
let [foo = true] = [];
// 重命名
let {foo: baz} = {foo: "aaa", bar: "bbb"};
let obj = {}, arr = [];
({foo: obj.prop, bar: arr[0]} = {foo: 123, bar: true});
obj // {prop: 123}
arr // [true]

// 数值和布尔值的解构会先转为对象
let {toString: s} = 123;    // 或者 true
s === Number.prototype.toString // true

// 函数参数解构【有次序数组，无次序对象】
function add({x, y}) {
    return x + y;
}
// 交换变量的值
let x = 1, y = 2;
[x, y] = [y, x];
// 函数返回多个值
function example() {
    return [1, 2, 3]
}
let [a, b, c] = example();
// 遍历Map结构
var map = new Map();
map.set("first", "hello");
map.set("second", "world");
for (let [key, value] of map) {
    console.log(key + " is " + value);
}
// first is hello
// second is world