const R = require(".");
const r = new R("12345678m123s44z9m", {otakazePei: true});
const res = r.calc();
console.log(res);
