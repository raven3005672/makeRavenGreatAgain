// 插入排序
// 直接插入排序
// 将一个记录插入到已排序好的有序表中，从而得到一个新的、记录数增1的有序表。
// 即：先将序列的第一个记录看成是一个有序的子序列，然后从第二个记录逐个进行插入，直至整个序列有序为止。
// 稳定排序
function insertSort(arr) {
    if (arr.length <= 1) return arr;
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        let j = i;
        while (j > 0 && temp < arr[j - 1]) {
            arr[j] = arr[j - 1];
            j--;
        }
        arr[j] = temp;
    }
    return arr;
}

var arr=[85,24,63,45,17,31,96,50];
console.log(insertSort(arr));
console.log(arr)