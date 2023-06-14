const print = (data) => {
  console.log(` value of i is : ${data}`);
};

const mainFn = (cb) => {
  let i = 0;
  while (i <= 5) {
    i++;
  }
  cb(i);
};

mainFn(print);

//nested callback

let fetchData = (cb) => {
  setTimeout(() => {
    let data = { id: 1, name: "messi" };
    cb(data);
  }, 2000);
};
let extractName = (data, cb) => {
  let name = data.name;
  cb(name);
};
let showName = (name) => {
  console.log(name);
};

fetchData((data) => {
  extractName(data, (name) => {
    showName(name);
  });
});


