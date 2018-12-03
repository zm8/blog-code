const branchCurrent = require('./branchCur');
const submit = require('./submit');
const log = require('../com/log');

module.exports = function () {
    Promise.resolve()
        .then(() => log.org('正在 git pull........', 1))
        .then(() => branchCurrent())
        .then(branch => submit.pull(branch))
        .then(() => log.tip('git pull success', 1))
}