// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';
import {upload} from '../../middlewares/fileupload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const productRouter = express.Router();
const productController = new ProductController();

// All the paths to the controller methods.
// localhost/api/products 
productRouter.get('/', (req,res)=>{
    productController.getAllProducts(req,res);
});
productRouter.post('/',jwtAuth ,upload.single('imageUrl'), (req,res)=>{
    productController.addProduct(req,res);
});
productRouter.get("/averagePrice", (req, res)=>{
    productController.averagePrice(req, res)
});
productRouter.get('/:id', (req,res)=>{
    productController.getOneProduct(req,res);
});
productRouter.post('/rate',jwtAuth,(req,res,next)=>{
    productController.rateProduct(req,res,next);
});


// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1
// productRouter.get('/filter' , (req,res)=>{
//     productController.filterProducts(req,res);
// })    
// I am getting BSON error and is directing to getOneProduct function instead of filterProduct upon executing above route , 
// I don't know why this is happening but for now I have implemented this route insise server.js file and it is working fine.

export default productRouter;