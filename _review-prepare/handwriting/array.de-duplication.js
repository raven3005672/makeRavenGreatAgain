
const uniqueArray1 = (array) => {
  return [...new Set(array)];
}

const uniqueArray4 = (array) => {
  return Array.from(new Set(array));
}

const uniqueArray2 = (array) => {
  return array.filter((it, i) => array.indexOf(it) === i);
}

const uniqueArray3 = (array) => {
  let result = [];
  array.forEach((it, i) => {
    if (result.indexOf(it) === -1) {
      result.push(it);
    }
  });
  return result;
}
