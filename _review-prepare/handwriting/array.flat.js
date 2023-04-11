// 递归实现
const flat1 = (array) => {
  return array.reduce((result, it) => {
    return result.concat(Array.isArray(it) ? flat1(it) : it)
  }, []);
}

// 遍历实现
const flat2 = (array) => {
  const result = [];
  const stack = [...array];
  while(stack.length !== 0) {
    // 取出最后一个元素
    const val = stack.pop();
    if (Array.isArray(val)) {
      // 遇到是数组的情况，往stack后面推入
      stack.push(...val);
    } else {
      // 往数组前面推入
      result.unshift(val);
    }
  }
  return result;
}

// es
const flat3 = (array) => {
  return array.flat(Infinity);
}