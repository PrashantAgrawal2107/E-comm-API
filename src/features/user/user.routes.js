import jwtAuth from '../../middlewares/jwt.middleware.js';
// Manage routes/paths to UserController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';

// 2. Initialize Express router.
const userRouter = express.Router();

const userController = new UserController();

// All the paths to controller methods.

userRouter.post('/signup', (req,res,next)=>{
    userController.signUp(req,res,next);
});
userRouter.post('/signin', (req,res)=>{
    userController.signIn(req,res);
});
userRouter.put('/resetPassword', jwtAuth, (req, res)=>{
    userController.resetPassword(req, res);
});
export default userRouter;