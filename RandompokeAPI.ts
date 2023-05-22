import { stat } from "fs";



interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  hp:number;
  attack: number;
  defense :number;
  specialAttack :number;
  specialDefense : number;
  speed: number;
}

export async function getRandomPokemon(): Promise<Pokemon> {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const { results } = await response.json();

    const randomIndex = Math.floor(Math.random() * results.length);
    const randomPokemonUrl = results[randomIndex].url;

    const pokemonName = randomPokemonUrl.split('/').slice(-2, -1)[0];
    const pokemon = await getPokemon(pokemonName);

    return pokemon;
  } catch (error) {
    throw new Error('Failed to fetch random Pokémon');
  }
}

async function getPokemon(pokemonName: string): Promise<Pokemon> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();

    const { name,sprites, stats } = data;

    const hp = stats[0].base_stat
    const attack = stats[1].base_stat
    const defense = stats[2].base_stat
    const specialAttack = stats[3].base_stat
    const specialDefense = stats[4].base_stat
    const speed = stats[5].base_stat

    return {
      name,
      sprites,
      hp,
      attack,
      defense,
      specialAttack,
      specialDefense,
      speed
    };
  } catch (error) {
    throw new Error('Failed to fetch Pokémon stats');
  }
}


interface PokemonStat {
  base_stat: number;
  name: string;
}




