const timeOutFunction = (time) => {
  console.log("before");
  setTimeout(() => {
    console.log(`printing this after ${time} ms`);
  }, time);
  console.log("after");
};

timeOutFunction(10000); //only starts executing after all the codes are done
console.log("after calling function");
for (let i = 0; i <= 1e10; i++) {}
console.log("after loop");
