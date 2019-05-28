// 输入: [0,1,0,3,12]
// 输出: [1,3,12,0,0]
// 说明：必须在原数组上操作，不能拷贝额外的数组、尽量减少操作次数

function lastZero(inputArr) {
    let i = 0;
    while (i < inputArr.length) {
        if (inputArr[i] === 0) {
            inputArr.splice(i, 1);
            inputArr.push(0);
        } else {
            i++;
        }
        let check = inputArr.slice(i, inputArr.length).reduce((a, b) => a + b, 0);
        if (check === 0) {
            i = inputArr.length;
        }
    }
    console.log(inputArr)
    return inputArr;
}

lastZero([0, 0, 1, 0, 3, 12])

// 双指针
// 设定一个慢指针一个快指针，快指针每次+1，当慢指针的值不等于0的时候也往后移动，当慢指针等于0并且快指针不等于0的时候，交换快慢指针的值，慢指针再+1
function moveZero(arr) {
    let i = 0
    let j = 0
    while (j < arr.length) {
        if (arr[i] !== 0) {
            i++
        } else if (arr[j] !== 0) {
            ;
            [arr[i], arr[j]] = [arr[j], arr[i]]
            i++
        }
        j++
    }
}