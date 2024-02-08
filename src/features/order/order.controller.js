import OrderRepository from "./order.repository.js";

export default class OrderController{

    constructor(){
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req,res){
        try{
            const userId = req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("Order is created");
        }catch(err){
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }
}