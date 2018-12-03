let shell = require('shelljs');

const submit = function (cmd) {
    return new Promise((resolve, reject) => {
        let result = shell.exec(cmd, { silent: true });
        if (result.code !== 0) {
            reject(result.stderr);
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