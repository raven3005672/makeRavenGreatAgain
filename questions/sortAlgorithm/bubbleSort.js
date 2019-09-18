// 冒泡排序
// 双层循环，内层交换
// 冒泡排序是稳定的排序算法
function bubbleSort(arr) {
    if (arr.length <= 1) return arr;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}

let arr1 = [12,1,345,14,5,234,435,235,2,56,47,365,7,56,236];
console.log(bubbleSort(arr1));