const execCmd = require('./com/execCmd');

console.log(__dirname);

// execCmd('cd', './2017')
//     .then(() => execCmd('mkdir', 'f1111.js'))



execCmd('cd', './2017')
    .then(() => execCmd('mkdir', 'f1111.js'))
    .then(() => execCmd('cd', '../cmd'))
    .then(() => execCmd('mkdir', 'q1111.js'))
    .catch((err) => {
        console.log(1111);
        throw Error(err);
    });
