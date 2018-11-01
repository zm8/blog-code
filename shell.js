require('shelljs/global');
const readline = require('readline');

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
        rl.question(`当前在这个分支吗: ${branch} (Y/N) `, (msg) => {
            if (msg && msg.toLowerCase() === 'y') {
                resolve();
            } else {
                reject('askBranch 暂停了');
            }
        });
    });
}

Promise.resolve()
    .then(() => cdDir())
    .then(() => askBranch())
    .then(() => {
        console.log(`congratulations!!!!`);
        exit(1);
    })
    .catch(err => {
        console.log(`操作失败: ${err}`);
        exit(1);
    });

const gitPull = () => {
    //     if (exec('git add .').code !== 0) {
    //         echo('Error: Git add failed');
    //         exit(1);
    //     }
}

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


//     if (exec('git add .').code !== 0) {
//         echo('Error: Git add failed');
//         exit(1);
//     }

//     console.log(2);

//     if (exec(`git commit -m "${msg}"`).code !== 0) {
//         echo('Error: Git commit failed');
//         exit(1);
//     }

//     console.log(3);

//     if (exec('git push').code !== 0) {
//         echo('Error: Git push failed');
//         exit(1);
//     }

//     console.log(4);
// });


