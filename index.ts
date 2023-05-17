import express, { response } from "express";
import ejs from "ejs";
import fs from "fs/promises";
import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";
import { getRandomPokemon } from "./RandompokeAPI";
import { isPokemonCaught } from "./isPokemonCaught";

// database url
const uri: string =
  "mongodb+srv://elite5:elite5password@mycluster.z2rzywu.mongodb.net/?retryWrites=true&w=majority";

// connect url client
const client = new MongoClient(uri);

// app
const app = express();

// set
app.set("port", 3000);
app.set("view engine", "ejs");

// use
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// interface

// databese: yourPokemon
interface Pokemon {
  name: string;
  nickName: string;
  wins: number;
  loss: number;
  caught: Date;
}

// database: people profile
interface PeopleProfile {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  yourPokemon: Pokemon[];
  currentPokemon: string;
}

// for pokemon in pokedex and current pokemon page: extra id and img
interface PokedexPokemon {
  name: string;
  id: number;
  img: string;
  nickName: string;
  wins: number;
  loss: number;
  caught: Date;
}

// interfaces for pokemon evolution
interface PokemonSpecies {
  name: string;
  url: string;
}

interface PokemonEvolution {
  species: PokemonSpecies;
  evolves_to: PokemonEvolution[];
}

interface EvolutionChain {
  id: number;
  chain: PokemonEvolution;
}

interface PokemonInfo {
  name: string;
  img: string;
}

// landing page: get
app.get("/", (req: any, res: any) => {
  res.render("landingPage");
});

// projects Error page: get
app.get("/projectsError", (req: any, res: any) => {
  res.render("projectsError");
});

// login page: get
app.get("/login", (req: any, res: any) => {
  res.render("login");
});

