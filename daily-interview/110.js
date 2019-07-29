const nums1 = [1, 2, 3, 5, 7, 8, 10];
function simplifyStr(num) {
  var result = [];
  var temp = num[0]
  num.forEach((value, index) => {
    if (value + 1 !== num[index + 1]) {
      if (temp !== value) {
        result.push(`${temp}~${value}`)
      } else {
        result.push(`${value}`)
      }
      temp = num[index + 1]
    }
  })
  return result;
}
console.log(simplifyStr(nums1).join(','))