// 转载
// 一、用好filter、map等es6的新增的高阶遍历函数
// 1.去除数组中的false值
const arrContainsEmptyVal = [3,4,5,2,3,undefined,null,0,""];
const compact = arr => arr.filter(Boolean);
// console.log(compact(arrContainsEmptyVal))

// 2.将数组中的VIP用户余额加10  // 此处有浅拷贝问题，解法：ramda/immer
const user = [
    {username: 'Kelly', isVIP: true, balance: 20},
    {username: 'Tom', isVIP: false, balance: 19},
    {username: 'Stephanie', isVIP: true, balance: 30}
];
const vipPlusTen = arr => arr.map(user => (user.isVIP ? {...user, balance: user.balance + 10} : user));
// console.log(vipPlusTen(user));

// 3.判断字符串中是否含有元音字母
const randomStr = "ahfoasdifpaidsf";
const isVowel = char => ["a","e","i","o","u"].includes(char);
const containsVowel = str => [...str].some(isVowel);
// console.log(containsVowel(randomStr));

// 4.判断用户是否全部是成年人
const users = [
    {name: 'jim', age: 23},
    {name: 'lily', age: 17},
    {name: 'will', age: 25}
];
const isAllAdult = arr => arr.every(user => user.age >= 18);
// console.log(isAllAdult(users));

// 5.找出上面用户中的第一个未成年人
const findTeen = arr => arr.find(user => user.age < 18);
// console.log(findTeen(users));

// 6.清除数组中的重复项目
const dupArr = [1,2,3,3,3,3,6,7];
const uniq = arr => [...new Set(arr)];
// console.log(uniq(dupArr));

// 7.生成由随机整数组成的数组，数组长度和元素大小可自定义
const genNumArr = (length, limit) => Array.from({length}, _ => Math.floor(Math.random() * limit));
// console.log(genNumArr(10, 100));

// 理解和熟练使用reduce
// 8.不接触原生高阶函数，定义reduce
const reduce = (f, acc, arr) => {
    if (arr.length === 0) return acc;
    const [head, ...tail] = arr;
    return reduce(f, f(head, acc), tail);
}

// 9.将多层数组转换成一层数组
const nestedArr = [1,2,[3,4,[5,6]]];
const flatten = arr => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), []);
// console.log(flatten(nestedArr));

// 10.将下面数组转成对象，key/value对应里层数组的两个值
const objLikeArr = [["name", "Jim"], ["age", 18], ["single", true]];
const fromPairs = pairs => pairs.reduce((res, pair) => (res[pair[0]] = pair[1], res), {});
// console.log(fromPairs(objLikeArr));

// 11.取出对象中的深层属性
const deepAttr = {a: {b: {c: 15}}};
const pluckDeep = path => obj => path.split(".").reduce((val, attr) => val[attr], obj);
// console.log(pluckDeep("a.b.c")(deepAttr));

// 12.将用户中的男性和女性分别放到不同的数组里
const usersFM = [
    {name: 'adam', age: 30, sex: 'male'},
    {name: 'helen', age: 27, sex: 'female'},
    {name: 'amy', age: 25, sex: 'female'},
    {name: 'anthony', age: 23, sex: 'male'}
];
const partition = (arr, isValid) => arr.reduce(([pass, fail], elem) => isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]], [[], []]);
const isMale = person => person.sex === 'male';
const [maleUser, femaleUser] = partition(usersFM, isMale);
// console.log(maleUser)
// console.log(femaleUser)

// 13.reduce的计算过程，在范畴轮里面叫catamorphism, 即一种连接的变形。和它相反的变形叫anamorphism。
// 现在我们定义一个和reduce计算过程相反的函数unfold(注:reduce在Haskell里面叫fold，对应unfold)
const unfold = (f, seed) => {
    const go = (f, seed, acc) => {
        const res = f(seed);
        return res ? go(f, res[1], acc.concat(res[0])) : acc;
    };
    return go(f, seed, []);
};
// 根据这个unfold函数，顶一个一个python里面的range函数
const range = (min, max, step = 1) => unfold(x => x < max && [x, x + step], min);
// console.log(range(1,100,3))

// 三、用递归代理循环【递归可能存在爆栈问题，且性能不如循环，谨慎使用】
// 14.将两个数组每个元素一一对应相加。注意，第二个数组比第一个多出两个，不要把第二个数组遍历完。
const num1 = [3,4,5,6,7];
const num2 = [43,23,5,67,87,3,6];

