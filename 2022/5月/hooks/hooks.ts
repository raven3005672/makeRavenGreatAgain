import isEqual from 'lodash/isEqual';
import { useEffect, useRef, useState } from 'react';
import type { DependencyList, EffectCallback } from 'react';

// useMount
export const useMount = (callback: EffectCallback) => {
  useEffect(callback, []);
}

// useUnMount
// useRef解决useEffect的闭包问题
export const useUnMount = (fn: () => any): void => {
  const fnRef = useRef(fn);
  fnRef.current = fn; // 拿到实时的fn
  useEffect(() => {
    return () => fnRef.current();
  },[]);
}

// useFirstMount
// 判断是否为首次渲染
export const useFirstMount = (): boolean => {
  const isFirst = useRef(true);
  // 如果是初次渲染
  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }
  return isFirst.current;
}

// useUpdateEffect
// 想要忽略首次执行，只需在依赖项发生变化时去执行某些逻辑。
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMount(); // 判断是否是首次渲染
  useEffect(() => {
    if (!isFirstMount) {
      return effect();  // 二次渲染才执行
    }
  }, deps);
}

// useDebounceState
export function useDebounceState<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(
    () => {
      // 在delay时间后更新debouncedValue
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler); // 当传入的value变化时，清除之前的定时器
    },
    [value, delay]
  );
  return debouncedValue;
}

// useDebounceEffect
export const useDebounceEffect = (
  effect: EffectCallback,
  deps: DependencyList,
  delay = 1000
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [refreshFlag, setRefreshFlag] = useState(true);  // 用于更新effect
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setRefreshFlag(!refreshFlag);
    }, delay);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [...deps, delay]);
  // 只有当依赖refreshFlag变化时，才执行传入的effect
  useUpdateEffect(effect, [refreshFlag]);
  // 当页面销毁时，及时清除定时器
  useUnMount(() => timeoutRef.current && clearTimeout(timeoutRef.current));
}

// useThrottleState
export const useThrottleState = <T>(initialState: T, delay = 5000) => {
  const [state, setState] = useState<T>(initialState);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextValue = useRef(null) as any;
  const hasNextValue = useRef(false);
  useUpdateEffect(() => {
    if (timeout.current) {
      nextValue.current = initialState;
      hasNextValue.current = true;
    } else {
      setState(initialState);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          setState(nextValue.current);
          hasNextValue.current = false;
        }
        timeout.current = undefined;
      };
      timeout.current = setTimeout(timeoutCallback, delay);
    }
  }, [initialState]);
  useUnMount(() => {
    timeout.current && clearTimeout(timeout.current);
  });
  return state;
}

// useThrottleEffect
export const useThrottleEffect = <T, U extends any[]>(
  fn: (...args: U) => T,
  args: U,
  delay = 200
) => {
  const [state, setState] = useState<T | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const nextArgs = useRef<U>();
  useEffect(() => {
    if (timeout.current) {
      // 如果有正在进行中的
      nextArgs.current = args;
    } else {
      setState(fn(...args));
      const timeoutCallback = () => {
        if (nextArgs.current) {
          setState(fn(...nextArgs.current));
          nextArgs.current = undefined;
        }
        timeout.current = undefined;
      };
      timeout.current = setTimeout(timeoutCallback, delay);
    }
  }, args);
  useUnMount(() => {
    timeout.current && clearTimeout(timeout.current);
  });
  return state;
}

// useDeepCompareEffect
const depsEqual = (aDeps: DependencyList, bDeps: DependencyList = []) => {
  return isEqual(aDeps, bDeps);
};
const useDeepCompareEffect = (effect: EffectCallback, deps: DependencyList) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);
  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }
  useEffect(effect, [signalRef.current]);
}
export default useDeepCompareEffect;

// useSetState
export const useSetState = <T extends object>(initialState: T | (() => T)) => {
  const [state, setState] = useState<T>(initialState);
  const set = (value: Partial<T> | ((preState: T) => Partial<T>)): void => {
    setState({
      ...state,
      ...(value instanceof Function ? value(state) : value),
    });
  };
  return [state, set] as const;
}

// useLatest
export const useLatest = <T>(value: T): { current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
