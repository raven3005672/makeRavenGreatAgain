const sleep = (time) => {
    return new Promise(resolve => setTimeout(() => resolve(100), time))
}
async function sleepAsync() {
    console.log('fuck the code');
    let a = await sleep(5000);
    console.log('fuck the code again', a);
}

sleepAsync();

console.log('noraml')

sleep(2000).then((test) => {
    console.log(test)
})

// "use strict";

// function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
//     try {
//         var info = gen[key](arg);
//         var value = info.value;
//     } catch (error) {
//         reject(error);
//         return;
//     }
//     if (info.done) {
//         resolve(value);
//     } else {
//         Promise.resolve(value).then(_next, _throw);
//     }
// }

// function _asyncToGenerator(fn) {
//     return function () {
//         var self = this,
//             args = arguments;
//         return new Promise(function (resolve, reject) {
//             var gen = fn.apply(self, args);

//             function _next(value) {
//                 asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
//             }

//             function _throw(err) {
//                 asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
//             }
//             _next(undefined);
//         });
//     };
// }

// var sleep = function sleep(time) {
//     return new Promise(function (resolve) {
//         return setTimeout(function () {
//             return resolve(100);
//         }, time);
//     });
// };

// function sleepAsync() {
//     return _sleepAsync.apply(this, arguments);
// }

// function _sleepAsync() {
//     _sleepAsync = _asyncToGenerator(
//         /*#__PURE__*/
//         regeneratorRuntime.mark(function _callee() {
//             var a;
//             return regeneratorRuntime.wrap(function _callee$(_context) {
//                 while (1) {
//                     switch (_context.prev = _context.next) {
//                         case 0:
//                             console.log('fuck the code');
//                             _context.next = 3;
//                             return sleep(5000);

//                         case 3:
//                             a = _context.sent;
//                             console.log('fuck the code again', a);

//                         case 5:
//                         case "end":
//                             return _context.stop();
//                     }
//                 }
//             }, _callee);
//         }));
//     return _sleepAsync.apply(this, arguments);
// }

// sleepAsync();
// console.log('noraml');
// sleep(2000).then(function (test) {
//     console.log(test);
// });
