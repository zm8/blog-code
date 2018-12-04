const git = require('./git');
const log = require('./com/log');

Promise.resolve()
    .then(() => git({
        path: './',

    }))
    // .then(() => git('../biyibi_new_skin'))
    // .then(() => {
    //     log.success('git push success!!!', 1);
    // })
    .catch((err) => {
        log.error(err);
    });