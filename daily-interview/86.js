// 假设每个输入只对应一种答案，且同样的元素不能被重复利用
let nums = [10, 2, 7, 11, 15], target = 9;

function findResult(arr, target) {
    // let arr = arr.sort(nums);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= target) {
            let a = arr.indexOf(target - arr[i]);
            if (a > -1) {
                return [i, a];
            }
        }
    }
}

console.log(findResult(nums, target))