Promise.resolve = function(value){
    return new Promise((resolve, reject)=>{
        resolve(value);
    });
}

Promise.reject = function(reason){
    return new Promise((resolve, reject)=>{
        reject(reason);
    });
}

Promise.prototype.catch = function(fn){
    return this.then(null, fn);
}

Promise.prototype.finally = function(fn){
    // return v 和 throw v 为了透传
    return this.then((v)=>{
        fn();
        return v;
    }, (v)=>{
        fn();
        throw v;
    });
}

Promise.all = function(promises){
    return new Promise((resolve, reject)=>{
        let arr=[];
        let j = 0;
        let len = promises.length;
        for(let i =0; i < len; i++){
            Promise.resolve(promises[i])
                .then(data=>{
                    arr[i] = data;
                    j++;
                    if(j == len){
                        resolve(arr);
                    }
                }, reason=>{
                    reject(reason);
                });
        }
    });
}

Promise.race = function(promises){
    return new Promise((resolve, reject)=>{
        let len = promises.length;
        for(let i =0; i < len; i++){
            Promise.resolve(promises[i])
                .then(data=>{
                    resolve(data);
                })
                .catch(v=>{
                    reject(v);
                });
        }
    });
}

Promise.deferred = function(){
    var dfd = {};
    dfd.promise = new Promise((resolve, reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

Promise.prototype.delay = function(time){
    // 不用 return new Promise, 而是用 this.then
    // 是为了 承接之前的value
    return this.then(function(v){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(v);
            }, time);
        });
        }, function(reason){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                reject(reason);
            }, time);
        });
    });
}