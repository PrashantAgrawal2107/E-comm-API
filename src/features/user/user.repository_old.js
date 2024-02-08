import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";

export default class UserRepository{

     async SignUp(newUser){
        try{
           //  1. Get the database
           const db = getDB();
           //  2. Get the collection
               const collection = db.collection("users"); 
           //  3. Insert the document
               await collection.insertOne(newUser);
               return newUser;
        }catch(err){
          // console.log(err);
          errorHandlerMiddleware(err);
          throw new ApplicationError("Something went wrong with database" , 503);
        }
      }

      async SignIn(email,password){
        try{
           //  1. Get the database
                const db = getDB();
           //  2. Get the collection
               const collection = db.collection("users"); 
           //  3. Find the document
               return await collection.findOne({email,password});
        }catch(err){
          // console.log(err);
          errorHandlerMiddleware(err);
          throw new ApplicationError("Something went wrong with database" , 503);
        }
      }

      async findByEmail(email){
        try{
           //  1. Get the database
                const db = getDB();
           //  2. Get the collection
               const collection = db.collection("users"); 
           //  3. Find the document
               return await collection.findOne({email});
        }catch(err){
          // console.log(err);
          errorHandlerMiddleware(err);
          throw new ApplicationError("Something went wrong with database" , 503);
        }
      }
      
}