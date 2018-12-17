
const fs = require("fs");
const defaultStr = 'export default';

const getFileJSON = () => {
    let data = fs.readFileSync("./version/versionImg.js", "utf-8");
    data = data.replace(new RegExp(defaultStr, 'g'), '');
    data = data.replace(/\'/g, '\"');
    data = JSON.parse(data);
    return data;
}

const getCommitMD5 = (filePath) => {
    let commitMD5 = exec(`git log -n 1 --pretty=format:"%h" -- ${filePath}`, { silent: true });
    let stdout = commitMD5.stdout;
    return stdout;
}

const getDiffMaster = () => {
    let gitDiff = exec('git diff origin/master --name-only', { silent: true });
    let stdout = gitDiff.stdout;
    stdout = stdout.replace(/(^\n*)|(\n*$)/g, "");
    if (stdout) {
        stdout = stdout.split('\n');
        return stdout;
    } else {
        return [];
    }
}

// shelljs.cp('-R', './version', './js/');

let json = getFileJSON();
let filesDiff = getDiffMaster();
filesDiff.forEach(item => {
    var md5 = getCommitMD5(item);
    if (md5) {
        json[item] = md5;
    }
});
json = JSON.stringify(json);
json = defaultStr + ' ' + json;
fs.writeFileSync("./version/versionImg.js", json, 'utf8');