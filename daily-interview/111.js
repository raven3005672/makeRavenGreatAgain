function flatObj (obj, parentKey = "", result = {}) {
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            let keyName = `${parentKey}${key}`;
            if (typeof obj[key] === 'obj') {
                flatObj(obj[key], keyName + ".", result);
            } else {
                result[keyName] = obj[key];
            }
        }
    }
    return result;
}

function changeObjToNormal(output) {
    let keys = Object.keys(output);
    let resObj = {};
    for (let key of keys) {
        let everyKey = key.split('.');
        everyKey.reduce((pre, next, index, array) => {
            if (index === array.length - 1) {
                pre[next] = output[key];
                return;
            }
            pre[next] = resObj[next] || {};
            return pre[next];
        }, resObj);
    }
    return resObj;
}