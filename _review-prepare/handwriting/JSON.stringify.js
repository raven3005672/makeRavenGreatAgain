let a = { value: undefined };
JSON.stringify(a);  // '{}' undefined会被忽略

// JSON.stringify(value[, replacer [, space]])

// - value
//   - 将要序列化成 一个 JSON 字符串的值。
// - replacer 可选
//   - 如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
//   - 如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；
//   - 如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。
// - space 可选
//   - 指定缩进用的空白字符串，用于美化输出（pretty-print）；
//   - 如果参数是个数字，它代表有多少的空格；上限为10。
//   - 该值若小于1，则意味着没有空格；
//   - 如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；
//   - 如果该参数没有提供（或者为 null），将没有空格。

// - 当在循环引用时会抛出异常TypeError ("cyclic object value")（循环对象值）
// - 当尝试去转换 BigInt 类型的值会抛出TypeError ("BigInt value can't be serialized in JSON")（BigInt值不能JSON序列化）.


// 1. 转换对象
console.log(JSON.stringify({ name: '前端胖头鱼', sex: 'boy' })) // '{"name":"前端胖头鱼","sex":"boy"}'

// 2. 转换普通值
console.log(JSON.stringify('前端胖头鱼')) // "前端胖头鱼"
console.log(JSON.stringify(1)) // "1"
console.log(JSON.stringify(true)) // "true"
console.log(JSON.stringify(null)) // "null"

// 3. 指定replacer函数
console.log(JSON.stringify({ name: '前端胖头鱼', sex: 'boy', age: 100 }, (key, value) => {
  return typeof value === 'number' ? undefined : value
}))
// '{"name":"前端胖头鱼","sex":"boy"}'

// 4. 指定数组
console.log(JSON.stringify({ name: '前端胖头鱼', sex: 'boy', age: 100 }, ['name']))
// '{"name":"前端胖头鱼"}'

// 5. 指定space(美化输出)
console.log(JSON.stringify({ name: '前端胖头鱼', sex: 'boy', age: 100 }))
// '{"name":"前端胖头鱼","sex":"boy","age":100}'
console.log(JSON.stringify({ name: '前端胖头鱼', sex: 'boy', age: 100 }, null, 2))
/*
{
  "name": "前端胖头鱼",
  "sex": "boy",
  "age": 100
}
*/


// 特性
// - undefined、任意的函数以及symbol值，出现在非数组对象的属性值中时在序列化过程中会被忽略
// - undefined、任意的函数以及symbol值出现在数组中时会被转换成 null。
// - undefined、任意的函数以及symbol值被单独转换时，会返回 undefined
// - 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
// - 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
// - NaN 和 Infinity 格式的数值及 null 都会被当做 null。
// - 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
// - Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
// - 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
// - 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
// - 当尝试去转换 BigInt 类型的值会抛出错误


const jsonStringify = (data) => {
  // 确认一个对象是否存在循环引用
  const isCyclic = (obj) => {
    // 使用Set数据类型来存储已经检测过的对象
    let stackSet = new Set();
    let detected = false;
    const detect = (obj) => {
      // 不是对象类型的话，可以直接跳过
      if (obj && typeof obj != 'object') {
        return
      }
      // 当要检查的对象已经存在于stackSet中时，表示存在循环引用
      if (stackSet.has(obj)) {
        return detected = true;
      }
      // 将当前obj存如stackSet
      stackSet.add(obj);
      for (let key in obj) {
        // 对obj下的属性进行挨个检测
        if (obj.hasOwnProperty(key)) {
          detect(obj[key])
        }
      }
      // 平级检测完成之后，将当前对象删除，防止误判
      /*
        例如：对象的属性指向同一引用，如果不删除的话，会被认为是循环引用
        let tempObj = {
          name: '前端胖头鱼'
        }
        let obj4 = {
          obj1: tempObj,
          obj2: tempObj
        }
      */
      stackSet.delete(obj);
    }
    detect(obj);
    return detected;
  }

  // 特性七:
  // 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
  if (isCyclic(data)) {
    throw new TypeError('Converting circular structure to JSON');
  }

  // 特性九:
  // 当尝试去转换 BigInt 类型的值会抛出错误
  if (typeof data === 'bigint') {
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  const type = typeof data;
  const commonKeys1 = ['undefined', 'function', 'symbol'];
  const getType = (s) => {
    return Object.prototype.toString.call(s).replace(/\[object (.*?)\]/, '$1').toLowerCase();
  }

  // 非对象
  if (type !== 'object' || data === null) {
    let result = data;
    // 特性四：
    // NaN 和 Infinity 格式的数值及 null 都会被当做 null。
    if ([NaN, Infinity, null].includes(data)) {
      result = 'null';
      // 特性一：
      // `undefined`、`任意的函数`以及`symbol值`被`单独转换`时，会返回 undefined
    } else if (commonKeys1.includes(type)) {
      // 直接得到undefined，并不是一个字符串'undefined'
      return undefined;
    } else if (type === 'string') {
      result = '"' + data + '"';
    }
    return String(result);
  } else if (type === 'object') {
    // 特性五:
    // 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化
    // 特性六:
    // Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
    if (typeof data.toJSON === 'function') {
      return jsonstringify(data.toJSON());
    } else if (Array.isArray(data)) {
      let result = data.map((it) => {
        // 特性一:
        // `undefined`、`任意的函数`以及`symbol值`出现在`数组`中时会被转换成 `null`
        return commonKeys1.includes(typeof it) ? 'null' : jsonstringify(it);
      })

      return `[${result}]`.replace(/'/g, '"');
    } else {
      // 特性二：
      // 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
      if (['boolean', 'number'].includes(getType(data))) {
        return String(data);
      } else if (getType(data) === 'string') {
        return '"' + data + '"';
      } else {
        let result = [];
        // 特性八
        // 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
        Object.keys(data).forEach((key) => {
          // 特性三:
          // 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
          if (typeof key !== 'symbol') {
            const value = data[key];
            // 特性一
            // `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略
            if (!commonKeys1.includes(typeof value)) {
              result.push(`"${key}":${jsonStringify(value)}`);
            }
          }
        });
        return `{${result}}`.replace(/'/, '"');
      }
    }
  }
}
