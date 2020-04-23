function Promise(resolver) {
  this.status = 'pending'; // Promise当前的状态
  this.data = undefined; // Promise的值
  this.onResolvedCallback = [];
  this.onRejectedCallback = [];

  const resolve = value => {
    if (this.status !== 'pending') return;
    this.status = 'resolved';
    this.data = value;
    this.onResolvedCallback.forEach(item => item(value));
  };
  const reject = value => {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.data = value;
    this.onRejectedCallback.forEach(item => item(value));
  };
  const resolveWrap = value => {
    if (value && typeof value.then === 'function') {
      value.then(resolveWrap, reject);
      return;
    }
    resolve(value);
  };
  try {
    resolver(resolveWrap, reject);
  } catch (e) {
    reject(e);
  }
}

Promise.prototype.then = function(onResolved, onRejected) {
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
