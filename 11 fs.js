/*
fs read and write methods
-----------------------
fs.readFile('path','encoding-type',(error,data)=>{})
fs.writeFile('path','data to be written',{flag:'a'}) flag a for append data, otherwise will replace data
fs.readFileSync('path','encoding-type') no cb as this is synchronous
fs.writeFileSync('path','data to be written')
we can also use .then and .catch instead of callbacks

streams- for transfering chunks of data from one file to other
------------------------------------------------------
fs.createReadStream('path',{encoding:'utf-8,highWaterMark:2})
highWaterMark - chunks of data to be read, 2byte in here,64kb by default
fs.createwriteStream('path')

listener
.on('data',(chunks)=>(.write(chunk)))

*/

const fs = require("fs");
const path = require("path");
const isFile = (file) => {
  return fs.lstatSync(file).isFile();
};
try {
  if (!fs.existsSync("example2")) {
    fs.mkdirSync("example2");
    fs.writeFileSync("./example2/file.txt", "helloo !");
  } else {
    const data = fs
      .readdirSync("./example")
      .map((fileName) => {
        return path.join("./example", fileName);
      })
      .filter(isFile);
    console.log(data);
  }
} catch (error) {
  console.error(error);
}
