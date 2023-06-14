const fetchData = (id) => {
  return new Promise((resolve, reject) => {
    if (id > 0 && id < 100) {
      fetch(`https://pokeapi.co/api/v2/ability/${id}/`)
        .then((res) => res.json())
        .then((res) => resolve(res));
    } else {
      reject("enter an id in between 0 and 1");
    }
  });
};

fetchData(93)
  .then((res) => console.log("93 : " + res.name))
  .catch((err) => console.log(err));

fetchData(66)
  .then((res) => console.log("66 : " + res.name))
  .catch((err) => console.log(err));

Promise.all([fetchData(12), fetchData(8), fetchData(81)])
  .then((res) => {
    let names = [];
    for (const key of Object.keys(res)) {
      names.push(res[key].name);
    }
    console.log("all : " + names);
  })
  .catch((err) => console.log(err));
