const color = require('./color');

const setColor = function (cnt, colorName, flag) {
    cnt = color[colorName](cnt);
    cnt = flag === 1 ? `\n${cnt}\n` : cnt;
    return cnt;
}

exports.success = function (cnt, flag) {
    console.log(setColor(cnt, 'green', flag));
    return this;
}

exports.color = function (colorName, cnt, flag) {
    console.log(setColor(cnt, colorName, flag));
    return this;
}

exports.error = function (cnt, flag) {
    console.log(setColor(cnt, 'red', flag));
    return this;
}

exports.tip = function (cnt, flag) {
    console.log(setColor(cnt, 'yellow', flag));
    return this;
}

exports.org = function (cnt) {
    console.log(cnt);
    return this;
}

exports.oneline = function (cnt) {
    process.stdout.write(cnt);
    return this;
}

exports.start = function (cnt) {
    this.color('magenta', `======================${cnt}======================`, 1);
}