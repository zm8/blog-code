const submit = require('./submit');
const log = require('../com/log');
const inputMsg = require('../com/inputMsg');
const color = require('../com/color');

function askCommit() {
    return Promise.resolve()
        .then(() => {
            return new Promise((resolve, reject) => {
                let comStr = '请输入 commit 内容: ';
                comStr = color.yellow(`${comStr}`);
                return inputMsg(comStr)
                    .then(msg => {
                        if (msg.length < 6) {
                            reject('commit 内容太短');
                            return;
                        }
                        resolve(msg);
                    });
            });
        })
}

module.exports = function () {
    return Promise.resolve()
        .then(() => askCommit())
        .then(msg => {
            submit.add();
            return msg;
        })
        .then(msg => submit.commit(msg))
        .then(() => log.tip('git commit success', 1))
        .then(err => { throw Error(err) })
}