/*
 * @Author: huazihear 
 * @Date: 2019-05-14 15:58:55 
 * @Last Modified by: raven3005672
 * @Last Modified time: 2019-05-17 18:46:01
 */
// 问题：大小写的问题
// 其他字符的问题
function encodeastr(str, method) {
    if (!str) return "";
    method = !!method;
    str = str + "";

    var type_arr = [
        ["c", "n", "a", "e", "d", "f"],
        ["b", "g", "l", "j", "i", "o"],
        ["y", "k", "s", "p", "h", "x"],
        ["r", "q", "z", "v", "m", "u"]
    ]


    var letter_arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var especial_arr = [":", "/", ".", "&", "?", "+", "="];

    // ----------------------------------
    function enCodeIt(str) {
        // 反转
        var r_str = reverseStr(str);
        var n_str = nextStr(r_str);
        var n_str_arr = n_str.split("");
        var len = n_str_arr.length;
        var temp_four;
        var end_str_arr = [];
        var temp_letter;
        var pos1, pos2, pos3, pos4;
        for (var i = 0; i < len; i++) {
            temp_letter = n_str_arr[i];
            if (isNumberType(temp_letter)) {
                // number
                pos1 = type_arr[0][randomNumber(0, 6)];
                pos4 = letter_arr[parseInt(temp_letter)];
            } else if (isLetterType(temp_letter)) {
                // letter
                pos1 = type_arr[1][randomNumber(0, 6)];
                pos4 = letter_arr[index(temp_letter, letter_arr)];
            } else if (isEspecially(temp_letter)) {
                // especially
                pos1 = type_arr[2][randomNumber(0, 6)];
                pos4 = letter_arr[index(temp_letter, especial_arr)];
            } else {
                // other
                pos1 = type_arr[3][randomNumber(0, 6)];
                pos4 = temp_letter;
            }

            pos2 = letter_arr[randomNumber(0, 26)];
            pos3 = letter_arr[randomNumber(0, 26)];
            temp_four = pos1 + pos2 + pos3 + pos4;

            end_str_arr.push(temp_four);
        }

        return end_str_arr.join("");
    }

    function isInArray(letter, arr) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i] == letter) {
                i = -1;
                break;
            }
        }

        return i === len ? false : true;
    }

    function isNumberType(o) {
        return (o === o && !isFinite(o) && (o + 1) === (1 + parseInt(o)));
    }

    function isLetterType(o) {
        return !isNumberType(o) && isInArray(o, letter_arr);
    }

    function isEspecially(o) {
        return isInArray(o, especial_arr);
    }



    function randomNumber(start, to) {
        return Math.abs(Math.floor(Math.random() * (to - start) + start));
    }

    function reverseStr(str) {
        return str.split("").reverse().join("");
    }

    function nextStr(str) {
        var str_arr = str.split("");
        var str_len = str_arr.length;

        var next_arr = [];
        for (var i = 0; i < str_len; i++) {
            next_arr.push(nextLetter(str_arr[i]));
        }

        return next_arr.join("");
    }
    function nextLetter(letter) {
        if (!isLetterType(letter)) {
            return letter;
        }

        var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var i = index(letter, arr);
        var len = arr.length;
        if (i == len - 1) {
            i = 0;
        } else {
            i = i + 1;
        }
        return arr[i];
    }

    function index(letter, arr) {
        var len = arr.length;
        var ii = 0;
        for (var i = 0; i < len; i++) {
            if (letter == arr[i]) {
                ii = i;
                break;
            }
        }

        return ii;
    }
   
    let token = enCodeIt(str).toUpperCase();
    return {
        err: token.replace('1','3'),
        t: token
    };
}

// module.exports = encodeastr;
let a = new Date();
console.log(a)
console.log(encodeastr('test str'))
console.log(new Date() - a)