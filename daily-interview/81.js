function findMirror(min, max) {
    let start = min;
    let result = [];
    while (start <= max) {
        startStr = start.toString();
        if (startStr.split('').reverse().join('') == startStr) {
            result.push(start);
        }
        start++;
    }
    return result;
}

// console.log(findMirror(1, 10000))