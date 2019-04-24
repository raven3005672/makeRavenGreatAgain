// 类型断言可以用来手动指定一个值的类型。

// 语法
<类型> 值
// 或
值 as 类型
// tsx(jsx)语法中必须使用后一种

// 例子：将一个联合类型的变量指定为一个更加具体的类型
// 当TypeScript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：
function getLength(something: string | number): number {
    return something.length;
}                                               // error
// 而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法，比如：
function getLength(something: string | number): number {
    if (something.length) {
        return something.length
    } else {
        return something.toString().length;
    }
}                                               // error
// 上例中，获取something.length的时候会报错
// 测试可以使用类型断言，将something断言成string：
function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}

// 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的：
function toBoolean(something: string | number): boolean {
    return <boolean>something;                          // error
}

