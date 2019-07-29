function isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
function parseObj(obj) {
    let keys = Object.keys(obj).sort();
    let newObj = {};
    for (let key of keys) {
        obj[key] = isObj(obj[key]) ? parseObj(obj[key]) : obj[key];
        newObj[key] = obj[key]
    }
    return newObj;
}
function passArr(arr) {
    return [...new Set(arr.map(item => {
        return isObj(item) ? JSON.stringify(parseObj(item)) : (!item ? item : JSON.stringify(item))
    }))].map(item => {
        return !item ? item : JSON.parse(item)
    })
}