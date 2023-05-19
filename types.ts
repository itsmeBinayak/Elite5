import { ObjectId } from "mongodb";

// interface

// databese: yourPokemon
export interface Pokemon {
  name: string;
  nickName: string;
  wins: number;
  loss: number;
  caught: Date;
}

// database: people profile
export interface PeopleProfile {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  yourPokemon: Pokemon[];
  currentPokemon: string;
}

// for pokemon in pokedex and current pokemon page: extra id and img
export interface PokedexPokemon {
  name: string;
  id: number;
  img: string;
  nickName: string;
  wins: number;
  loss: number;
  caught: Date;
}

// interfaces for pokemon evolution
export interface PokemonSpecies {
  name: string;
  url: string;
}

export interface PokemonEvolution {
  species: PokemonSpecies;
  evolves_to: PokemonEvolution[];
}

export interface EvolutionChain {
  id: number;
  chain: PokemonEvolution;
}

export interface PokemonInfo {
  name: string;
  img: string;
}
