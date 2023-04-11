useEffect无限循环

## 缺失依赖

无依赖。render => useEffect => render => ...

useEffect( , [])

## 函数作为依赖

浅比较永远为false

fn = useCallback(_fn, [])
useEffect( , [fn])

## 数组作为依赖

浅比较永远为false

{ current } = useRef(_arr)
useEffect( , [current])

## 对象作为依赖

浅比较永远false

data = useMemo(() => _data, []);
useEffect( , [data])
