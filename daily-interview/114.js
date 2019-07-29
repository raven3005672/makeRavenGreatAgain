var a = 'abcaakjbb'
var b = {'a': 2, 'b': 2}

function xxx(str) {
    let map = [];
    let last = str[0];
    let count = 1;
    for (let i = 1; i < str.length + 1; i++) {
        if (str[i] == last) {
            count++;
        } else {
            if (map[count]) {
                map[count].push(last);
            } else {
                map[count] = [last];
            }
            count = 1;
            last = str[i];
        }
    }
    let res = map[map.length - 1].reduce((a,b,index,arr) => {
        a[arr[index]] = map.length - 1;
        return a;
    }, {});
    return res;
}
xxx(a)