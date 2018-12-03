require('shelljs/global');

// 去到哪个目录
module.exports = () => {
    return new Promise((resolve, reject) => {
        let repository = exec('git remote show origin -n | grep "Fetch URL:"', { silent: true });
        if (repository.code !== 0) {
            reject(repository.code);
            return;
        }
        // repository = repository.substr(repository.lastIndexOf('/') + 1);
        repository = repository.replace(/\s+Fetch URL:\s+/, '');
        repository = repository.replace('\n', '');
        resolve(repository);
    });
}