import mongoose, { mongo } from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";

// Creating model from Schema -->>
const UserModel = mongoose.model('User' , userSchema);  // 'User' IS THE COLLECTION NAME.

export default class UserRepository{

  async resetPassword(userID, hashedPassword){
    try{
        let user = await UserModel.findById(userID);
        if(user){
            user.password=hashedPassword;
            user.save();
        }else{
            throw new Error("No such user found");
        }
        
    } catch(err){
        // console.log(err);
        errorHandlerMiddleware(err);
        throw new ApplicationError("Something went wrong with database", 503);
    }
}

    async SignUp(user){
        try{
          // create instance of UserModel-->>
          const newUser = new UserModel(user);
          await newUser.save();
          // return newUser; 
        }catch(err){
          if(err instanceof mongoose.Error.ValidationError){
            throw err;
          }else{
               console.log(err);
              errorHandlerMiddleware(err);
              throw new ApplicationError("Something went wrong with database" , 503);
          }
         
        }
      }

      async SignIn(email,password){
        try{
            return await UserModel.findOne({email,password});
        }catch(err){
          // console.log(err);
          errorHandlerMiddleware(err);
          throw new ApplicationError("Something went wrong with database" , 503);
        }
      }

      async findByEmail(email){
        try{
            return await UserModel.findOne({email});
        }catch(err){
          // console.log(err);
          errorHandlerMiddleware(err);
          throw new ApplicationError("Something went wrong with database" , 503);
        }
      }

}