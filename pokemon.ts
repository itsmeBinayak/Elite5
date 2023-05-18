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
const userPokemonsData = async (userPokemons: any) => {
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

// stats
const pokemonStats = async (stats: any, whichStatName: string) => {
  let hp = stats.find((stat: any) => stat.stat.name == whichStatName).base_stat;
  return hp;
};

export { pokemonApi, userPokemonsData, pokemonStats };
