import express from "express";
import ejs from "ejs";
import fs from "fs/promises";
import { MongoClient, ObjectId } from "mongodb";
import { getRandomPokemon } from "./RandompokeAPI";
import { isPokemonCaught } from "./isPokemonCaught";
// const pokemonName = require("./public/js/fromPokedex.js");
// import pokemonName from "./public/js/fromPokedex.js";

const uri: string =
  "mongodb+srv://elite5:elite5password@mycluster.z2rzywu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const app = express();




app.set("port", 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

interface PeopleProfile {
  _id?: ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  yourPokemon: string[];
  currentPokemon: string;
}

// projects - landing page
app.get("/", (req: any, res: any) => {
  res.render("landingPage");
});

// projectsError - projects Error page
app.get("/projectsError", (req: any, res: any) => {
  res.render("projectsError");
});

// login - login page
app.get("/login", (req: any, res: any) => {
  res.render("login");
});

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

    // res.render("login", {
    //   login: loginUser,
    //   // email: loginUser?.email,
    //   // password: loginUser?.password,
    //   typedEmail: email,
    //   typedPassword: password,
    // });

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

// signUp - signup page
app.get("/signUp", (req: any, res: any) => {
  res.render("signUp");
});

app.post("/signUp", async (req: any, res: any) => {
  // accounts.push({
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  //   email: req.body.email,
  //   password: req.body.password,
  // });

  // await writeAccounts();

  // res.render("accountMade", {
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  //   email: req.body.email,
  //   password: req.body.password,
  // });
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
      yourPokemon: ["pikachu"],
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

// index - home page
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

    // if (!user) {
    //   res.render("error");
    //   return;
    // }

    res.render("index", { user: user });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// interface Account {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password: string;
// }

// let accounts: Account[] = [];

// const readAccounts = async () => {
//   const data = JSON.parse(await fs.readFile("./accounts.json", "utf-8"));

//   accounts = data;
// };

// const writeAccounts = async () => {
//   await fs.writeFile("./accounts.json", JSON.stringify(accounts));
// };

// pokemonComparison - vergelijken
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

    res.render("vergelijken", { user: user });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// pokedex - pokedex page
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

    res.render("pokedex", { user: user });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// currentPokemon - pokedex page
app.get("/user/:id/currentPokemon", async (req: any, res: any) => {
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

    res.render("huidigePokemon", { user: user });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// catch - catch page
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
    

    res.render("catch",{ user: user, pokemon, PokemonCaught });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

// whoIsThatPokemon - whoIsThatPokemon page
app.get("/user/:id/whoIsThatPokemon", async (req: any, res: any) => {
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

    res.render("whoIsThatPokemon", { user: user });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
});

app.listen(app.get("port"), async () => {
  console.log(`Web application started at http://localhost:${app.get("port")}`);
  // await readAccounts();
  console.log("Account read!");
});

