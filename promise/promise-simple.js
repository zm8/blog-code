function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('Promise resolver ' + resolver + ' is not a function');
  }
  if (!(this instanceof Promise)) {
    throw new TypeError('undefined is not a promise');
  }

  this.status = 'pending'; // Promise当前的状态
  this.data = undefined; // Promise的值
  this.onResolvedCallback = [];
  this.onRejectedCallback = [];

  const resolve = value => {
    if (this.status === 'pending') return;
    this.status = 'resolved';
    this.data = value;
    this.onResolvedCallback.forEach(item => item(value));
  };
  const reject = value => {
    if (this.status === 'pending') return;
    this.status = 'rejected';
    this.data = value;
    this.onRejectedCallback.forEach(item => item(value));
  };

  const resolveWrap = value => {
    if (value && typeof value.then === 'function') {
      value.then(resolve, reject);
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
  // 注意默认函数是 throw v
  onRejected = typeof onRejected === 'function' ? onRejected: v=>{throw v};

  return new Promise((resolve, reject) => {
    const resolveCall = onMethod => data => {
      setTimeout(() => {
        try {
          let val = onMethod(data);
          resolve(val);
        } catch (e) {
          reject(e);
        }
      });
    };
    if (this.status === 'resolved') {
      resolveCall(onResolved)(this.data);
    }
    if (this.status === 'rejected') {
      resolveCall(onRejected)(this.data);
    }
    if (this.status === 'pending') {
      this.onResolvedCallback.push(resolveCall(onResolved));
      this.onRejectedCallback.push(resolveCall(onRejected));
    }
  });
};
