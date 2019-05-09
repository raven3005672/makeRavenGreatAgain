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

