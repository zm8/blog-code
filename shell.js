require('shelljs/global');

console.log(1);

// if (exec('git merge origin/master').code !== 0) {
//     echo('Error: Git merge failed');
//     exit(1);
// }

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('你认为 Node.js 中文网怎么样？', (msg) => {
    rl.close();

    if (msg === '') {
        console.log('请输入字符22');
        return;
    }

    // get_branch = `git symbolic-ref --short -q HEAD`

    // var q = exec(get_branch);
    // // var q = exec('git rev-parse --abbrev-ref HEAD');
    // console.log(q.stdout);


    if (exec('git add .').code !== 0) {
        echo('Error: Git add failed');
        exit(1);
    }

    console.log(2);

    if (exec(`git commit -m "${msg}"`).code !== 0) {
        echo('Error: Git commit failed');
        exit(1);
    }

    console.log(3);

    if (exec('git push').code !== 0) {
        echo('Error: Git push failed');
        exit(1);
    }

    console.log(4);
});


