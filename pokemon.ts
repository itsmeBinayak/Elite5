import axios from "axios";

// api call
const pokemonApi = async (pokemonName: string) => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
};

// stats

// hp stat
const pokemonHp = async (stats: any) => {
  let hp = stats.find((stat: any) => stat.stat.name == "hp").base_stat;
  return hp;
};

// attack stat
const pokemonAttack = async (stats: any) => {
  let attack = stats.find((stat: any) => stat.stat.name == "attack").base_stat;
  return attack;
};

// defense stat
const pokemonDefense = async (stats: any) => {
  let defense = stats.find(
    (stat: any) => stat.stat.name == "defense"
  ).base_stat;
  return defense;
};

// special attack stat
const pokemonSpecialAttack = async (stats: any) => {
  let specialAttack = stats.find(
    (stat: any) => stat.stat.name == "special-attack"
  ).base_stat;
  return specialAttack;
};

// special defense stat
const pokemonSpecialDefense = async (stats: any) => {
  let specialDefense = stats.find(
    (stat: any) => stat.stat.name == "special-defense"
  ).base_stat;
  return specialDefense;
};

// speed stat
const pokemonSpeed = async (stats: any) => {
  let speed = stats.find((stat: any) => stat.stat.name == "speed").base_stat;
  return speed;
};

export {
  pokemonApi,
  pokemonHp,
  pokemonAttack,
  pokemonDefense,
  pokemonSpecialAttack,
  pokemonSpecialDefense,
  pokemonSpeed,
};
