const print = (message, time) => {
  console.log(message + " " + time + " ms");
};
let message = "printing this every";
setInterval(print, 1000, message, 1000);
for (let i = 0; i <= 1e10; i++) {}
