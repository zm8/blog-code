function produce(baseState, thunk) {
  const copies = new Map();
  const proxies = new Map();
  const isObject = obj => (typeof obj === 'object' && obj !== null) || Array.isArray(obj);

  const handler = {
    get(target, key) {
      return getOrCreateProxy(getOrCreateCopy(target)[key]);
    },
    set(target, key, val) {
      if (target[key] !== val) {
        // 为了防止 state.a = 1; 直接赋值, 则不会走到 handler 里的 get
        const copyTarget = getOrCreateCopy(target);
        copyTarget[key] = val;
      }
      return true;
    },
  };

  const getOrCreateProxy = baseState => {
    if (!isObject(baseState)) return baseState;
    if (proxies.has(baseState)) return proxies.get(baseState);
    const proxy = new Proxy(baseState, handler);
    proxies.set(baseState, proxy);
    return proxy;
  };

  const getOrCreateCopy = baseState => {
    if (copies.has(baseState)) return copies.get(baseState);

    const copy = Array.isArray(baseState)
      ? [...baseState]
      : {
          ...baseState,
        };
    copies.set(baseState, copy);
    return copy;
  };

  const finalize = baseState => {
    const copyState = copies.get(baseState);
    if (!copyState) return baseState; // {1}
    // 递归每个属性的值是否有 copy 的值
    Object.keys(copyState).forEach(key => {
      copyState[key] = finalize(copyState[key]);
    });
    return copyState;
  };

  const proxy = new Proxy(baseState, handler);
  thunk(proxy);
  return finalize(baseState);
}

const state = { a: 1, e: { f: 2 }, b: { c: { d: [] } } };
const target = produce(state, target => {
  target.a = 2;
  target.e.f = 3;
  target.b.c.d.push(1);
  target.b.c.d.push(2);
});

console.log(state === target);
console.log(state, target);
