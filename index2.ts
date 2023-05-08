import { MongoClient, ObjectId } from "mongodb";

const uri: string =
  "mongodb+srv://elite5:elite5password@mycluster.z2rzywu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

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
    email: "shreejanjoshi97@gmail.com",
    password: "password",
    yourPokemon: ["pikachu"],
    currentPokemon: "pikachu",
  },
];

const ShowAll = async () => {
  let pokemonCollection = client
    .db("Elite5Pokemon")
    .collection("PeopleProfiles");
  let peopleProfiles = await pokemonCollection
    .find<PeopleProfile>({})
    .toArray();
  console.table(peopleProfiles);
};

const DeleteAll = async () => {
  let pokemonCollection = client
    .db("Elite5Pokemon")
    .collection("PeopleProfiles");
  await pokemonCollection.deleteMany({});
};

const main = async () => {
  try {
    await client.connect();
    console.log("connect to database");

    // await DeleteAll();

    let peopleProfile = client
      .db("Elite5Pokemon")
      .collection("PeopleProfiles")
      .find<PeopleProfile>({})
      .toArray();

    if ((await peopleProfile).length == 0) {
      await client
        .db("Elite5Pokemon")
        .collection("PeopleProfiles")
        .insertMany(peopleProfiles);
    }

    await ShowAll();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

main();
