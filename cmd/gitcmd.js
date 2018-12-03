const git = require('./git');
const log = require('./com/log');

git('./')
    .then(() => {
        log.success('git push success!!!');
    })
    .then(() => git('../biyibi_new_skin'))
    .then(() => {
        log.success('git push success!!!');
    });