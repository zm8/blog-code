require('shelljs/global');

console.log(1);

if (exec('git add .').code !== 0) {
    echo('Error: Git add failed');
    exit(1);
}

console.log(2);

if (exec('git commit -m "Auto-commit"').code !== 0) {
    echo('Error: Git commit failed');
    exit(1);
}

console.log(3);

if (exec('git push"').code !== 0) {
    echo('Error: Git push failed');
    exit(1);
}

console.log(4);

exit(0);