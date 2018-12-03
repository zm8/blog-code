let shell = require('shelljs');

// cd 命令
module.exports = (cmd, cnt) => {
    return new Promise((resolve, reject) => {
        /*
            let res = shell.exec(cnt);
            注意这里不用上面这种方式写,
            因为cd 的时候会有问题, 比如下面的代码,
            并不会在 2017 目录下面创建一个 1111.js,
            还是只会在当前目录下创建
            shell.exec('cd ../2017');
            shell.exec('mkdir 1111.js');
        */
        let res;
        if (shell[cmd]) {
            res = shell[cmd](cnt);
        } else {
            res = shell.exec(cmd, { silent: true });
        }
        if (res.code === 0) {
            resolve(res.stdout);
        } else {
            reject(res.stderr);
        }
    });
}