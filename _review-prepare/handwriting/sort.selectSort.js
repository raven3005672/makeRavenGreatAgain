// * 1. 取出未排序的第一个元素，遍历该元素之后的部分并进行比较。第一次就是取第一个元素
// * 2. 如果有更小的就交换位置
const selectSort = (array) => {
  const length = array.length;
  for (let i = 0; i < length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return array;
}