require('shelljs/global');
const readline = require('readline');
const path = require('path');


const Reset = '\u001b[1;0m';
const Bright = '\u001b[1;1m';
const Dim = '\u001b[1;2m';
const Underscore = '\u001b[1;4m';
const Blink = '\u001b[1;5m';
const Reverse = '\u001b[1;7m';
const Hidden = '\u001b[1;8m';
const Black = '\u001b[1;30m';
const Red = '\u001b[1;31m';
const Green = '\u001b[1;32m';
const Yellow = '\u001b[1;33m';
const Blue = '\u001b[1;34m';
const Magenta = '\u001b[1;35m';
const Cyan = '\u001b[1;36m';
const White = '\u001b[1;37m';
const Crimson = '\u001b[1;38m';


// 输入内容
const inputMsg = (cnt) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`${cnt}${Reset}`, (msg) => {
            rl.close();
            resolve(msg);
        });
    });
}

// 去到哪个目录
const cdDir = (n) => {
    return new Promise((resolve, reject) => {
        let dir = path.join(__dirname, n);
        console.log(`当前所在路径是 ${Yellow}${dir}`);

        let repository = exec('git remote show origin -n | grep "Fetch URL:"', { silent: true });
        if (repository.code !== 0) {
            reject(repository.code);
            return;
        }
        repository = repository.substr(repository.lastIndexOf('/') + 1);
        repository = repository.replace('\n', '');

        console.log(`当前的远端分支是 ${Yellow}${repository}`);
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
        inputMsg(`确认操作这个分支: ${branch} (Y/N) `)
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
            console.log(`${Yellow}pull success`);
            resolve(branch);
        } else {
            reject(code);
        }
    });
}

const pushCode = (branch) => {
    return new Promise((resolve, reject) => {
        return inputMsg('\n请输入 commit 内容: ')
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
                console.log(`git push success${Green}\n`);
                resolve();
            });
    });

}


Promise.resolve()
    .then(() => cdDir('./'))
    .then(() => askBranch())
    .then(branch => pullBranch(branch))
    .then(branch => pushCode(branch))
    .then(() => {
        console.log(`congratulations!!!! ${Green}`);
        exit(1);
    })
    .catch(err => {
        console.log(`\n操作失败: ${err}${Red}`);
        exit(1);
    });
