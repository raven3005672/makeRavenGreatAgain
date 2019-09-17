// 快速排序
// 平均状况下，排序n个项目要O(nlogn)次比较。在最坏状况下则需要O(n2)次比较，但这种状况并不常见。
// 事实上，快速排序通常明显比其他O(nlogn)算法更快，因为它的内部循环可以在大部分架构上很有效率地被实现出来。

// 快速排序使用分治法(Divide and conquer)策略来把一个串行(list)分为两个子串行(sub-lists)。

// 算法步骤
// 1.从数列中挑出一个元素，称为"基准"（pivot）
// 2.重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区(partition)操作。
// 3.递归的把所有小于基准值元素的子数列和大于基准值元素的子数列排序。

// 递归最底部情况，是数列的大小是0或1，也就是永远都已经被排序好了。虽然一直递归下去，但是这个算法总会退出，因为在每次的迭代中，它至少会把一个元素拜倒它最后的位置去。

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let pivotIndex = arr.length >> 1;
    let pivot = arr.splice(pivotIndex, 1)[0];
    let left = [];
    let right = [];
    for (let i = 0; i< arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}

console.log(quickSort([3,3,4,15,331,348,98,12]));

