require('shelljs/global');
const readline = require('readline');

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
const cdDir = () => {
    return new Promise((resolve, reject) => {
        let code = cd('./');
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
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let branchExec = exec('git symbolic-ref --short -q HEAD');
        let branch = branchExec.stdout;
        branch = branch.replace('\n', '');
        inputMsg(`当前在这个分支吗: ${branch} (Y/N) `)
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
            console.log('git pull success');
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
            });
    });

}

Promise.resolve()
    .then(() => cdDir())
    .then(() => askBranch())
    .then(branch => pullBranch(branch))
    .then(branch => pushCode(branch))
    .then(() => {
        console.log(`congratulations!!!!`);
        exit(1);
    })
    .catch(err => {
        console.log(`\n操作失败: ${err}`);
        exit(1);
    });

// rl.question('你认为 Node.js 中文网怎么样？', (msg) => {
//     rl.close();

//     if (msg === '') {
//         console.log('请输入字符22');
//         return;
//     }

//     // get_branch = `git symbolic-ref --short -q HEAD`

//     // var q = exec(get_branch);
//     // // var q = exec('git rev-parse --abbrev-ref HEAD');
//     // console.log(q.stdout);




//     console.log(4);
// });


