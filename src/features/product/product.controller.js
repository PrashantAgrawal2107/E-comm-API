import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{

    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req,res){
        try{
            const products = await this.productRepository.getAll();
            return res.status(200).send(products);
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(503).send("Something went wrong");
        }
    }

    async addProduct(req, res){
        try{
            console.log(req.body);
            const {name, price,desc, sizes ,categories} = req.body;
            const newProduct = new ProductModel(
                name,desc,parseFloat(price),req.file.filename,categories, sizes.split(',')
            );
            const createdRecord= await this.productRepository.add(newProduct);
           return res.status(201).send(createdRecord);   
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(500).send("Something went wrong");
        }
    }

     async rateProduct(req,res,next){
        try{
            const userID = req.userID;
            const productID = req.body.productID;
            const rating = req.body.rating;
            this.productRepository.rate(userID,productID,rating);
            return res.status(200).send('Rating has been updated');
        }catch(err){
            console.log(err);
            next(err);
            // return res.status(400).send(err.message);
        }
    }

    async getOneProduct(req,res){
        // console.log('control in getOneProduct') // Applied check becoz of filterproducts route error 
        try{
            const id = req.params.id;
            const product =await this.productRepository.get(id);
            if(!product){
                res.status(404).send('Product not found');
            } else{
                return res.status(200).send(product);
            }
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(400).send("Something went wrong");
        }
    }

    async filterProducts(req, res) {
        // console.log('Control in filterproducts') // Applied check becoz of filterproducts route error 
        try{
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const categories = req.query.categories; // Array of multiple category.
            const result = await this.productRepository.filter(
                minPrice,
                maxPrice,
                categories
            );
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            return res.status(503).send("Something went wrong");
        }
        
    }

    async averagePrice(req, res){
        try{
          const result =await this.productRepository.averageProductPricePerCategory();
          res.status(200).send(result);
        }catch(err){
        console.log(err);
        errorHandlerMiddleware(err);
        return res.status(503).send("Something went wrong");
      }
    }
}