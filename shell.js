require('shelljs/global');
const readline = require('readline');
const path = require('path');

let COLOR = {
    Reset: '\u001b[1;0m',
    Bright: '\u001b[1;1m',
    Dim: '\u001b[1;2m',
    Underscore: '\u001b[1;4m',
    Blink: '\u001b[1;5m',
    Reverse: '\u001b[1;7m',
    Hidden: '\u001b[1;8m',
    Black: '\u001b[1;30m',
    Red: '\u001b[1;31m',
    Green: '\u001b[1;32m',
    Yellow: '\u001b[1;33m',
    Blue: '\u001b[1;34m',
    Magenta: '\u001b[1;35m',
    Cyan: '\u001b[1;36m',
    White: '\u001b[1;37m',
    Crimson: '\u001b[1;38m'
}

let colour = {};
for (let n in COLOR) {
    colour[n] = cnt => COLOR[n] + cnt + COLOR['Reset'];
}

const removeWrapLine = (str) => {

}

// 输入内容
const inputMsg = (cnt) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`${cnt}`, (msg) => {
            rl.close();
            resolve(msg);
        });
    });
}

// 去到哪个目录
const cdDir = (n) => {
    return new Promise((resolve, reject) => {
        let dir = path.join(__dirname, n);
        console.log(`当前所在路径是: ${colour.Yellow(dir)}`);

        let repository = exec('git remote show origin -n | grep "Fetch URL:"', { silent: true });
        if (repository.code !== 0) {
            reject(repository.code);
            return;
        }
        // repository = repository.substr(repository.lastIndexOf('/') + 1);
        repository = repository.replace(/\s+Fetch URL:\s+/, '');
        repository = repository.replace('\n', '');
        repository = colour.Yellow(repository);

        console.log(`当前的远端分支是: ${repository}`);
        let code = cd(dir);
        if (code == 0) {
            resolve();
        } else {
            reject(code);
        }
    });
}

// 询问是否是当前的分支
const askBranch = () => {
    return new Promise((resolve, reject) => {
        let branchExec = exec('git symbolic-ref --short -q HEAD', { silent: true });
        let branch = branchExec.stdout;
        branch = branch.replace('\n', '');
        let branchStr = colour.Yellow(`${branch} (Y/N): `);
        inputMsg(`确认操作这个分支: ${branchStr}`)
            .then(msg => {
                if (msg && msg.toLowerCase() === 'y') {
                    resolve(branch);
                } else {
                    reject('askBranch 暂停了');
                }
            });
    });
}

const pullBranch = (branch) => {
    return new Promise((resolve, reject) => {
        console.log('正在拉取分支...');
        let code = exec(`git pull origin ${branch}`).code;
        if (code === 0) {
            let successStr = colour.Yellow(`pull success`);
            console.log(`${successStr}`);
            resolve(branch);
        } else {
            reject(code);
        }
    });
}

const pushCode = (branch) => {
    return new Promise((resolve, reject) => {
        let comStr = '\n请输入 commit 内容: ';
        comStr = colour.Yellow(`${comStr}`);
        return inputMsg(comStr)
            .then(msg => {
                if (msg.length < 2) {
                    reject('commit 内容太短');
                    return;
                }
                if (exec('git add .').code !== 0) {
                    reject('Error: Git add failed');
                    return;
                }
                if (exec(`git commit -m "${msg}"`).code !== 0) {
                    reject('Error: Git commit failed');
                    return;
                }
                if (exec('git push').code !== 0) {
                    reject('Error: Git push failed');
                    return;
                }
                let pullStr = colour.Yellow('push success\n');
                console.log(`${pullStr}`);
                resolve();
            });
    });

}


// let aaa = exec('git diff origin/master --name-only', { silent: true });
// let stdout = aaa.stdout;
// stdout = stdout.replace(/(^\n*)|(\n*$)/g, "");
// stdout = stdout.split('\n');
// stdout.forEach(element => {
//     console.log(element);
// });

Promise.resolve()
    .then(() => {
        // 初始进来 重置下颜色
        console.log(`${colour.Reset('')}`);
    })
    .then(() => cdDir('./'))
    .then(() => askBranch())
    .then(branch => pullBranch(branch))
    .then(branch => pushCode(branch))
    .then(() => {
        let str = colour.Yellow('congratulations!!!!\n');
        console.log(`${str}`);
        exit(1);
    })
    .catch(err => {
        console.log(`\n操作失败: ${colour.Red(err)}`);
        exit(1);
    });
