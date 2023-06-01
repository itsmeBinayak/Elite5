import express, { response } from "express";
import ejs from "ejs";
import fs from "fs/promises";
import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";
import { getRandomPokemon, getPokemon} from "./RandompokeAPI";
import { isPokemonCaught } from "./isPokemonCaught";
import {addPokemon, deletePokemon} from "./Addpokemon"
import {
  pokemonApi,
  userPokemonsData,
  pokemonStats,
  thisPokemon,
  evolutionApi,
} from "./pokemon";
import {
  Pokemon,
  PeopleProfile,
  PokedexPokemon,
  PokemonSpecies,
  PokemonEvolution,
  EvolutionChain,
  PokemonInfo,
} from "./types";
import { get } from "http";
import { count } from "console";

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

// landing page: get
app.get("/", (req: any, res: any) => {
  // render
  res.render("landingPage");
});

// projects Error page: get
app.get("/projectsError", (req: any, res: any) => {
  // render
  res.render("projectsError");
});

// login page: get
app.get("/login", (req: any, res: any) => {
  // render
  res.render("login", {
    message: "",
  });
});

// login page: post
app.post("/login", async (req: any, res: any) => {
  try {
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user email and password from form
    let email = req.body.email;
    let password = req.body.password;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let loginUser = await peopleProfileCollection.findOne<PeopleProfile>({
      email: email,
    });

    // check password
    if (password == loginUser?.password) {
      res.redirect(`/user/${loginUser?._id}`);
    } else {
      // res.redirect(`/login`);
      // render login page with error messahe
      res.render("login", {
        message: "Wrong email or password",
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// signUp page: get
app.get("/signUp", (req: any, res: any) => {
  // render
  res.render("signUp");
});

// signUp page: post
app.post("/signUp", async (req: any, res: any) => {
  try {
    // connect to database
    await client.connect();
    console.log("connected to database");

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // create user in database
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

    // render created account page message
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id from url
    let id: number = req.params.id;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    //stats
    let stats = currPokemonResponse.data.stats;
    let hp = await pokemonStats(stats, "hp");
    let attack = await pokemonStats(stats, "attack");
    let defense = await pokemonStats(stats, "defense");
    let specialAttack = await pokemonStats(stats, "special-attack");
    let specialDefense = await pokemonStats(stats, "special-defense");
    let speed = await pokemonStats(stats, "speed");

    // render home page
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id from url
    let id: number = req.params.id;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    // render pokemon comparison page
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id from url
    let id: number = req.params.id;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;
    let userPokemons = user?.yourPokemon!;

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    // your pokemons data
    let pokemonsData = await userPokemonsData(userPokemons);

    // render pokedex page
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id from url
    let id = new ObjectId(req.params.id);

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: id,
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;
    let userPokemons = user?.yourPokemon!;

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    // your pokemons data
    let pokemonsData = await userPokemonsData(userPokemons);

    // change current pokemon value
    if (user != undefined) {
      user.currentPokemon = req.body.currentPokemonName;
    }

    // update database
    await peopleProfileCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: user,
      }
    );

    // render pokedex page
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id and pokemon name from url
    let id: number = req.params.id;
    let pokemonName: string = req.params.pokemonName;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;
    let userPokemons = user?.yourPokemon!;

    // find pokemon from users your pokemon given by url
    let findPokemon = thisPokemon(userPokemons, pokemonName);

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);
    let pokeResponse = await pokemonApi(pokemonName);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    //looking evolution
    let pokemonInfos = await evolutionApi(pokeResponse);

    //stats
    let stats = pokeResponse.data.stats;
    let hp = await pokemonStats(stats, "hp");
    let attack = await pokemonStats(stats, "attack");
    let defense = await pokemonStats(stats, "defense");
    let specialAttack = await pokemonStats(stats, "special-attack");
    let specialDefense = await pokemonStats(stats, "special-defense");
    let speed = await pokemonStats(stats, "speed");

    // render currentPokemon page
    res.render("huidigePokemon", {
      user: user,
      name: findPokemon?.name,
      id: pokeResponse.data.id,
      img: pokeResponse.data.sprites.front_default,
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
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id and pokemon name from url
    let id = new ObjectId(req.params.id);
    let pokemonName: string = req.params.pokemonName;

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: id,
    });

    // pokemon from database
    let currentPokemon = user?.currentPokemon!;
    let userPokemons = user?.yourPokemon!;

    // find pokemon from users your pokemon given by url
    let findPokemon = thisPokemon(userPokemons, pokemonName);

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);
    let pokeResponse = await pokemonApi(pokemonName);

    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    //looking evolution
    let pokemonInfos = await evolutionApi(pokeResponse);

    //stats
    let stats = pokeResponse.data.stats;
    let hp = await pokemonStats(stats, "hp");
    let attack = await pokemonStats(stats, "attack");
    let defense = await pokemonStats(stats, "defense");
    let specialAttack = await pokemonStats(stats, "special-attack");
    let specialDefense = await pokemonStats(stats, "special-defense");
    let speed = await pokemonStats(stats, "speed");

    // change pokemon nickname, wins and loss
    if (findPokemon != undefined) {
      findPokemon.nickName = req.body.nickname;
      findPokemon.wins = req.body.wins;
      findPokemon.loss = req.body.loss;
    }

    // update database
    await peopleProfileCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: user,
      }
    );

    // render currentPokemon page
    res.render("huidigePokemon", {
      user: user,
      name: findPokemon?.name,
      id: pokeResponse.data.id,
      img: pokeResponse.data.sprites.front_default,
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
    client.close();
  }
});

// catch page: get
app.get("/user/:id/catch", async (req: any, res: any) => {
  try {
    // connect to database
    await client.connect();
    console.log("connected to database");

    // user id from url
    let id: number = req.params.id;

    let rpokemon = await getRandomPokemon();
    let PokemonCaught = await isPokemonCaught(rpokemon.name, id);


    

    // database collection
    let peopleProfileCollection = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles");

    // find user
    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });
   
    // pokemon from database
    let currentPokemon = user?.currentPokemon!;

    // api call
    let currPokemonResponse = await pokemonApi(currentPokemon);

    let currentPokemonName = currPokemonResponse.data.name ;
    // current pokemon img
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;
    //current pokemon stats
    let stats = currPokemonResponse.data.stats;
    //current pokemon attack
    let attack = await pokemonStats(stats, "attack");

    let count:number = 3
    
    
    // render catch page
    res.render("catch", {
      user: user,
      rpokemon,
      PokemonCaught,
      currentPokemonImg: currentPokemonImg,
      currentPokemonName: currentPokemonName,
      count,
      attack
      
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

app.post("/user/:id/addPokemon", async (req, res) => {
  try {
    await client.connect();
    
    let id = req.params.id;
    let ID = parseInt(id)
    const randomPokemon = req.body.randomPokemon; 
    

    let peopleProfileCollection = client
    .db("Elite5Pokemon")
    .collection("PeopleProfiles");

    let user = await peopleProfileCollection.findOne<PeopleProfile>({
      _id: new ObjectId(id),
    });
    // Add the caught Pokémon to the user's profile
    
    //current pokemon
    let currentPokemon = user?.currentPokemon!;
    let currPokemonResponse = await pokemonApi(currentPokemon);
    let stats = currPokemonResponse.data.stats;
    let attack = await pokemonStats(stats, "attack");
    //random pokemon
    let randomPoke = await getPokemon(randomPokemon);
    let defence = randomPoke.defense
    
    //catch function
    let Catch = catchPokemon(attack,defence)

    
    let currentPokemonName = currPokemonResponse.data.name ;
    let currentPokemonImg = currPokemonResponse.data.sprites.front_default;

    let PokemonCaught = await isPokemonCaught(randomPokemon.name, ID);
    
    let count: number = parseInt(req.body.count); // Get the remaining attempts count from the form submission

    if (count > 0) {
      if (Catch) {
        addPokemon(randomPokemon, new ObjectId(id));
        PokemonCaught = true;
      }
      count--; 
    }
    

    console.log(count)
    console.log(Catch)
    console.log(defence)
    console.log(attack)
    await peopleProfileCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: user,
      }
    );
    res.render("catch", {
      user: user,
      rpokemon: randomPoke,
      PokemonCaught,
      currentPokemonImg: currentPokemonImg,
      currentPokemonName: currentPokemonName,
      count: count,
      attack,
    });

  
    
    
  } catch (e) {
    console.error(e);
    res.status(500).send("Error adding Pokémon to user's profile.");
  }
  finally {
  await client.close();
  }
});

app.post("/user/:id/deletePokemon", async (req, res) => {
  try {
    await client.connect();
    let id = new ObjectId(req.params.id);
    const pokemonName = req.body.randomPokemon; 
    // Delete the Pokémon from the user's profile
    await deletePokemon(pokemonName, id);

    res.redirect(`/user/${id}/catch`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error deleting Pokémon from user's profile.");
  }
  finally {
    await client.close();
    }
});

// listen to localhost
app.listen(app.get("port"), async () => {
  console.log(`Web application started at http://localhost:${app.get("port")}`);
  console.log("Account read!");
});


function catchPokemon(attack:number, defence:number): boolean {
  
    const catchRate = (100 - defence + attack);
    const randomNum =Math.floor(Math.random() * 101);
    console.log(randomNum)
    if (randomNum <= catchRate) {
      return true;
    }
  return false;
}