// 归并排序
// 将两个或两个以上的有序表合并成一个新的有序表，即把待排序序列分为若干个子序列，每个子序列是有序的。然后再把有序子序列合并为整体有序序列。
// 1.分解——将序列每次折半划分
// 2.合并——将划分后的序列段两两合并后排序
// 稳定排序
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = arr.length >> 1;
    let left = arr.slice(0, mid);
    let right = arr.slice(mid, arr.length);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [],
        i = 0,
        j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    while (i < left.length) {
        result.push(left[i++]);
    }
    while (j < right.length) {
        result.push(right[j++]);
    }
    return result;
}

var arr = [12,123,1,234234,13,412,31,23,123,123,123,23,41,34,32]
console.log(mergeSort(arr))