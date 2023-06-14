const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let answer = 10;
rl.question("what is 5 x 2 \n", (userInput) => {
  if (userInput == answer) {
    console.log("correct");
    rl.close();
  } else {
    rl.setPrompt("incorrect answer ! answer again \n");
    rl.prompt();
    rl.on("line", (userInput) => {
      if (userInput == answer) {
        rl.close();
      } else {
        rl.setPrompt("incorrect answer ! answer again \n");
        rl.prompt();
      }
    });
  }
});
