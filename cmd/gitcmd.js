const git = require('./git');

git('./')
    .then(() => {
        log.success('git push success!!!');
    });