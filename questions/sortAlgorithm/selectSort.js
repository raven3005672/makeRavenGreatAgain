// 选择排序
// 原址比较排序算法，大致思路是找到序列中最小值与第一个元素交换，接着找到次小值与第二个元素交换，以此类推
// 非稳定排序
function selectSort(arr) {
    if (arr.length <= 1) return arr;
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            minIndex = (arr[j] < arr[minIndex]) ? j : minIndex;
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}


var arr=[85,24,63,45,17,31,96,50];
console.log(selectSort(arr));
console.log(arr);