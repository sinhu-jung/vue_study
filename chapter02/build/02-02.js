"use strict";

var mst = "GLOBAL";
function outer() {
  var msg = "OUTER";
  console.log(msg);
  if (true) {
    var _msg = "BLOCK";
    console.log(_msg);
  }
}
outer();