const quickSort = (array) => {
  const length = array.length;
  if (length <= 1) {
    return array;
  }
  const midIndex = Math.floor(length / 2);
  const midValue = array.splice(midIndex, 1)[0];
  let leftArray = [];
  let rightArray = [];
  let index = 0;
  while (index < length - 1) {
    const curValue = array[index];
    if (curValue <= midValue) {
      leftArray.push(curValue);
    } else {
      rightArray.push(curValue);
    }
    index++;
  }
  return quickSort(leftArray).concat([midValue], quickSort(rightArray));
}