// 1. Import express.
import express from 'express';
import { CartController } from './cart.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();
const cartController = new CartController();

// All the paths to the controller methods.
// localhost/api/cart
cartRouter.post('/',cartController.add);
cartRouter.get('/',cartController.get);
cartRouter.delete('/:id',cartController.delete);

export default cartRouter;