import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken'
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";

export default class UserController{

    constructor(){
        this.userRepository = new UserRepository();
    }

    async resetPassword(req,res){
        const {newPassword} = req.body;
        const hashedPassword = await bcrypt.hash(newPassword,12);
        const userID = req.userID;
        try{
            await this.userRepository.resetPassword(userID, hashedPassword)
            res.status(200).send("Password is updated");
          }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(400).send("Something went wrong");
          }
    } 

   async signUp(req,res,next){
        // console.log(req.body);
        const {name , email , password , type} = req.body;
        // const newUser = await UserModel.SignUp(name,email,password,type);
        const hashedPassword = await bcrypt.hash(password,12) // 12 represents degree of hashing
        const newUser = new UserModel(name,email,hashedPassword,type);
        try{
            await this.userRepository.SignUp(newUser);
            return  res.status(201).send(newUser);
        }catch(err){
            // console.log(err);
            errorHandlerMiddleware(err);
            next(err);
            // return res.status(400).send("Something went wrong");
        }
        
    }
    async signIn(req,res){
        try{
            const {email,password} = req.body;
            const user = await this.userRepository.findByEmail(email);
            if(!user){
                return res.status(400).send("Incorrect Credentials")
            }else{
                //  Compare user password with Hashed password -->>
                const result = await bcrypt.compare(password,user.password);
                if(result){
                    // 1. Create Token
                 const token = jwt.sign(
                    {
                        // Payload (Should not contain sensitve info like pwd) -->>
                        userID : user._id,
                        email : user.email
                    },
                    // Secret Key-->>
                    process.env.JWT_SECRET,
                    {
                        // Options-->>
                        expiresIn: '1h',
                    }
                )
    
                // 2. Send Token
                res.status(200).send(token);
    
                // res.status(201).send("Login Successful");
                }
                else{
                    res.status(400).send("Incorrect Credentials")
                }
            }
           
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(200).send("Something went wrong");
        }
    }
}