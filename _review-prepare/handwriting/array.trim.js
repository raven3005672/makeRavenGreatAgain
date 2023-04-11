// 去除空格法
const trim = (str) => {
  return str.replace(/^\s*|\s*$/g, '');
}

// 字符提取法
const trim = (str) => {
  return str.replace(/^\s*(.*?)\s*$/g, '$1')
}
