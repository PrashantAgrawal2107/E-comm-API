import CartModel from "./cart.model.js";

export class CartController{
    add(req,res){
        const {productID , quantity} = req.query;
        const userID = req.userID;
        CartModel.addItem(productID,userID,quantity);
        res.status(201).send("Cart is updated");
    }

    get(req,res){
        const items = CartModel.get(req.userID);
        return res.status(200).send(items);
    }

    delete(req,res){
        const userID = req.userID;
        const cartItemID = req.params.id;
        const error = CartModel.delete(cartItemID,userID);
        if(error){
            return res.status(404).send(error);
        }
        return res.status(200).send('Cart Item is removed');
    }
}