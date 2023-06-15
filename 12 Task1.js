const http = require("node:http");
const fs = require("fs");
const fsPromise = require("fs/promises");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("home page");
  } else if (req.url === "/list") {
    const files = fs.readdirSync(__dirname);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(files));
  } else if (req.url === "/read") {
    if (fs.existsSync("./example2/file.txt")) {
      const data = fs.readFileSync("./example2/file.txt", "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "no such file exists",
        })
      );
    }
  } else if (req.url === "/write") {
    if (fs.existsSync("./example2/file.txt")) {
      fs.writeFileSync("./example2/file.txt", " how are you", {
        flag: "a",
      });
      const readData = fs.readFileSync("./example2/file.txt", "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ write: true, content: readData }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "no such file exists",
        })
      );
    }
  } else if (req.url === "/createdir") {
    if (!fs.existsSync("./example2/newdir")) {
      fs.mkdirSync("./example2/newdir");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "folder created successfully",
        })
      );
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "folder with same name already exists",
        })
      );
    }
  } else if (req.url === "/createfile") {
    if (fs.existsSync("./example2/file2.txt")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ succcess: false, message: "file already exists" })
      );
    }
    fsPromise
      .appendFile("./example2/file2.txt", " new file")
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ succcess: true, message: "file creation success" })
        );
      })
      .catch((err) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ succcess: false, message: err }));
      });
  } else if (req.url === "/renamefile") {
    if (!fs.existsSync("./example2/file.txt")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ succcess: false, message: "no such file" }));
    }
    fsPromise
      .rename("./example2/file.txt", "./example2/renamedfile.txt")
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            succcess: true,
            message: "rename operation success",
          })
        );
      })
      .catch((err) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ succcess: false, message: err }));
      });
  } else if (req.url === "/removefile") {
    if (!fs.existsSync("./example2/file2.txt")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ succcess: false, message: "no such file" }));
    }
    fsPromise
      .unlink("./example2/file2.txt")
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            succcess: true,
            message: "remove operation success",
          })
        );
      })
      .catch((err) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ succcess: false, message: err }));
      });
  } else if (req.url === "/renamedir") {
    if (!fs.existsSync("./example2/newdir")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ succcess: false, message: "no such directory" })
      );
    }
    fsPromise
      .rename("./example2/newdir", "./example2/renamedfolder")
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            succcess: true,
            message: "rename operation success",
          })
        );
      })
      .catch((err) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ succcess: false, message: err }));
      });
  } else if (req.url === "/removedir") {
    if (!fs.existsSync("./example2/renamedfolder")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ succcess: false, message: "no such directory" })
      );
    }
    fsPromise
      .rmdir("./example2/renamedfolder")
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            succcess: true,
            message: "remove operation success",
          })
        );
      })
      .catch((err) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ succcess: false, message: err }));
      });
  }
});
server.listen(3000, () => {
  console.log("listening on port 3000");
});
