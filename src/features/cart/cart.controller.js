import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export class CartController{

    constructor(){
        this.cartRepository  = new CartRepository();
    }

    async add(req,res){
        try{
            const {productID , quantity} = req.body;
            const userID = req.userID;
            const item = new CartModel(productID,userID,quantity);
            await this.cartRepository.addItem(item);
            res.status(201).send("Cart is updated");
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
        }
        
    }

    async get(req,res){
        try{
            const userID = req.userID;
            const items = await this.cartRepository.getCartItems(userID);
            return res.status(200).send(items);
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
        }
        
    }

    async delete(req,res){
        try{
            const userID = req.userID;
            const cartItemID = req.params.id;
            const isDeleted = await this.cartRepository.deleteCartItems(cartItemID,userID);
            if(!isDeleted){
                return res.status(404).send('Item not Found');
            }
            return res.status(200).send('Cart Item is removed');
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
        }
     
    }
}