const obj = { a: 1 }
const fn = function (q = obj) {
  console.log(q)
}
fn()
