import axios from "axios";
import {
  Pokemon,
  PeopleProfile,
  PokedexPokemon,
  PokemonSpecies,
  PokemonEvolution,
  EvolutionChain,
  PokemonInfo,
} from "./types";

// api call
const pokemonApi = async (pokemonName: string) => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
};

// user pokemons info
const userPokemonsData = async (userPokemons: Pokemon[]) => {
  const pokemonsData: PokedexPokemon[] = [];

  for (let userpokemon of userPokemons) {
    let pokeResponse = pokemonApi(userpokemon?.name!);

    const pokemon: PokedexPokemon = {
      name: userpokemon.name,
      id: (await pokeResponse).data.id,
      img: (await pokeResponse).data.sprites.front_default,
      nickName: userpokemon.nickName,
      wins: userpokemon.wins,
      loss: userpokemon.loss,
      caught: userpokemon.caught,
    };
    pokemonsData.push(pokemon);
  }

  return pokemonsData;
};

// pokemon stats
const pokemonStats = async (stats: any, whichStatName: string) => {
  let stat = stats.find(
    (stat: any) => stat.stat.name == whichStatName
  ).base_stat;
  return stat;
};

// find one pokemon that match from url
const thisPokemon = (userPokemons: Pokemon[], pokemonName: string) => {
  let pokemon = userPokemons?.find((p) => p.name === pokemonName);
  return pokemon;
};

// evolution of pokemon
const evolutionApi = async (pokeResponse: any) => {
  // pokemon api call
  const speciesUrl: string = pokeResponse.data.species.url;

  // pokemon species url call
  let pokemonSpeciesUrl = axios.get(speciesUrl);
  const evolutionChainUrl: string = (await pokemonSpeciesUrl).data
    .evolution_chain.url;

  // pokemon evolution chaian url call
  let pokemonEvolutionChainUrl = axios.get(evolutionChainUrl);
  const evolutionChain = (await pokemonEvolutionChainUrl).data.chain;

  // pokemon evolution data array
  const pokemonInfos: PokemonInfo[] = [];

  parseEvolutionChain(evolutionChain, pokemonInfos);
  
  return pokemonInfos;
};

// get evolution value
const parseEvolutionChain = async (
  evolution: PokemonEvolution,
  pokemonInfos: PokemonInfo[]
) => {
  const name = evolution.species.name;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
    evolution.species.url.split("/")[6]
  }.png`;

  // push in array
  pokemonInfos.push({ name, img });

  // loop function 
  evolution.evolves_to.forEach((evolution) => {
    parseEvolutionChain(evolution, pokemonInfos);
  });
};

export {
  pokemonApi,
  userPokemonsData,
  pokemonStats,
  thisPokemon,
  evolutionApi,
};
