// 声明合并
// 如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型：

// 函数的合并
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

// 接口的合并
// 接口中的属性在合并时会简单的合并到一个接口中：
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
// 相当于
interface Alarm {
    price: number;
    weight: number;
}
// 注意，合并的属性的类型必须是唯一的：
interface Alarm {
    price: number;
}
interface Alarm {
    price: string;          // error
    weight: number;
}
// 接口中方法的合并，与函数的合并一样：
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}
// 相当于：
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}

// 类的合并
// 类的合并与接口的合并规则一致。
