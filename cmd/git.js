const branchCurrent = require('./git/branchCur');
const remoteUrl = require('./git/remoteUrl');
const submit = require('./git/submit');
const log = require('./com/log');
const execCmd = require('./com/execCmd');
const inputMsg = require('./com/inputMsg');
const color = require('./com/color');

module.exports = function (path) {
    return Promise.resolve()
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
            return new Promise((resolve, reject) => {
                let comStr = '\n请输入 commit 内容: ';
                comStr = color.yellow(`${comStr}`);
                return inputMsg(comStr)
                    .then(msg => {
                        if (msg.length < 2) {
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
