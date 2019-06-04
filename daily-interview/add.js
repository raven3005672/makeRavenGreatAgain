const curryReducer = (fn) => {
    return (...args) => {
        let runned = false;
        const chain = (...args) => {
            if (!args.length) return chain;
            chain.acc = (runned ? [chain.acc] : []).concat(args).reduce(fn);
            !runned && (runned = true);
            return chain;
        };
        chain.acc = undefined;
        chain.toString = () => chain.acc;
        return chain(...args);
    }
}

const add = curryReducer((a,e) => a+e);
console.log('' + add(1, 2, 3)()(4, 5)(6)(7)(8, 9, 10))

