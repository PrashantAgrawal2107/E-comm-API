import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";


const LikeModel = mongoose.model('Like' , likeSchema);

export class LikeRepository{

    async getLikes(type ,id){
        try{
            return await LikeModel.find({
                on_model : type,
                likeable : new ObjectId(id)
            }).populate('user').populate({path : 'likeable', model:type});
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async likeProduct(userId , productId){
        try{
            const like = new LikeModel({
                user : new ObjectId(userId),
                likeable : new ObjectId(productId),
                on_model : 'Product' 
            });
            await like.save();

        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async likeCategory(userId,categoryId){
        try{
            const like = new LikeModel({
                user : new ObjectId(userId),
                likeable : new ObjectId(categoryId),
                on_model : 'Category'
            });
            await like.save();
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }
}