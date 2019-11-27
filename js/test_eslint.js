const obj = {
  a: 1,
  b: 2,
};
const fn = function(q = obj) {
  console.log(q);
};
fn();
