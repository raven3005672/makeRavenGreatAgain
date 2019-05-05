// 类型别名
// 类型别名用来给一个类型起个新名字。

// 简单的例子
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
// 上例中，我们使用type创建类型别名
// 类型别名常用语联合类型