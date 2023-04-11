const search = (nums, target) => {
  let i = 0;
  let j = nums.length - 1;
  let midIndex = 0;
  while (i <= j) {
    midIndex = Math.floor((i + j) / 2);
    const midValue = nums[midIndex];
    if (midValue === target) {
      return midIndex;
    } else if (midValue < target) {
      i = midIndex + 1;
    } else {
      j = midIndex - 1;
    }
  }
  return -1;
}