import * as _B from "./all7x7.js"

let text = await cacheFetch("liberty_score.txt");
let result = _B.all_test7x7(text, _B.all_createLookup);
console.log(result);