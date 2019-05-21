// 示例 1：

// 输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
// 输出: [5, 6, 7, 1, 2, 3, 4]
// 解释:
// 向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
// 向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
// 向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]
// 示例 2：

// 输入: [-1, -100, 3, 99] 和 k = 2
// 输出: [3, 99, -1, -100]
// 解释: 
// 向右旋转 1 步: [99, -1, -100, 3]
// 向右旋转 2 步: [3, 99, -1, -100]

const arr = [1,2,3,4,5,6,7];
const k = 3;
function trans(arr, k) {
    let result = arr.slice();
    for (let i = 0; i < k; i++) {
        result.unshift(result[result.length - i - 1]);
    }
    result.length = arr.length;
    return result;
}

console.log(trans(arr, k))