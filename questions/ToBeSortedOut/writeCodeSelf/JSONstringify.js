// JSON.stringify(value[, replace [, space]]): Boolean | Number | String
// 类型会自动转换成对应的原始值。undefined、任意函数以及symbol，会被忽略（出现在非数组对象的属性值中时），或者被转换成null（出现在数组中时）。
// 不可枚举的属性会被忽略，如果一个对象的属性值通过某种间接的方式指回该对象本身，即循环引用，属性也会被忽略。

// todo 不支持符合结构，不好
function jsonStringify(obj) {
    let type = typeof obj;
    if (type !== 'object' || type === null) {
        if (/string|undefined|function/.test(type)) {
            obj = '"' + obj + '"';
        }
        return String(obj);
    } else {
        let json = [];
        arr = (obj && obj.constructor === Array);
        for (let k in obj) {
            var v = obj[k];
            let type = typeof v;
            if (/string|undefined|function/.test(type)) {
                v = '"' + v + '"';
            } else if (type === "object") {
                v = jsonStringify(v);
            }
            json.push((arr ? "" : '"' + k + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}

console.log(jsonStringify({x: 5}));     // "{"x": 5}"
console.log(jsonStringify([1, "false", false]));        // "[1, "false", false]"
console.log(jsonStringify({b: undefined}));             // "{"b": "undefined"}"
console.log(jsonStringify({b: {a: [1,2,3]}}))
console.log(JSON.stringify({b: {a: [1,2,3]}}))