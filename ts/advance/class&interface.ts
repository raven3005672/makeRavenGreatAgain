// 类与接口
// 接口可以用于对对象的形状进行描述。
// 另一个用途：对类的一部分行为进行抽象。

// 类实现接口
// 实现implements是面向对象中的一个重要概念。一般来讲，一个类智能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口interfaces，用implements关键字来实现。
// 这个特性大大提高了面向对象的灵活性。
// 举例来说，门是一个类，防盗门是门的一个子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。
// 这时候如果有另一个类：车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：
interface Alarm {
    alert();
}
class Door {}
class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
// 一个类可以实现多个接口：
interface Alarm {
    alert();
}
interface Light {
    lightOn();
    lightOff();
}
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
// 上例中，Car实现了Alarm和Light接口，既能报警，也能开关车灯。

// 接口继承接口
// 接口和接口之间可以是继承关系：
interface Alarm {
    alert();
}
interface LightableAlarm extends Alarm {
    lightOn();
    lightOff();
}
// 上例中，我们使用extends使LightableAlarm继承Alarm。

// 接口继承类
// 接口也可以继承类：
class Point {
    x: number;
    y: number;
}
interface Point3d extends Point {
    z: number;
}
let point3d: Point3d = {x:1, y:2, z:3}

// 混合类型
// 可以使用接口的方式来定义一个函数需要符合的形状
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
// 有时候，一个函数还可以有自己的属性和方法：
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}
function getCounter(): Counter {
    let counter = <Counter>function (start: number) {};
    counter.interval = 123;
    counter.reset = function() {};
    return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;