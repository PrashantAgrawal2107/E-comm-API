// 1. Import express
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json' assert {type : 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
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

// for all requests related to product, redirect to product routes.
// localhost:3200/api/products
// server.use("/api/products",basicAuthorizer ,productRouter);
server.use("/api/products",jwtAuth ,productRouter);

// for all requests related to user, redirect to user routes.
// localhost:3200/api/users
server.use("/api/users", userRouter);

// for all requests related to cart, redirect to cart routes.
// localhost:3200/api/cart
server.use("/api/cart",jwtAuth ,loggerMiddleware ,cartRouter);

// 3. Default request handler
server.get('/', (req, res)=>{
    res.send("Welcome to Ecommerce APIs");
});

// Error Handler Middleware -->>  Placed at the end of other Middlewares -->>
server.use((err,req,res,next)=>{
    console.log(err);
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    // Server Errors -->>
    res.status(500).send('Something went wrong. Please try later.');

})

// 4. Middleware to handle 404 requests (Resource not Found)
server.use((req,res)=>{
    res.status(404).send("API not Found. Please check our documentation for more information at localhost:3200/api-docs");
})

// 5. Specify port.
server.listen(3200,()=>{
    console.log("Server is running at 3200");
});

 