import express from "express";
import ejs from "ejs";
import fs from "fs/promises";
import { MongoClient, ObjectId } from "mongodb";
// const pokemonName = require("./public/js/fromPokedex.js");
// import pokemonName from "./public/js/fromPokedex.js";

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

let peopleProfiles: PeopleProfile[] = [
  {
    firstname: "shreejan1",
    lastname: "joshi1",
    email: "shreejan1212@gmail.com",
    password: "password",
    yourPokemon: ["pikachu", "charmander"],
    currentPokemon: "pikachu",
  },
  {
    firstname: "shreejan2",
    lastname: "joshi2",
    email: "shreejan1212@gmail.com",
    password: "password",
    yourPokemon: ["pikachu"],
    currentPokemon: "pikachu",
  },
];

// index - home page
app.get("/", (req: any, res: any) => {
  res.render("index");
});

// projects - landing page
app.get("/projects", (req: any, res: any) => {
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

// signUp - signup page
app.get("/signUp", (req: any, res: any) => {
  res.render("signUp");
});

// signUp - signup page
app.post("/signUp", async (req: any, res: any) => {
  accounts.push({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });

  await writeAccounts();

  res.render("accountMade", {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });
});

interface Account {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

let accounts: Account[] = [];

const readAccounts = async () => {
  const data = JSON.parse(await fs.readFile("./accounts.json", "utf-8"));

  accounts = data;
};

const writeAccounts = async () => {
  await fs.writeFile("./accounts.json", JSON.stringify(accounts));
};

// pokemonComparison - vergelijken
app.get("/pokemonComparison", (req: any, res: any) => {
  res.render("vergelijken");
});

// pokedex - pokedex page
app.get("/pokedex", (req: any, res: any) => {
  res.render("pokedex");
});

// currentPokemon - pokedex page
app.get("/currentPokemon", (req: any, res: any) => {
  res.render("huidigePokemon");
});

// catch - catch page
app.get("/catch", (req: any, res: any) => {
  res.render("catch");
});

// whoIsThatPokemon - whoIsThatPokemon page
app.get("/whoIsThatPokemon", (req: any, res: any) => {
  res.render("whoIsThatPokemon");
});

app.listen(app.get("port"), async () => {
  console.log(`Web application started at http://localhost:${app.get("port")}`);
  await readAccounts();
  console.log("Account read!");
});