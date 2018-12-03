const execCmd = require('./com/execCmd');
const branchCurrent = require('./git/diffMaster')

branchCurrent()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        throw Error(err);
    });

// execCmd('cd', './2017')
//     .then(() => execCmd('mkdir', 'f1111.js'))
//     .then(() => execCmd('cd', '../cmd'))
//     .then(() => execCmd('mkdir', 'q1111.js'))
//     .catch((err) => {
//         throw Error(err);
//     });


