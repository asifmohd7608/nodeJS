const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.createReadStream("./Template/index.html").pipe(res);
});
server.listen(3000, () => {
  console.log("listening to port 3000");
});
