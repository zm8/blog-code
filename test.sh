#!/usr/bin/env node
var name = process.argv[2];
var exec = require('child_process').exec;


console.log(1);



var code1 = exec('git add .').code;
if (code1 !== 0) {
    console.log('Error: Git add failed');
    process.exit();
}

console.log(2);

if (exec('git commit -m "Auto-commit"').code !== 0) {
    console.log('Error: Git commit failed');
    process.exit();
}

console.log(3);

if (exec('git push').code !== 0) {
    console.log('Error: Git push failed');
    process.exit();
}

console.log(4);
