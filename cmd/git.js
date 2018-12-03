const branchCurrent = require('./git/branchCur');
const remoteUrl = require('./git/remoteUrl');
const submit = require('./git/submit');
const log = require('./com/log');
const execCmd = require('./com/execCmd');
const inputMsg = require('./com/inputMsg');
const color = require('./com/color');

module.exports = function (path) {
    return Promise.resolve()
        .then(() => {
            log.start('开始操作git');
        })
        .then(() => execCmd('cd', path))
        .then(() => {
            return execCmd('pwd')
                .then(data => {
                    log.oneline(`当前所在路径是: `)
                        .tip(`${data}`);
                });
        })
        .then(() => {
            return remoteUrl()
                .then(data => {
                    log.oneline(`当前的远端分支是: `)
                        .tip(`${data}`);
                });
        })
        .then(() => {
            return branchCurrent()
                .then(data => {
                    log.oneline(`当前的branch是: `)
                        .tip(`${data}`);
                    return data;
                });
        })
        .then(() => {
            return execCmd('git status --short')
                .then(data => {
                    if (data) {
                        log.oneline(`当前的修改文件有: \n`)
                            .tip(`${data}`);
                    } else {
                        return new Promise((resolve, reject) => {
                            let msgContinue = color.Yellow(`没有修改的文件，是否继续 (Y/N): `);
                            return inputMsg(msgContinue)
                                .then(msg => {
                                    if (msg && msg.toLowerCase() === 'y') {
                                        resolve();
                                    } else {
                                        reject('停止了');
                                    }
                                });
                        });
                    }
                });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                let comStr = '\n请输入 commit 内容: ';
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
        .then(data => {
            return submit.add()
                .then(() => submit.commit(data))
                .then(() => branchCurrent())
                .then(data => submit.pull(data))
                .then(() => submit.push());
        });
}
