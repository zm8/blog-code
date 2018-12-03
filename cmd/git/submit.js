let shell = require('shelljs');

const submit = function (cmd) {
    return new Promise((resolve, reject) => {
        let res = shell.exec(cmd, { silent: true });

        let stdout = res.stdout;
        let stderr = res.stderr;
        console.log(1111);
        console.log(stdout);
        console.log(2222);
        console.log(stderr);
        console.log(3333);

        if (res.code !== 0) {
            reject(res.stdout || res.stderr);
            return;
        }
        resolve();
    });
}

exports.pull = function (branch) {
    return submit(branch ? `git pull origin ${branch}` : `git pull`);
}
exports.add = function () {
    return submit(`git add .`);
}
exports.commit = function (msg) {
    return submit(`git commit -m "${msg}"`);
}
exports.push = function () {
    return submit(`git push`);
}