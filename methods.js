// //event emitter

// const readline = require("readline");

// const EventEmitter = require("node:events");
// const emitter = new EventEmitter();

// emitter.on("event", (value) => {
//   console.log("event is called and a value is passed : " + value);
// });
// emitter.on("event", () => {
//   console.log("multiple eventlisteners can be defined,but runs synchronously");
// });

// emitter.emit("event", 12);

//used for delaying a function so that it can be executed after something, by calling emit method

//Readline
// ------------------------------------------------
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// rl.question("question", (userInput) => {
//   //logic to validate user input
// });

// rl.setPrompt("string"); //to set a prompt which can be printed onto the console using .prompt method
// rl.prompt();

// rl.on('line',(userInput)=>{ //event lister for readline, should be closed with rl.close() after execution
//     // logic here
// })

//server creation
// --------------------------------------------------
// const http = require("node:http");

// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("welcome to home page");
//   } else if (req.url === "/api") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ name: "messi", age: 35 }));
//   }
// });
// server.listen(3000, () => {
//   console.log("listening to port 3000");
// });

//file systems
//-----------------------------------------
/*
fs read and write methods
-----------------------
fs.readFile('path','encoding-type',(error,data)=>{})
fs.readFileSync('path','encoding-type') no cb as this is synchronous
fs.writeFile('path','data to be written',{flag:'a'}) flag a for append data, otherwise will replace data
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

// const fs = require("fs");
// const path = require("path");
// const isFile = (file) => {
//   return fs.lstatSync(file).isFile();
// };
// try {
//   if (!fs.existsSync("example2")) {
//     fs.mkdirSync("example2");
//   } else {
//     const data = fs
//       .readdirSync("./example")
//       .map((fileName) => {
//         return path.join("./example", fileName);
//       })
//       .filter(isFile);
//     console.log(data);
//   }
// } catch (error) {
//   console.error(error);
// }


// read contents of a directory
//--------------
// fs.readdirSync('path') returns an array of files and directories inside the path


//delete file
//--------------------
// fs.unlink('directory+filename',(err)=>{

// })
// fs.unlinkSync('directory+filename')

//rename file or directory
//fs.rename('old','new',cb)

//remove a directory
//-------------------------------------

//fs.rmdir( path, options, callback )

// Parameters: This method accept three parameters as mentioned above and described below:

//path: It holds the path of the directory that has to be removed. It can be a String, Buffer or URL.
//options: It is an object that can be used to specify optional parameters that will affect the operation. It has three optional parameters:
//--------
//      recursive: It is a boolean value which specifies if recursive directory removal is performed. In this mode, errors are not reported if the specified path is not found and the operation is retried on failure. The default value is false.
//      maxRetries: It is an integer value which specifies the number of times Node.js will try to perform the operation when it fails due to any error. The operations are performed after the given retry delay. This option is ignored if the recursive option is not set to true. The default value is 0.
//      retryDelay: It is an integer value which specifies the time to wait in milliseconds before the operation is retried. This option is ignored if the recursive option is not set to true. The default value is 100 milliseconds.
//-------
//callback: It is the function that would be called when the method is executed.
//      err: It is an error that would be thrown if the operation fails.
