// 装饰器不能装饰函数【因为存在函数提升】，如果需要装饰效果可以使用高阶函数实现
function doSomething(name) {
    console.log('Hello, ' + name);
  }

function loggingDecorator(wrapped) {
    return function() {
        console.log('Starting');
        const result = wrapped.apply(this, arguments);
        console.log('Finished');
        return result;
    }
}

const wrapped = loggingDecorator(doSomething);


@decorator class A{}
// 等同于
class A{}
A = decorator(A) || A;

// autobind功能
const {defineProperty, getPrototypeOf} = Object;
function bind(fn, context) {
    if (fn.bind) {
        return fn.bind(context);
    } else {
        return function __autobind__() {
            return fn.apply(context, arguments);
        }
    }
}
function createDefaultSetter(key) {
    return function set(newValue) {
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue
        });

        return newValue;
    }
}
function autobind(target, key, {value: fn, configurable, enumerable}) {
    if (typeof fn !== 'function') {
        throw new SyntaxError(`@autobind can only be used on functions, not: ${fn}`)
    }
    const {constructor} = target;
    return {
        configurable,
        enumerable,
        get() {
            // 使用这种方式相当于替换了这个函数，所以当比如Class.prototype.hasOwnProperty(key)的时候，
            // 为了正确返回，所以这里做了this的判断
            if (this === target) {
                return fn;
            }
            const boundFn = bind(fn, this);
            defineProperty(this, key, {
                configurable: true,
                writable: true,
                enumerable: false,
                value: boundFn
            });

            return boundFn;
        },
        set: createDefaultSetter(key)
    };
}

// debounce功能：防抖
function _debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this;
        var args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(function() {
                timeout = null;
            }, wait);
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(function() {
                func.apply(context, args)
            }, wait);
        }
    }
}
function debounce(wait, immediate) {
    return function handleDescriptor(target, key, descriptor) {
        const callback = descriptor.value;
        if (typeof callback !== 'function') {
            throw new SyntaxError('Only functions can be debounced');
        }
        var fn = _debounce(callback, wait, immediate);
        return {
            ...descriptor,
            value() {
                fn()
            }
        };
    }
}