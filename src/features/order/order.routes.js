// 1. Import express.
import express from 'express';
import OrderController from './order.controller.js';

// 2. Initialize Express router.
const orderRouter = express.Router();
const orderController = new OrderController();

// All the paths to the controller methods.
// localhost/api/orders
orderRouter.post('/',(req,res)=>{
    orderController.placeOrder(req,res)
});

export default orderRouter;