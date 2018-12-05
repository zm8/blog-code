// require('shelljs/global');
// const readline = require('readline');
// const path = require('path');

// let COLOR = {
//     Reset: '\u001b[1;0m',
//     Bright: '\u001b[1;1m',
//     Dim: '\u001b[1;2m',
//     Underscore: '\u001b[1;4m',
//     Blink: '\u001b[1;5m',
//     Reverse: '\u001b[1;7m',
//     Hidden: '\u001b[1;8m',
//     Black: '\u001b[1;30m',
//     Red: '\u001b[1;31m',
//     Green: '\u001b[1;32m',
//     Yellow: '\u001b[1;33m',
//     Blue: '\u001b[1;34m',
//     Magenta: '\u001b[1;35m',
//     Cyan: '\u001b[1;36m',
//     White: '\u001b[1;37m',
//     Crimson: '\u001b[1;38m'
// }

// let colour = {};
// for (let n in COLOR) {
//     colour[n] = cnt => COLOR[n] + cnt + COLOR['Reset'];
// }


// // 输入内容
// const inputMsg = (cnt) => {
//     return new Promise((resolve, reject) => {
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         });
//         rl.question(`${cnt}`, (msg) => {
//             rl.close();
//             resolve(msg);
//         });
//     });
// }

// // 去到哪个目录
// const cdDir = (n) => {
//     return new Promise((resolve, reject) => {
//         let dir = path.join(__dirname, n);
//         console.log(`当前所在路径是: ${colour.Yellow(dir)}`);

//         let repository = exec('git remote show origin -n | grep "Fetch URL:"', { silent: true });
//         if (repository.code !== 0) {
//             reject(repository.code);
//             return;
//         }
//         // repository = repository.substr(repository.lastIndexOf('/') + 1);
//         repository = repository.replace(/\s+Fetch URL:\s+/, '');
//         repository = repository.replace('\n', '');
//         repository = colour.Yellow(repository);

//         console.log(`当前的远端分支是: ${repository}`);
//         let code = cd(dir);
//         if (code == 0) {
//             resolve();
//         } else {
//             reject(code);
//         }
//     });
// }


// // 询问是否是当前的分支
// const askBranch = () => {
//     return new Promise((resolve, reject) => {
//         let branchExec = exec('git symbolic-ref --short -q HEAD', { silent: true });
//         let branch = branchExec.stdout;
//         branch = branch.replace('\n', '');
//         let branchStr = colour.Yellow(`${branch} (Y/N): `);
//         inputMsg(`确认操作这个分支: ${branchStr}`)
//             .then(msg => {
//                 if (msg && msg.toLowerCase() === 'y') {
//                     resolve(branch);
//                 } else {
//                     reject('askBranch 暂停了');
//                 }
//             });
//     });
// }

// const pullBranch = (branch) => {
//     return new Promise((resolve, reject) => {
//         console.log('正在拉取分支...');
//         let code = exec(`git pull origin ${branch}`).code;
//         if (code === 0) {
//             let successStr = colour.Yellow(`pull success`);
//             console.log(`${successStr}`);
//             resolve(branch);
//         } else {
//             reject(code);
//         }
//     });
// }

// const pushCode = (branch) => {
//     return new Promise((resolve, reject) => {
//         let comStr = '\n请输入 commit 内容: ';
//         comStr = colour.Yellow(`${comStr}`);
//         return inputMsg(comStr)
//             .then(msg => {
//                 if (msg.length < 2) {
//                     reject('commit 内容太短');
//                     return;
//                 }
//                 if (exec('git add .').code !== 0) {
//                     reject('Error: Git add failed');
//                     return;
//                 }
//                 if (exec(`git commit -m "${msg}"`).code !== 0) {
//                     reject('Error: Git commit failed');
//                     return;
//                 }
//                 if (exec('git push').code !== 0) {
//                     reject('Error: Git push failed');
//                     return;
//                 }
//                 let pullStr = colour.Yellow('push success\n');
//                 console.log(`${pullStr}`);
//                 resolve();
//             });
//     });

// }




// console.log('2222')
// console.log(process.argv)

// Promise.resolve()
//     // .then(() => {
//     //     // 初始进来 重置下颜色
//     //     console.log(`${colour.Reset('')}`);
//     // })
//     .then(() => cdDir('./'))
//     .then(() => askBranch())
//     .then(branch => pullBranch(branch))
//     .then(branch => pushCode(branch))
//     .then(() => {
//         let str = colour.Yellow('congratulations!!!!\n');
//         console.log(`${str}`);
//         exit(1);
//     })
//     .catch(err => {
//         console.log(`\n操作失败: ${colour.Red(err)}`);
//         exit(1);
//     });


// let gitDiff = exec('git diff origin/master --name-only', { silent: true });
// let stdout = gitDiff.stdout;
// stdout = stdout.replace(/(^\n*)|(\n*$)/g, "");
// if (stdout) {
//     stdout = stdout.split('\n');
//     stdout.forEach(element => {
//         console.log(element);
//     });
// }

var shelljs = require('shelljs');

const getMd5 = (file) => {
    let commitMD5 = shelljs.exec(`git log -n 1 --pretty=format:"%h" -- ${file}`, { silent: true });
    let stdout = commitMD5.stdout;
    // console.log(stdout);
    return stdout;
}

var arr = [];
var i = 20;

while (i) {
    arr.push(`./test_img/${i}.jpg`);
    i--;
    if (i <= 0) {
        break;
    }
}
arr = arr.concat(arr);
arr = arr.concat(arr);
arr = arr.concat(arr);
// arr = arr.concat(arr);
// arr = arr.concat(arr);
console.log(arr.length);

const getMd5Promise = (file) => {
    return new Promise((resolve, reject) => {
        let commitMD5 = shelljs.exec(`git log -n 1 --pretty=format:"%h" -- ${file}`, { silent: true, async: true });
        if (!commitMD5.stdout) {
            throw new Error('获取 md5 失败, 请重新获取');
        }
        commitMD5.stdout.on('data', function (data) {
            resolve(data);
        });
    });
}

// const test1 = () => {
//     let firstTime = Date.now();
//     var resArr = []
//     for (var i = 0; i < arr.length; i++) {
//         resArr.push(getMd5(arr[i]));
//     }
//     console.log(resArr);
//     console.log(`耗时${Date.now() - firstTime}`);
// }

// test1();

const test2 = () => {
    let firstTime = Date.now();
    const NUM = 100;
    let pos = 0;
    let res = [];

    const loop = () => {
        let start = pos;
        let end = start + NUM;

        let sliceArr = arr.slice(start, end);
        if (sliceArr.length === 0) {
            return Promise.resolve();
        }

        sliceArr = sliceArr.map(item => getMd5Promise(item));
        return Promise.all(sliceArr)
            .then((data) => {
                res = res.concat(data);
                pos += NUM;
                return loop();
            });
    }

    loop().then(() => {
        console.log(res);
        console.log(`耗时${Date.now() - firstTime}`);
    });
}

test2();
