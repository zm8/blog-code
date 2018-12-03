let shell = require('shelljs');

// 远端url
module.exports = () => {
    return new Promise((resolve, reject) => {
        let result = shell.exec('git symbolic-ref --short -q HEAD', { silent: true });
        if (result.code !== 0) {
            reject(result.stderr);
            return;
        }
        let stdout = result.stdout;
        stdout = stdout.replace('\n', '');
        resolve(stdout);
    });
}