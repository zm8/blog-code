const submit = require('./submit');
const log = require('../com/log');

module.exports = function () {
    Promise.resolve()
        .then(() => log.org('正在 git push........', 1))
        .then(() => submit.push())
        .then(() => log.tip('git push success', 1));
}