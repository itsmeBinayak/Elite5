const lowerCaseName = string => string.toLowerCase()

const getPokemon = (e, pokemonNumber, defaultPokemon = "pikachu") => {
  const nameInput = lowerCaseName(document.querySelector(`#pokemonName${pokemonNumber}`).value);
  const name = nameInput ? lowerCaseName(nameInput) : lowerCaseName(defaultPokemon);
  const container = document.querySelector(`#pokemon-container${pokemonNumber}`);
  const img = container.querySelector(".img img");
  const statsList = document.querySelector(`#stats${pokemonNumber}`);
  const nameElement = container.querySelector(".name");
  
  fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(response => response.json())
    .then(data => {
      
      //shows name api
      nameElement.textContent = data.name[0].toUpperCase() + data.name.slice(1);
      
      //show immage api
      img.src = data.sprites.other["official-artwork"].front_default;
      img.alt = data.name;

      
 // shows stats api 
      statsList.innerHTML = "<h3>Base stats </h3>";
      data.stats.forEach((stat, index) => {
        const listItem = document.createElement("div");
        listItem.innerHTML =  
        `<div class="skill_box"> 
          <span >${stat.stat.name}:</span><span class="stat_value">${stat.base_stat}</span> 
          <div class="skill">
            <div class="skill_level" data-percentage="${stat.base_stat}"></div>
          </div>
        </div>`;

        const percentage = new Percentage(listItem.querySelector('.skill_level'), stat.base_stat);
        statsList.appendChild(listItem);

        percentage.update(stat.base_stat);
      });
    })
    .catch(err => console.log("Pokemon not found", err));

 
};
//vergelijkt de beide stats en geeft ze de kleur 
const compareStats = (statValue1, statValue2, listItem, skillLevel1, skillLevel2) => {
  
  
  const percentage1 = parseFloat(skillLevel1.dataset.percentage);
  const percentage2 = parseFloat(skillLevel2.dataset.percentage);
  
  skillLevel1.style.backgroundColor = percentage1 > percentage2 ? "limegreen" : percentage1 < percentage2 ? "red" : "yellow";
  skillLevel2.style.backgroundColor = percentage2 > percentage1 ? "limegreen" : percentage2 < percentage1 ? "red" : "yellow";
};
//vergelijkt alle stats met compareStats
const compareAllStats = () => {
  const statsItems1 = document.querySelectorAll("#stats1 .skill_box");
  const statsItems2 = document.querySelectorAll("#stats2 .skill_box");

  statsItems1.forEach((item1, index) => {
    const value1 = parseInt(item1.querySelector('.stat_value').textContent);
    const value2 = parseInt(statsItems2[index].querySelector('.stat_value').textContent);
    const skillLevel1 = item1.querySelector(".skill_level");
    const skillLevel2 = statsItems2[index].querySelector(".skill_level");

    compareStats(value1, value2, item1, skillLevel1, skillLevel2);
    compareStats(value2, value1, statsItems2[index], skillLevel2, skillLevel1);
  });
};

//
document.querySelector("#search1").addEventListener("click", e => getPokemon(e, 1));
document.querySelector("#search2").addEventListener("click", e => getPokemon(e, 2));
document.querySelector("#compare").addEventListener("click", compareAllStats);

window.onload = () => {
   
    const defaultPokemon2 = "charmander";
    getPokemon(null, 1,);
    getPokemon(null, 2, defaultPokemon2);
  };