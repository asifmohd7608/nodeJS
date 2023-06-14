const fetchData = async (id) => {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/ability/${id}/`);
    const response = await data.json();
    console.log(response.name);
  } catch (error) {
    console.log("something went wrong");
  }
};
module.exports = fetchData;
