const fetchData = async (id) => {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/abilit/${id}/`);
    const response = await data.json();
    console.log(response.name);
  } catch (error) {
    console.log("something went wrong");
  } finally {
    console.log("completed execution");
  }
};

fetchData(18);
