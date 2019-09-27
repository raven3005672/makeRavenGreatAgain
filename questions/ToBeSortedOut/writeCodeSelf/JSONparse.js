// JSON.parse(text[, reviver])
// 用来解析JSON字符串，构造由字符串描述的javascript值或对象。提供可选的reviver函数用以在返回之前对所得到的对象执行变换（操作）。

// 第一种方法：直接调用eval
function jsonParse(opt) {
    return eval('(' + opt + ')');
}

console.log(jsonParse(JSON.stringify({x: 5})));
console.log(jsonParse(JSON.stringify({x: 1, y: {d: [1,2,3]}})))
// 此方法执行js代码，会有xss漏洞。需要对参数json做校验
var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
if (
    rx_one.test(
        json
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}

// 第二种方法：Function
// Function与eval有相同的字符串参数特性
// var func = new Function(arg1, arg2, ..., functionBody);
var jsonStr = '{"age": 20, "name": "jack"}';
var json = (new Function('return ' + jsonStr))();
