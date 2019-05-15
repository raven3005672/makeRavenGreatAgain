function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let initArr = Array.from({length: 10}, (v) => getRandom(0, 99));
initArr.sort((a,b) => a-b);
let result = [];
for (let i = 0; i < initArr.length; i++) {
    let tmpArr = [initArr[i]];
    let index = initArr.length;
    for (let j = i + 1, count = 1; j < initArr.length; j++, count++) {
        if (initArr[i] + count === initArr[j]) {
            tmpArr.push(initArr[j]);
        } else {
            index = j - 1;
            break;
        }
    }
    i = index;
    result.push(tmpArr);
}
console.log(result);