let shell = require('shelljs');

// cd 命令
module.exports = (cnt) => {
    return new Promise((resolve, reject) => {
        console.log(cnt);
        let res = shell.exec(cnt, { silent: true });
        console.log(res.code);
        if (res.code === 0) {
            resolve();
        } else {
            reject(res.stderr);
        }
    });
}