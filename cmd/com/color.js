const COLOR = {
    reset: '\u001b[1;0m',
    bright: '\u001b[1;1m',
    dim: '\u001b[1;2m',
    underscore: '\u001b[1;4m',
    blink: '\u001b[1;5m',
    reverse: '\u001b[1;7m',
    hidden: '\u001b[1;8m',
    black: '\u001b[1;30m',
    red: '\u001b[1;31m',
    green: '\u001b[1;32m',
    yellow: '\u001b[1;33m',
    blue: '\u001b[1;34m',
    magenta: '\u001b[1;35m',
    cyan: '\u001b[1;36m',
    white: '\u001b[1;37m',
    crimson: '\u001b[1;38m'
}

let obj = {};
for (let n in COLOR) {
    obj[n] = cnt => COLOR[n] + cnt + COLOR['reset'];
}

module.exports = obj;