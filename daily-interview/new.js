function _new(fn, ...arg) {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, arg);
    // 根据规范，返回null和undefined不处理，依然返回obj
    return ret instanceof Object ? ret : obj;
}