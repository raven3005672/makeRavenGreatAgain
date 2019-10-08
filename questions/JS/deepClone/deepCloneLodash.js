// https://github.com/yygmind/blog/issues/31
// lodash 如何实现深拷贝 v4.17.11

// 位掩码用于处理同时存在多个布尔选项的情况，其中掩码中的每个选项的值都等于2的幂。相比直接使用变量来说，优点是可以节省内存。
const CLONE_DEEP_FLAG = 1;              // 0001
const CLONE_FLAT_FLAG = 2;              // 0010
const CLONE_SYMBOLS_FLAG = 4;           // 0100
// 第一个参数是需要考必的对象，第二个是位掩码(Bitwise)
function cloneDeep(value) {
    // CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG => 0001 | 0100 => 0101 => 5
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
// value 需要拷贝的对象
// bitmask 位掩码，1是深拷贝，2拷贝原型链上的属性，4拷贝Symbols属性
// customizer 定制clone函数
// key 传入value值的key
// object 传入value值的父对象
// stack Stack栈，用来处理循环引用
function baseClone(value, bitmask, customizer, key, object, stack) {
    let result;
    

    // 标志位-按位与&
    const isDeep = bitmask & CLONE_DEEP_FLAG;       // 深拷贝 5 & 1 => 1, true
    const isFlat = bitmask & CLONE_FLAG_FLAG;       // 拷贝原型链 5 & 2 => 0, false
    const isFull = bitmask & CLONE_SYMBOLS_FLAG;    // 拷贝Symbol 5 & 4 => 4, true


    // 自定义clone函数
    if (customizer) {
        // 存在定制clone函数时，如果存在value值的父对象，就传入相应值；不存在则直接传入value执行定制函数
        result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    // 返回值result不为空则返回执行结果
    if (result !== undefined) {
        return result;
    }


    // 非对象 => 非对象直接返回本来的值
    if (!isObject(value)) {
        return value;
    }


    const isArr = Array.isArray(value);
    if (isArr) {
        // 数组
        result = initCloneArray(value);
        if (!isDeep) {
            return copyArray(value, result);
        }
    } else {


        // 对象
        const tag = getTag(value);
        const isFunc = typeof value == 'function';


        // Buffer对象
        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
        }


        // Obejct对象、类数组、或者是函数但是没有父对象
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            // 拷贝原型链或者value是函数时，返回{}，不然初始化对象
            result = (isFlat || isFunc) ? {} : initCLoneObject(value);
            if (!isDeep) {
                return isFlat
                    ? copySymbolsIn(value, copyObject(value, keysIn(value), result))
                    : copySymbols(value, Object.assign(result, value));
            }
        } else {
            // 在cloneableTags中，只有error和weakmap返回false
            if (isFunc || !cloneableTags[tag]) {
                return object ? value : {};
            }
            result = initCloneByTag(value, tag, isDeep);
        }
    }


    // 循环引用
    // 如果当前拷贝的值已存在与栈中，说明有环，直接返回即可。栈中没有该值时保存到栈中，传入value和result。
    // 这里的result是一个对象引用，后续对result的修改也会反映到栈中。
    stack || (stack = new Stack);
    const stacked = stack.get(value);
    if (stacked) {
        return stacked;
    }
    stack.set(value, result);


    // Map
    if (tag == mapTag) {
        value.forEach((subValue, key) => {
            result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
        return result;
    }


    // Set
    if (tag == setTag) {
        value.forEach((subValue) => {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack))
        });
        return result;
    }


    // TypedArray
    if (isTypedArray(value)) {
        return result;
    }


    // Symbol & 原型链
    const keysFunc = isFull ?
        (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);
    const props = isArr ? undefined : keysFunc(value);
    // 遍历赋值
    arrayEach(props || value, (subValue, key) => {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    // 返回结果
    return result;
}



function isObject(value) {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
function initCloneArray(array) {
    const {length} = array;
    const result = new array.constructor(length);
    // 对于存在regexp#exec返回的数组，拷贝属性index和input。判断逻辑是长度大于0，数组的第一个元素是字符串类型、数组存在index属性
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}
function copyArray(source, array) {
    let index = -1;
    const length = source.length;
    array || (array = new Array(length));
    while(++index < length) {
        array[index] = source[index];
    }
    return array;
}
function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !isPrototype(object)) 
        ? Object.create(Object.getPrototypeOf(object))
        : {};
}
function isPrototype(value) {
    const Ctor = value && value.constructor;
    const proto = (typeof Ctor == 'function' && Ctor.prototype) || Object.prototype;
    return value === proto;
}
function initCloneByTag(object, tag, isDeep) {
    const Ctor = object.constructor;
    switch(tag) {
        case arrayBufferTag:
            return cloneArrayBuffer(object);
        case boolTag: // 布尔与时间类型
        case dateTag:
            return new Ctor(+object);
        case dataViewTag:
            return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
                return cloneTypedArray(object, isDeep);
            case mapTag: // Map 类型
                return new Ctor;
            case numberTag: // 数字和字符串类型
            case stringTag:
                return new Ctor(object);
            case regexpTag: // 正则
                return cloneRegExp(object);
            case setTag: // Set 类型
                return new Ctor;
            case symbolTag: // Symbol 类型
                return cloneSymbol(object);
    }
}
// \w 用于匹配字母，数字或下划线字符，相当于[A-Za-z0-9_]
const reFlags = /\w*$/;
function cloneRegExp(regexp) {
    // 返回当前匹配的文本
    const result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    // 下一次匹配的起始索引
    result.lastIndex = regexp.lastIndex;
    return result;
}
const symbolValueOf = Symbol.prototype.valueOf;
function cloneSymbol(symbol) {
    return Object(symbolValueOf.call(symbol));
}
// 创建一个包含自身和原型链上可枚举属性名以及 Symbol 的数组
// 使用 for...in 遍历
function getAllKeysIn(object) {
    const result = keysIn(object);
    if (!Array.isArray(object)) {
        result.push(...getSymbolsIn(object));
    }
    return result;
}
// 创建一个仅包含自身可枚举属性名以及 Symbol 的数组
// 非 ArrayLike 数组使用 Object.keys
function getAllKeys(object) {
    const result = keys(object);
    if (!Array.isArray(object)) {
        result.push(...getSymbols(object));
    }
    return result;
}
// 创建一个包含自身和原型链上可枚举属性名的数组
// 使用 for...in 遍历
function keysIn(object) {
    const result = [];
    for (const key in object) {
        result.push(key);
    }
    return result
}
// 创建一个仅包含自身可枚举属性名的数组
// 非 ArrayLike 数组使用 Object.keys
function keys(object) {
    return isArrayLike(object)
        ? arrayLikeKeys(object)
    	: Object.keys(Object(object))
}
// 创建一个包含自身和原型链上可枚举 Symbol 的数组
// 通过循环和使用 Object.getPrototypeOf 获取原型链上的 Symbol
function getSymbolsIn (object) {
    const result = [];
    while (object) { // 循环
        result.push(...getSymbols(object));
        object = Object.getPrototypeOf(Object(object));
    }
    return result;
}
// 创建一个仅包含自身可枚举 Symbol 的数组
// 通过 Object.getOwnPropertySymbols 获取 Symbol 属性
const nativeGetSymbols = Object.getOwnPropertySymbols;
const propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
function getSymbols (object) {
    if (object == null) { // 判空
        return [];
    }
    object = Object(object);
    return nativeGetSymbols(object)
        .filter((symbol) => propertyIsEnumerable.call(object, symbol));
}
function arrayEach(array, iteratee) {
    let index = -1;
    const length = array.length;

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
// 如果现有值不相等，则将 value 分配给 object[key]。
function assignValue(object, key, value) {
    const objValue = object[key];
    // 不相等
    if (! (hasOwnProperty.call(object, key) && eq(objValue, value)) ) {
        // 值可用
        if (value !== 0 || (1 / value) == (1 / objValue)) {
            baseAssignValue(object, key, value);
        }
    // 值未定义而且键 key 不在对象中    
    } else if (value === undefined && !(key in object)) {
        baseAssignValue(object, key, value);
    }
}
// 赋值基本实现，其中没有值检查。
function baseAssignValue(object, key, value) {
    if (key == '__proto__') {
        Object.defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
        });
    } else {
        object[key] = value;
    }
}
// 比较两个值是否相等
// (value !== value && other !== other) 是为了判断 NaN
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}