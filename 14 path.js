const path = require("path");
console.log("__dirname,__filename----------------");
console.log(__dirname);
console.log(__filename);

console.log("basename-------------");
console.log(path.basename(__dirname));
console.log(path.basename(__filename));

console.log("extname---------------");
console.log(path.extname(__filename));

console.log("path.join---------------");
console.log(path.join("folder", "file.txt"));
console.log(path.join("/folder", "file.txt"));
console.log(path.join("folder", "../file.txt"));
console.log(path.join("//folder", "file.txt"));

console.log("path.resolve---------------");
console.log(path.resolve("folder", "file.txt"));
console.log(path.resolve("/folder", "file.txt"));
console.log(path.resolve("folder", "/file.txt"));
console.log(path.resolve("folder", "../file.txt"));

console.log("path.isabsolute-----------");
console.log(path.isAbsolute("/file.txt"));
console.log(path.isAbsolute("./file.txt"));
