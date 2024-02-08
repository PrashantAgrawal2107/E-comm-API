import './env.js';
// 1. Import express
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';
import bodyParser from 'body-parser';

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
import likeRouter from './src/features/like/like.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json' assert {type : 'json'};
import {loggerMiddleware} from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import ProductController from './src/features/product/product.controller.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import mongoose from 'mongoose';

// 2. Create Server
const server = express();

// CORS Policy Cofiguration
var corsOptions = {
    origin : 'http://localhost:5500',
    // allowedHeaders : ['Authorization' , 'Content-Type']
}

server.use(cors(corsOptions));

// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin' , 'http://localhost:5500')
//     // res.header('Access-Control-Allow-Origin' , '*') // If u want to give access to all type of clients
//     res.header('Access-Control-Allow-Headers' , '*'); // To allow all the headers
//     res.header('Access-Control-Allow-Methods' , '*'); // To allow client to access all the methods
//     // Return OKnfor preflight request.
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

server.use(express.json());
server.use("/api-docs", swagger.serve , swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use(express.urlencoded({extended:false}))
server.use(bodyParser.urlencoded({extended:false}))

// Here, I am creating filterProducts route directly , it was giving some errors while placing in product.routes.js
const productController = new ProductController();
server.use("/api/products/filter" , (req,res)=>{
    productController.filterProducts(req,res);
})

// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
// server.use("/api/products",basicAuthorizer ,productRouter);
server.use("/api/products", productRouter);

// for all requests related to user, redirect to user routes.
// localhost:3200/api/users
server.use("/api/users", userRouter);

// for all requests related to cart, redirect to cart routes.
// localhost:3200/api/cart
server.use("/api/cart",jwtAuth ,loggerMiddleware ,cartRouter);

// for all requests related to orders, redirect to orders routes.
// localhost:3200/api/orders
server.use("/api/orders",jwtAuth,orderRouter);

// for all requests related to likes, redirect to likes routes.
// localhost:3200/api/likes
server.use("/api/likes",jwtAuth,likeRouter);

// 3. Default request handler
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});

// Error Handler Middleware -->>  Placed at the end of other Middlewares -->>
server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
       return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
       return res.status(err.code).send(err.message);
    }
    // Server Errors -->>
    return res.status(500).send('Something went wrong. Please try later.');

})

// 4. Middleware to handle 404 requests (Resource not Found)
server.use((req,res)=>{
    res.status(404).send("API not Found. Please check our documentation for more information at localhost:3200/api-docs");
})

// 5. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
    // connectToMongoDB();
    connectUsingMongoose();
});

 