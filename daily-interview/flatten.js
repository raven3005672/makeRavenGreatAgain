const flatten = function (arr) {
    while(arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

const flatten = array => array.reduce(
    (acc, cur) => (Array.isArray(cur) ? [...acc, ...flatten(cur)] : [...acc, cur]),
    []
);