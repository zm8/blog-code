const branchCurrent = require('./git/branchCur');
const remoteUrl = require('./git/remoteUrl');
const log = require('./com/log');
const execCmd = require('./com/execCmd');
const inputMsg = require('./com/inputMsg');
const color = require('./com/color');
const gitPull = require('./git/gitPull');
const gitPush = require('./git/gitPush');
const gitCommit = require('./git/gitCommit');

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
                            let msgContinue = color.yellow(`没有修改的文件，是否继续 (Y/N): `);
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
            return gitPull()
                .then(() => pullSuccess())
                .catch(err => {
                    // log.tip(err, 1);
                    log.error('git pull 失败了');
                    return pullErr();
                });
        });

    function pullSuccess() {
        return Promise.resolve()
            .then(() => gitCommit())
            .then(() => gitPush());
    }

    function pullErr(commitMsg) {
        let comStr = '是否先commit再pull: (Y/N)';
        comStr = color.yellow(`${comStr}`);
        return inputMsg(comStr)
            .then(msg => {
                return new Promise((resolve, reject) => {
                    if (msg && msg.toLowerCase() === 'y') {
                        resolve();
                    } else {
                        reject('停止了');
                    }
                });
            })
            .then(() => gitCommit())
            .then(() => gitPull())
            .then(() => gitPush());
    }
}
