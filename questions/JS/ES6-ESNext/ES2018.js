// Rest/Spread Properties


// 异步迭代器
// for-await-of
// 只能在async函数中使用它
for await (const line of readLines(filePath)) {}


// Promise.prototype.finally()
// 无论成功或者失败，都会执行一些代码
fetch('file.json')
    .then(data => data.json)
    .catch(error => console.error(error))
    .finally(() => console.log('finished'))


// 正则表达式改进
// 使用 ?= 来匹配字符串，后面跟随一个特定的字符串：
/Roger(?=Waters)/
/Roger(?= Waters)/.test('Roger is my dog') //false
/Roger(?= Waters)/.test('Roger is my dog and Roger Waters is a famous musician') //true
// ?! 可以执行逆操作，如果匹配的字符串是no而不是在此后跟随特定的子字符串的话：
/Roger(?!Waters)/
/Roger(?! Waters)/.test('Roger is my dog') //true
/Roger(?! Waters)/.test('Roger Waters is a famous musician') //false
// ?<=
/(?<=Roger) Waters/
/(?<=Roger) Waters/.test('Pink Waters is my dog') //false
/(?<=Roger) Waters/.test('Roger is my dog and Roger Waters is a famous musician') //true
// ?>!
/(?<!Roger) Waters/
/(?<!Roger) Waters/.test('Pink Waters is my dog') //true
/(?<!Roger) Waters/.test('Roger is my dog and Roger Waters is a famous musician') //false
// Unicode属性转义
// 在正则表达式模式中，你可以使用 \d 来匹配任意的数字，\s 来匹配任意不是空格的字符串，\w 来匹配任意字母数字字符串，以此类推。
// named capturing groups
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
const result = re.exec('2015-01-02')
// s flag
/hi.welcome/.test('hi\nwelcome') // false
/hi.welcome/s.test('hi\nwelcome') // true
