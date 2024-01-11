import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken'

export default class UserController{

    signUp(req,res){
        const {name , email , password , type} = req.body;
        const newUser = UserModel.SignUp(name,email,password,type);
        res.status(201).send(newUser);
    }
    signIn(req,res){
        const {email,password} = req.body;
        const user = UserModel.SignIn(email,password);
        if(!user){
            res.status(400).send("Incorrect Credentials")
        }
        else{
            // 1. Create Token
            const token = jwt.sign(
                {
                    // Payload (Should not contain sensitve info like pwd) -->>
                    userID : user.id,
                    email : user.email
                },
                // Secret Key-->>
                'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
                {
                    // Options-->>
                    expiresIn: '1h',
                }
            )

            // 2. Send Token
            res.status(200).send(token);

            // res.status(201).send("Login Successful");
        }
    }
}