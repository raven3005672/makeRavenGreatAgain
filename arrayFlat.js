var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

var result = [];
function arrFlat(array) {
    return array.reduce((acc, v) => {
        let temp = Array.isArray(v) ? arrFlat(v) : [v];
        return acc.concat(temp);
    }, []);
}
function arrFlatSort(array) {
    return Array.from(new Set(arrFlat(array).sort((a,b) => {return a - b})));
}
console.log(arrFlatSort(arr));

// flat方法，infinity表示嵌套深度无限
let test1 = Array.from(new Set(arr.flat(Infinity))).sort((a,b) => a - b);
console.log(test1);

// toString方法，改变原数据类型，不推荐
let test2 = Array.from(new Set(arr.toString().split(',').map(Number).sort((a,b) => a - b)));
console.log(test2);