// login page: post
app.post("/login", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let email = req.body.email;
    let password = req.body.password;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let loginUser = await peopleProfileCollection.findOne<PeopleProfile>({
      email: email,
    });

    if (password == loginUser?.password) {
      res.redirect(`/user/${loginUser?._id}`);
    } else {
      res.redirect(`/login`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// signUp page: get
app.get("/signUp", (req: any, res: any) => {
  res.render("signUp");
});

// signUp page: post
app.post("/signUp", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    await peopleProfileCollection.insertOne({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      yourPokemon: [
        {
          name: "pikachu",
          nickName: "pikachu",
          wins: 0,
          loss: 0,
          caught: new Date(),
        },
      ],
      currentPokemon: "pikachu",
    });

    res.render("accountMade", {
      firstname: req.body.firstname,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// home page: get
app.get("/user/:id", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id: number = req.params.id;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponse = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponse).data.sprites.front_default;

    const stats = (await pokeResponse).data.stats;
    let hp = stats.find((stat: any) => stat.stat.name == "hp").base_stat;
    let attack = stats.find(
      (stat: any) => stat.stat.name == "attack"
    ).base_stat;
    let defense = stats.find(
      (stat: any) => stat.stat.name == "defense"
    ).base_stat;
    let specialAttack = stats.find(
      (stat: any) => stat.stat.name == "special-attack"
    ).base_stat;
    let specialDefense = stats.find(
      (stat: any) => stat.stat.name == "special-defense"
    ).base_stat;
    let speed = stats.find((stat: any) => stat.stat.name == "speed").base_stat;

    res.render("index", {
      user: user,
      currentPokemonImg: currentPokemonImg,
      hp: hp,
      attack: attack,
      defense: defense,
      specialAttack: specialAttack,
      specialDefense: specialDefense,
      speed: speed,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// pokemonComparison page: get
app.get("/user/:id/pokemonComparison", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id: number = req.params.id;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    res.render("vergelijken", {
      user: user,
      currentPokemonImg: currentPokemonImg,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// pokedex page: get
app.get("/user/:id/pokedex", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id: number = req.params.id;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    // ------------------------------------------------------------

    const userPokemons = user?.yourPokemon;
    const pokemonsData: PokedexPokemon[] = [];

    if (userPokemons != undefined) {
      for (let userpokemon of userPokemons) {
        let pokeResponse = axios.get(
          `https://pokeapi.co/api/v2/pokemon/${userpokemon.name}`
        );
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
    }

    res.render("pokedex", {
      user: user,
      pokemons: user?.yourPokemon,
      pokemonsData: pokemonsData,
      currentPokemonImg: currentPokemonImg,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// pokedex page: post
app.post("/user/:id/pokedex", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id = new ObjectId(req.params.id);

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: id,
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    //------------------------------------

    const userPokemons = user?.yourPokemon;
    const pokemonsData: PokedexPokemon[] = [];

    if (userPokemons != undefined) {
      for (let userpokemon of userPokemons) {
        let pokeResponse = axios.get(
          `https://pokeapi.co/api/v2/pokemon/${userpokemon.name}`
        );
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
    }

    if (user != undefined) {
      user.currentPokemon = req.body.currentPokemonName;
    }

    await peopleProfileCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: user,
      }
    );

    res.render("pokedex", {
      user: user,
      pokemons: user?.yourPokemon,
      pokemonsData: pokemonsData,
      currentPokemonImg: currentPokemonImg,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// currentPokemon page: get
app.get("/user/:id/pokedex/:pokemonName", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id: number = req.params.id;
    let pokemonName: string = req.params.pokemonName;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    //------------------------------------

    //finding pokemon from url
    const userPokemons = user?.yourPokemon;
    const findPokemon = userPokemons?.find((p) => p.name === pokemonName);

    //looking evolution
    let pokeResponse = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    const speciesUrl: string = (await pokeResponse).data.species.url;

    let pokemonSpeciesUrl = axios.get(speciesUrl);
    const evolutionChainUrl: string = (await pokemonSpeciesUrl).data
      .evolution_chain.url;

    let pokemonEvolutionChainUrl = axios.get(evolutionChainUrl);
    const evolutionChain = (await pokemonEvolutionChainUrl).data.chain;

    const pokemonInfos: PokemonInfo[] = [];

    const parseEvolutionChain = async (evolution: PokemonEvolution) => {
      const name = evolution.species.name;
      // let pokeImgResponse = axios.get(
      //   `https://pokeapi.co/api/v2/pokemon/${name}`
      // );
      // const img = (await pokeImgResponse).data.sprites.front_default;
      // console.log(img);

      const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        evolution.species.url.split("/")[6]
      }.png`;

      pokemonInfos.push({ name, img });

      evolution.evolves_to.forEach((evolution) => {
        parseEvolutionChain(evolution);
      });
    };

    parseEvolutionChain(evolutionChain);

    const stats = (await pokeResponse).data.stats;
    let hp = stats.find((stat: any) => stat.stat.name == "hp").base_stat;
    let attack = stats.find(
      (stat: any) => stat.stat.name == "attack"
    ).base_stat;
    let defense = stats.find(
      (stat: any) => stat.stat.name == "defense"
    ).base_stat;
    let specialAttack = stats.find(
      (stat: any) => stat.stat.name == "special-attack"
    ).base_stat;
    let specialDefense = stats.find(
      (stat: any) => stat.stat.name == "special-defense"
    ).base_stat;
    let speed = stats.find((stat: any) => stat.stat.name == "speed").base_stat;

    res.render("huidigePokemon", {
      user: user,
      name: findPokemon?.name,
      id: (await pokeResponse).data.id,
      img: (await pokeResponse).data.sprites.front_default,
      nickName: findPokemon?.nickName,
      wins: findPokemon?.wins,
      loss: findPokemon?.loss,
      caught: findPokemon?.caught,
      pokemonInfos: pokemonInfos,
      hp: hp,
      attack: attack,
      defense: defense,
      specialAttack: specialAttack,
      specialDefense: specialDefense,
      speed: speed,
      currentPokemonImg: currentPokemonImg,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// currentPokemon page: post
app.post("/user/:id/pokedex/:pokemonName", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id = new ObjectId(req.params.id);
    let pokemonName: string = req.params.pokemonName;

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: id,
    });

    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    //------------------------------------

    //finding pokemon from url
    const userPokemons = user?.yourPokemon;
    const findPokemon = userPokemons?.find((p) => p.name === pokemonName);

    // findPokemon?.name = req.body.nickname;

    //looking evolution
    let pokeResponse = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    const speciesUrl: string = (await pokeResponse).data.species.url;

    let pokemonSpeciesUrl = axios.get(speciesUrl);
    const evolutionChainUrl: string = (await pokemonSpeciesUrl).data
      .evolution_chain.url;

    let pokemonEvolutionChainUrl = axios.get(evolutionChainUrl);
    const evolutionChain = (await pokemonEvolutionChainUrl).data.chain;

    const pokemonInfos: PokemonInfo[] = [];

    const parseEvolutionChain = async (evolution: PokemonEvolution) => {
      const name = evolution.species.name;
      const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        evolution.species.url.split("/")[6]
      }.png`;

      pokemonInfos.push({ name, img });

      evolution.evolves_to.forEach((evolution) => {
        parseEvolutionChain(evolution);
      });
    };

    parseEvolutionChain(evolutionChain);

    const stats = (await pokeResponse).data.stats;
    let hp = stats.find((stat: any) => stat.stat.name == "hp").base_stat;
    let attack = stats.find(
      (stat: any) => stat.stat.name == "attack"
    ).base_stat;
    let defense = stats.find(
      (stat: any) => stat.stat.name == "defense"
    ).base_stat;
    let specialAttack = stats.find(
      (stat: any) => stat.stat.name == "special-attack"
    ).base_stat;
    let specialDefense = stats.find(
      (stat: any) => stat.stat.name == "special-defense"
    ).base_stat;
    let speed = stats.find((stat: any) => stat.stat.name == "speed").base_stat;

    // ----------------------------------------------------

    if (findPokemon != undefined) {
      findPokemon.nickName = req.body.nickname;
    }

    await peopleProfileCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: user,
      }
    );

    res.render("huidigePokemon", {
      user: user,
      name: findPokemon?.name,
      id: (await pokeResponse).data.id,
      img: (await pokeResponse).data.sprites.front_default,
      nickName: findPokemon?.nickName,
      wins: findPokemon?.wins,
      loss: findPokemon?.loss,
      caught: findPokemon?.caught,
      pokemonInfos: pokemonInfos,
      hp: hp,
      attack: attack,
      defense: defense,
      specialAttack: specialAttack,
      specialDefense: specialDefense,
      speed: speed,
      currentPokemonImg: currentPokemonImg,
    });

    // res.render("huidigePokemon");

    res.render("");
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
});

// catch page: get
app.get("/user/:id/catch", async (req: any, res: any) => {
  try {
    await client.connect();
    console.log("connected to database");

    let id: number = req.params.id;

    let pokemon = await getRandomPokemon();
    let PokemonCaught = await isPokemonCaught(pokemon.name,id);

    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });
    

    
    let currentPokemon = user?.currentPokemon;

    let pokeResponseImg = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${currentPokemon}`
    );

    let currentPokemonImg = (await pokeResponseImg).data.sprites.front_default;

    //------------------------------------

    res.render("catch",{ user: user, pokemon, PokemonCaught, currentPokemonImg: currentPokemonImg});
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// whoIsThatPokemon - whoIsThatPokemon page
// app.get("/user/:id/whoIsThatPokemon", async (req: any, res: any) => {
//   try {
//     await client.connect();
//     console.log("connected to database");

//     let id: number = req.params.id;

//     let peopleProfileCollection = client
//       .db("Elite5Pokemon")
//       .collection("PeopleProfiles");
//     let user = await peopleProfileCollection.findOne<PeopleProfile>({
//       _id: new ObjectId(id),
//     });

//     res.render("whoIsThatPokemon", { user: user });
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// });

// listen to localhost
app.listen(app.get("port"), async () => {
  console.log(`Web application started at http://localhost:${app.get("port")}`);
  // await readAccounts();
  console.log("Account read!");
});

