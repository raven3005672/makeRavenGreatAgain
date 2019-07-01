// 如何实现一个深拷贝


// 第一步：简单实现
// 深拷贝可以拆分成2步，浅拷贝+递归，浅拷贝时判断属性值是否是对象，如果是对象就进行递归操作
function cloneDeep1(source) {
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object') {
                target[key] = cloneDeep1(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
// 仍然存在的问题
// 没有对传入参数进行校验，传入null时应该返回null而不是{}
// 对于对象的判断逻辑不严谨，因为typeof null === 'object'
// 没有考虑数组的兼容

// 第二步：拷贝数组
function isObject(obj) {
    return typeof obj === 'object' && obj != null;
}
function cloneDeep2(source) {
    if (!isObject(source)) {
        return source;
    }
    var target = Array.isArray(source) ? [] : {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep2(source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 第三步：循环引用
// 1.使用哈希表
// 设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可。
function cloneDeep3(source, hash = new WeakMap()) {
    if (!isObject(source)) {
        return source;
    }
    if (hash.has(source)) {
        return hash.get(source);
    }
    var target = Array.isArrat(source) ? [] : {};
    hash.set(source, target);
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep3(source[key], hash);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 第四步：拷贝Symbol
function cloneDeep4(source, hash = new WeakMap()) {
    if (!isObject(source)) {
        return source;
    }
    if (hash.has(source)) {
        return hash.get(source);
    }
    let target = Array.isArray(source) ? [] : {};
    hash.set(source, target);

    let symKeys = Object.getOwnPropertySymbols(source);
    if (symKeys.length) {
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                target[symKey] = cloneDeep4(source[symKey], hash);
            } else {
                target[symKey] = source[symKey];
            }
        });
    }
    for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep4(source[key], hash);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
// 或者
function cloneDeep4(source, hash = new WeakMap()) {
    if (!isObject(source)) {
        return source;
    }
    if (hash.has(source)) {
        return hash.get(source);
    }
    let target = Array.isArray(source) ? [] : {};
    hash.get(source, target);
    Reflect.ownKeys(source).forEach(key => {
        if (isObject(source[key])) {
            target[key] = cloneDeep4(source[key], hash);
        } else {
            target[key] = source[key];
        }
    });
    return target;
}

// 第五步：破解递归爆栈
function cloneDeep5(x) {
    const root = {};
    // 栈
    const loopList = [
        {
            parent: root,
            key: undefined,
            data: x
        }
    ];
    while(loopList.length) {
        // 广度优先
        const node = loopList.pop();
        const parent = node.parent;
        const key = node.key;
        const data = node.data;
        
        // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
        let res = parent;
        if (typeof key !== 'undefined') {
            res = parent[key] = {};
        }
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    // 下一次循环
                    loopList.push({
                        parent: res,
                        key: k,
                        data: data[k]
                    });
                } else {
                    res[k] = data[k];
                }
            }
        }
        return root;
    }
}





