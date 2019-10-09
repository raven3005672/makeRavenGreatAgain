// ==的隐式转换

// toString
let a = {
    i: 1,
    toString() {
        return a.i++
    }
}

// valueOf
let a = {
    i: 1,
    valueOf() {
        return a.i++
    }
}

// 数组join方法
let a = [1, 2, 3];
a.join = a.shift;

// Symbol
let a = {
    [Symbol.toPrimitive]: ((i) => () => ++i)(0)
};

if(a == 1 && a == 2 && a == 3) {
    console.log('1');
}



1 + "1"         // "11"
2 * "2"         // 4
[1,2] + [2,1]   // "1,22,1"     Javascript中所有对象基本都是先调用valueOf方法，如果不是数值，再调用toString方法。
"a" + + "b"     // "aNaN"   => 理解为  _ + "b" -> NaN   "a" + NaN -> "aNaN"



String('11') == new String('11')        // true
String('11') === new String('111')      // false
// new String返回的是对象，调用==隐式转换使用toString方法



// example 1
var a={}, b='123', c=123;  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'c'    数字自动转字符串覆盖

// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'b'    Symbol类型都不相等

// example 3
var a={}, b={key:'123'}, c={key:'456'};  
a[b]='b';
a[c]='c';  
console.log(a[b]);
// output => 'c'    都是a.[object Object]


