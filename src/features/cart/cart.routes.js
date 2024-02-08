// 1. Import express.
import express from 'express';
import { CartController } from './cart.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();
const cartController = new CartController();

// All the paths to the controller methods.
// localhost/api/cart
cartRouter.post('/',(req,res)=>{
    cartController.add(req,res)
});
cartRouter.get('/',(req,res)=>{
    cartController.get(req,res)
});
cartRouter.delete('/:id',(req,res)=>{
    cartController.delete(req,res)
});

export default cartRouter;