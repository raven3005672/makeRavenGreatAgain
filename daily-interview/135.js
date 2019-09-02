const a = "红蓝蓝黄红黄蓝红红黄红";

function sortStr(str) {
    let a = str.split('');
    let map = {};
    for (let i = 0; i < a.length; i++) {
        if (map[a[i]]) {
            map[a[i]]++;
        } else {
            map[a[i]] = 1;
        }
    }
    let y = Array.from({length: map['黄']}, () => '黄');
    let r = Array.from({length: map['红']}, () => '红');
    let b = Array.from({length: map['蓝']}, () => '蓝');
    return y.concat(r,b).join('');
}

sortStr(a);


function sortBalls (str) {
    let arr = str.split('')
    arr.sort((a, b) => {
        return getNumByType(a) - getNumByType(b)
    });
    return arr.join('')
}  
function getNumByType (type) {
    switch (type) {
    case '黄':
        return 1
    case '红':
        return 2
    default:
        return 3
    }
}

