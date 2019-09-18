// 希尔排序
// 对待排记录序列先做宏观调整，再做微观调整。
// 宏观调整，指的是跳跃式的插入排序，即将记录序列分若干子序列，每个子序列分别进行插入排序。
// 希尔排序按照不同步长对元素进行插入排序，当刚开始元素很无序的时候，步长最大，所以插入排序的元素个数很少，速度很快；
// 当元素基本有序了，步长很小，插入排序对于有序的序列效率很高。
// 一次插入排序是稳定的，不会改变相同元素的相对顺序，但在不同的插入排序过程中，相同的元素可能在各自的插入排序中移动，最后其稳定性会被打乱，所以希尔排序是不稳定的。
function shellSort(arr) {
    if (arr.length <= 1) return arr;
    let gap = arr.length >> 1;
    while (gap >= 1) {
        for (let i = gap; i < arr.length; i++) {
            let j = i;
            let temp = arr[i];
            while (j >= 0 && temp < arr[j - gap]) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
        gap = gap >> 1;
    }
    return arr;
}

var arr=[85,24,63,45,17,31,96,50,23];
console.log(shellSort(arr));