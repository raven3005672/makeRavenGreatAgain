// Array.prototype.{flat,flatMap}
// 多维数组摊平
['Dog', ['Sheep', ['Wolf']]].flat()
//[ 'Dog', 'Sheep', [ 'Wolf' ] ]
['Dog', ['Sheep', ['Wolf']]].flat(2)
//[ 'Dog', 'Sheep', 'Wolf' ]
['Dog', ['Sheep', ['Wolf']]].flat(Infinity)
//[ 'Dog', 'Sheep', 'Wolf' ]
['My dog', 'is awesome'].flatMap(words => words.split(' '))
//[ 'My', 'dog', 'is', 'awesome' ]


// Optional catch binding
try {} catch {}


// Object.fromEntries()
// 可以从entries属性数组中创建一个新的对象
const person = { name: 'Fred', age: 87 }
const entries = Object.entries(person)
const newPerson = Object.fromEntries(entries)
person !== newPerson //true


// String.prototype.{trimStart,trimEnd}


// Symbol.prototype.description
// 可以使用 description 来获取 Symbol 的值，而不必使用 toString() 方法
const testSymbol = Symbol('Test')
testSymbol.description // 'Test'


// JSON improvements
// 支持分隔符（\u2028）和分隔符（\u2029）


// Function.prototype.toString()
function /* this is bar */ bar () {}
bar.toString(); // 'function /* this is bar */ bar () {}'   // 保留注释
