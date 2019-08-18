function poke(arr) {
    let i = 1;
    let out = [];
    while (arr.length) {
        if (i % 2) {
            out.push(arr.shift());
        } else {
            arr.push(arr.shift());
        }
        i++;
    }
    return out;
}

function reverse(arr) {
    let i = 1;
    let out = [];
    while(arr.length) {
        if (i % 2) {
            out.unshift(arr.pop());
        } else {
            out.unshift(out.pop());
        }
        i++;
    }
    return out;
}