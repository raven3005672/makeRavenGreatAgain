
function generatorToAsync(generatorFn) {
  return function() {
    const gen = generatorFn.apply(this, arguments); // gen有可能传参

    // 返回一个Promise
    return new Promise((resolve, reject) => {

      function go(key, arg) {
        let res;
        try {
          res = gen[key](arg);  // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error); // 报错的话会走catch，直接reject
        }
        
        // 解构获得value和done
        const { value, done } = res;
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value);
        } else {
          // 如果done为false，说明没走完，还得继续走
          // value有可能是：常量，Promise，Promise有可能是成功或者失败
          return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
        }
      }
    });
  }
}


function fn(nums) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(nums * 2)
    }, 1000)
  })
}
function* gen() {
  const num1 = yield fn(1);
  const num2 = yield fn(num1);
  const num3 = yield fn(num2);
  return num3
}

// 示例
// async/await版本
async function asyncFn() {
  const num1 = await fn(1);
  console.log(num1);  // 2
  const num2 = await fn(num1);
  console.log(num2);  // 4
  const num3 = await fn(num2);
  console.log(num3);  // 8
  return num3;
}
const asyncRes = asyncFn();
console.log(asyncRes);  // Promise
asyncRes.then(res => console.log(res));

// generatorToAsync函数的版本
function* gen() {
  const num1 = yield fn(1);
  console.log(num1);  // 2
  const num2 = yield fn(num1);
  console.log(num2);  // 4
  const num3 = yield fn(num2);
  console.log(num3);  // 8
  return num3;
}
const genToAsync = generatorToAsync(gen);
const asyncRes = genToAsync();
console.log(asyncRes);  // Promise
asyncRes.then(res => console.log(res));