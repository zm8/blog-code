const color = require('./color');

const setColor = function (cnt, colorName, flag) {
    cnt = color[colorName](cnt);
    cnt = flag === 1 ? `\n${cnt}\n` : cnt;
    return cnt;
}

exports.success = function (cnt, flag) {
    console.log(setColor(cnt, 'green', flag));
}

exports.error = function (cnt, flag) {
    console.log(setColor(cnt, 'red', flag));
}

exports.tip = function (cnt, flag) {
    console.log(setColor(cnt, 'yellow', flag));
}