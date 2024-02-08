import { LikeRepository } from "./like.repository.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";

export default class LikeController{
    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async getLikes(req,res){
        try{
            const {id,type} = req.query;
            const likes = await this.likeRepository.getLikes(type,id);
            return res.status(200).send(likes);
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(503).send("Something went wrong");
        }
    }

    async likeItem(req,res){
        try{
            const {id , type} = req.body;
            const userID = req.userID;
            if(type!='Product' && type!='Category'){
                return res.status(400).send("Invalid");
            }
            if(type=='Product'){
                await this.likeRepository.likeProduct(userID,id);
            } 
            if(type=='Category'){
                await this.likeRepository.likeCategory(userID,id);
            }
            return res.status(201).send();
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(503).send("Something went wrong");
        }
    }

}