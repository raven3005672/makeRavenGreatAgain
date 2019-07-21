// 用javascript写一个函数，输入int型，返回整数逆序后的字符串，如输入整型1234，返回字符串'4321'，要求必须使用递归函数调用，不能用全局变量，输入函数必须只有一个参数传入，必须返回字符串。
function revert(nums) {
    let a = nums % 10;
    nums = parseInt(nums / 10);
    if (nums > 0) {
        return '' + a + revert(nums);
    } else {
        return '' + a;
    }
}

console.log(revert(1234))