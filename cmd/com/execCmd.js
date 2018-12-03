// let shell = require('shelljs');

// // cd 命令
// module.exports = (cmd, cnt) => {
//     let res = shell[cmd](cnt);
//     if (res.code === 0) {
//         // resolve();
//     } else {
//         // reject(res.stderr);
//     }
// }

let shell = require('shelljs');

// cd 命令
module.exports = (cmd, cnt) => {
    return new Promise((resolve, reject) => {
        /*
            注意这里不用这种方式, 因为用在 promise 里面会不行
            let res = shell.exec(cnt, { silent: true });
        */
        let res = shell[cmd](cnt);
        if (res.code === 0) {
            resolve();
        } else {
            reject(res.stderr);
        }
    });
}