const lowerCaseName = string => string.toLowerCase();


const compareStats = (statValue1, statValue2, listItem) => {
  listItem.style.color = statValue1 > statValue2 ? "limegreen" : statValue1 < statValue2 ? "red" : "black";
};

const getPokemon = (e, pokemonNumber) => {
    const defaultPokemon = "pikachu";
    const nameInput = lowerCaseName(document.querySelector(`#pokemonName${pokemonNumber}`).value);
    const name = nameInput ? lowerCaseName(nameInput) : lowerCaseName(defaultPokemon);
  const container = document.querySelector(`#pokemon-container${pokemonNumber}`);
  const img = container.querySelector(".img img");
  const statsList = document.querySelector(`#stats${pokemonNumber}`);
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(response => response.json())
    .then(data => {
      img.src = data.sprites.other["official-artwork"].front_default;
      img.alt = data.name;

      statsList.innerHTML = "";
      data.stats.forEach((stat, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;

        const otherStatsList = document.querySelector(`#stats${pokemonNumber === 1 ? 2 : 1}`);
        const otherListItem = otherStatsList.querySelector(`li:nth-child(${index + 1})`);
        
       
        statsList.appendChild(listItem);
      });
    })
    .catch(err => console.log("Pokemon not found", err));

 
};

const compareAllStats = () => {
    const statsItems1 = document.querySelectorAll("#stats1 li");
    const statsItems2 = document.querySelectorAll("#stats2 li");
    
    statsItems1.forEach((item, index) => {
      const value1 = parseInt(item.textContent.split(":")[1]);
      const value2 = parseInt(statsItems2[index].textContent.split(":")[1]);
      
      compareStats(value1, value2, item);
      compareStats(value2, value1, statsItems2[index]);
    });
  };

document.querySelector("#search1").addEventListener("click", e => getPokemon(e, 1));
document.querySelector("#search2").addEventListener("click", e => getPokemon(e, 2));
document.querySelector("#compare").addEventListener("click", compareAllStats);

window.onload = () => {
    const defaultPokemon = "pikachu";
    getPokemon(null, 1, defaultPokemon);
    getPokemon(null, 2, defaultPokemon);
  };