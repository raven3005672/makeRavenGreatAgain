// instanceOf 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

// 递归实现
const instanceOf1 = (obj, func) => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  let proto = Object.getPrototypeOf(obj);
  if (proto === func.prototype) {
    return true;
  } else if (proto === null) {
    return false;
  } else {
    return instanceOf1(proto, func);
  }
}

// 遍历实现
const instanceOf2 = (obj, func) => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  let proto = obj;
  while (proto = Object.getPrototypeOf(proto)) {
    if (proto === func.prototype) {
      return true;
    }
  }
  return false;
}

// 遍历实现
const instanceOf3 = (obj, func) => {
  if (obj === null || typeof obj !== 'object') {
    return false
  }

  let proto = obj
  // 因为一定会有结束的时候（最顶层Object），所以不会是死循环
  while (true) {
    if (proto === null) {
      return false
    } else if (proto === func.prototype) {
      return true
    } else {
      proto = Object.getPrototypeOf(proto)
    }
  }
}
