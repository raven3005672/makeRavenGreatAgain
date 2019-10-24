function tokenizer(input) {
    const tokens = [];
    const punctuators = [',', '.', '(', ')', '=', ';'];
    let current = 0;
    while (current < input.length) {
        let char = input[current];
        if (punctuators.indexOf(char) !== -1) {
            tokens.push({
                type: 'Punctuator',
                value: char,
            });
            current++;
            continue;
        }
        // 检查空格，连续的空格放到一起
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }
        // 标识符是字母、$、_开始的
        if (/[a-zA-Z\$\_]/.test(char)) {
            let value = '';
            while (/[a-zA-Z0-9\$\_]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({
                type: 'Identifier',
                value
            });
            continue;
        }
        // 数字从0-9开始，不止一位
        const NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            let value = '';
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({
                type: 'Numeric',
                value
            });
            continue;
        }
        // 处理字符串
        if (char === '"') {
            let value = '';
            char = input[++current];
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
            char = input[++current];
            tokens.push({
                type: 'String',
                value
            });
            continue;
        }
        // 最后遇到不认识的字符就抛出个异常出来
        throw new TypeError('Unexpected charactor: ' + char);
    }
    return tokens;
}

const input = `console.log("zcy");`

console.log(tokenizer(input));
// 结果
[ { type: 'Identifier', value: 'console' },
  { type: 'Punctuator', value: '.' },
  { type: 'Identifier', value: 'log' },
  { type: 'Punctuator', value: '(' },
  { type: 'String', value: 'zcy' },
  { type: 'Punctuator', value: ')' },
  { type: 'Punctuator', value: ';' } ]