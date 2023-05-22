  import { MongoClient, ObjectId } from "mongodb";

  const uri: string =
    "mongodb+srv://elite5:elite5password@mycluster.z2rzywu.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  interface Pokemon {
      name: string;
      nickname: string;
      wins: number;
      loss: number;
      caugth: Date;
    }
    
    interface PeopleProfile {
      _id: ObjectId;
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      yourPokemon: Pokemon[];
      currentPokemon: string;
    }

  export async function isPokemonCaught(pokemonName: string,id:number): Promise<boolean> {
      let peopleProfileCollection = client
        .db("Elite5Pokemon")
        .collection("PeopleProfiles");
        const user = await peopleProfileCollection.findOne<PeopleProfile>({
          _id: new ObjectId(id),
        });

        const foundPokemon = user?.yourPokemon.find((pokemon) => pokemon.name === pokemonName);
        if (foundPokemon) {
          return true
        }else{
          return false
        }
    }


    



    