const zipWith = f => xs => ys => {
    if (xs.length === 0 || ys.length === 0) return [];
    const [xHead, ...xTail] = xs;
    const [yHead, ...yTail] = ys;
    return [f(xHead)(yHead), ...zipWith(f)(xTail)(yTail)];
}
const add = x => y => x + y;
// console.log(zipWith(add)(num1)(num2));

// 15.将stark家族成员提取出来。注意，目标数据在数组前面，使用filter方法遍历整个数组是浪费
const houses = [
    "Eddard Stark",
    "Catelyn Stark",
    "Rickard Stark",
    "Brandon Stark",
    "Rob Stark",
    "Sansa Stark",
    "Arya Stark",
    "Bran Stark",
    "Rickon Stark",
    "Lyanna Stark",
    "Tywin Lannister",
    "Cersei Lannister",
    "Jaime Lannister",
    "Tyrion Lannister",
    "Joffrey Baratheon"
];

// const filterStark = people => people.match(/\sStark/);
// console.log(houses.filter(filterStark));
const takeWhile = f => ([head, ...tail]) => f(head) ? [head, ...takeWhile(f)(tail)] : [];
const isStark = name => name.toLowerCase().includes("stark");
// console.log(takeWhile(isStark)(houses));

// 16.找出数组中的奇数，然后取出前四个
const numList = [1,3,11,4,2,5,6,7];

const takeFirst = (limit, f, arr) => {
    if (limit === 0 || arr.length === 0) return [];
    const [head, ...tail] = arr;
    return f(head) ? [head, ...takeFirst(--limit, f, tail)] : takeFirst(limit, f, tail);
}
const isOdd = n => n % 2 === 1;
// console.log(takeFirst(4, isOdd, numList));

// 四、使用高阶函数遍历数组时可能遇到的陷阱
// 17.从长度为100w的随机整数组成的数组中取出偶数，再把所有数字乘以3
const bigArr = genNumArr(1e6, 100);

const isEven = num => num % 2 === 0;
const triple = num => num * 3;
// console.log(bigArr.filter(isEven).map(triple));     // 遍历两次

const results = [];     // for循环遍历一次
for (let i = 0; i < bigArr.length; i++) {
    if (isEven(bigArr[i])) {
        results.push(triple(bigArr[i]));
    }
}
// console.log(results)

// transduce思想，首先定义filter和map
// const filter = (f, arr) => arr.reduce((acc, val) => (f(val) && acc.push(val), acc), []);
// const map = (f, arr) => arr.reduce((acc, val) => (acc.push(f(val)), acc), []);
// 重新定义的filter和map有共有的逻辑。我们把这部分共有的逻辑叫做reducer。有了共有的逻辑后，我们可以进一步地抽象，把reducer抽离出来，然后传入filter和map
const filter = f => reducer => (acc, value) => {
    if (f(value)) return reducer(acc, value);
    return acc;
};
const map = f => reducer => (acc, value) => reducer(acc, f(value));
// 现在filter和map的函数signature一样，我们就可以进行函数组合function composition
const pushReducer = (acc, value) => (acc.push(value), acc);
var test1 = bigArr.reduce(map(triple)(filter(isEven)(pushReducer)), []);
// console.log(test1)
// 但是这样嵌套写法易读性太差，很容易出错。我们可以写一个工具函数来辅助函数组合
const pipe = (...fns) => (...args) => fns.reduce((fx, fy) => fy(fx), ...args);
var test2 = bigArr.reduce(
    pipe(
        filter(isEven),
        map(triple)
    )(pushReducer),
    []
);
// console.log(test2)

// 六、for循环和for...of循环的区别
// for...of循环是为了遍历Iterable数据类型才产生的，包含数组、字符串、set和map。属于重型的操作
// 18.将stark家族成员名字遍历，每次遍历暂停一秒，然后将当前遍历的名字打印，遍历完后回到第一个元素再重新开始，无限循环。
const starks = [
    "Eddard Stark",
    "Catelyn Stark",
    "Rickard Stark",
    "Brandon Stark",
    "Rob Stark",
    "Sansa Stark",
    "Arya Stark",
    "Bran Stark",
    "Rickon Stark",
    "Lyanna Stark"
];

function* repeatedArr(arr) {
    let i = 0;
    while(i < arr.length) {
        yield arr[i++ % arr.length];
    }
}
const infiniteNameList = repeatedArr(starks);
const wait = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
(async () => {
    for (const name of infiniteNameList) {
        await wait(1000);
        console.log(name);
    }
});     // ()

// 七、必要时使用for循环
// 以下为实例，实际使用中不要破坏原型链
Number.prototype[Symbol.iterator] = function* () {
    for (let i = 0; i <= this; i++) {
        yield i;
    }
};
// console.log([...6]);