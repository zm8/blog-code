function Promise(resolver) {
  if (typeof resolver !== "function") {
    throw new TypeError("Promise resolver " + resolver + " is not a function");
  }
  if (!(this instanceof Promise)) {
    throw new TypeError("undefined is not a promise");
  }

  this.status = "pending"; // Promise当前的状态
  this.data = undefined; // Promise的值
  this.onResolvedCallback = []; // Promise resolve时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面
  this.onRejectedCallback = []; // Promise reject时的回调函数集，因为在Promise结束之前有可能有多个回调添加到它上面

  const resolve = value => {
    if (this.status !== "pending") return;
    this.status = "resolved";
    this.data = value;
    this.onResolvedCallback.forEach(item => item(value));
  };
  const reject = value => {
    if (this.status !== "pending") return;
    this.status = "rejected";
    this.data = value;
    this.onRejectedCallback.forEach(item => item(value));
  };
  const resolveWrap = value=>{
    // this 相当于 Promise 的实例
    resolvePromise(value, this, resolve, reject);
  }
  try {
    resolver(resolveWrap, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : v=>v;
  // 注意默认函数是 v=>{throw v}
  onRejected = typeof onRejected === 'function' ? onRejected: v=>{throw v};
  const resolveCall = (onMethod, resolve, reject) => data => {
    setTimeout(() => {
      try {
        let val = onMethod(data);
        resolve(val);
      } catch (e) {
        reject(e);
      }
    });
  };
  return new Promise((resolve, reject)=>{
    const resolveFn = resolveCall(onResolved, resolve, reject);
    const rejectFn = resolveCall(onRejected, resolve, reject);
    if (this.status === "resolved") {
      resolveFn(this.data);
    }
    if (this.status === "rejected") {
      rejectFn(this.data);
    }
    if (this.status === "pending") {
      this.onResolvedCallback.push(resolveFn);
      this.onRejectedCallback.push(rejectFn);
    }
  });
};

function resolvePromise(x, promise, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'))
  }
  let once = false;
  if (x !== null && ( typeof x === 'object' || typeof x === 'function' )) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (once) return;
          once = true;
          return resolvePromise(y, promise, resolve, reject);
        }, r => {
          if (once) return;
          once = true;
          return reject(r);
        })
      } else {
        return resolve(x);
      }
    } catch(e) {
      if (once) return;
      once = true;
      return reject(e)
    }
  } else {
    return resolve(x);
  }
}

// 测试的时候需要有 deferred 的方法
Promise.deferred = Promise.defer = function () {
  var dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

try {
  module.exports = Promise;
} catch (e) {}

