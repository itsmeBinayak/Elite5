    import { MongoClient, ObjectId } from "mongodb";

    interface Pokemon {
    name: string;
    nickname: string;
    wins: number;
    loss: number;
    caught: Date; 
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
        const uri =
          "mongodb+srv://elite5:elite5password@mycluster.z2rzywu.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri);

    export async function addPokemon(pokemonName: string, id: ObjectId, nickName?: string): Promise<void> {
        
      
        try {
          await client.connect();
          const peopleProfileCollection = client
            .db("Elite5Pokemon")
            .collection("PeopleProfiles");
          const user = await peopleProfileCollection.findOne<PeopleProfile>({
            _id: new ObjectId(id),
          });
      
        if(user){
            
            user.yourPokemon.push({
                name: pokemonName,
                nickname: nickName||"",
                wins: 0,
                loss: 0,
                caught: new Date(),
          });
      
          
          await peopleProfileCollection.updateOne(
            { _id: user._id },
            { $set: { yourPokemon: user.yourPokemon } }
          );

        }
        } catch (error) {
          console.error("Error adding Pokemon to user's profile:", error);
        } finally {
          await client.close();
        }
      }


      export async function deletePokemon(pokemonName: string, id: ObjectId): Promise<void> {
        try {
          await client.connect();
          const peopleProfileCollection = client
            .db("Elite5Pokemon")
            .collection("PeopleProfiles");
          const user = await peopleProfileCollection.findOne<PeopleProfile>({
            _id: new ObjectId(id),
          });
      
          if (user) {
            user.yourPokemon = user.yourPokemon.filter((pokemon) => pokemon.name !== pokemonName);
      
            await peopleProfileCollection.updateOne(
              { _id: user._id },
              { $set: { yourPokemon: user.yourPokemon } }
            );
          }
        } catch (error) {
          console.error("Error deleting Pokemon from user's profile:", error);
        } finally {
          await client.close();
        }
      }