import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model('Product' , productSchema);
const ReviewModel = mongoose.model('Review' , reviewSchema);
const CategoryModel = mongoose.model('Category' , categorySchema);


export default class ProductRepository{

    constructor(){
        this.collection = "products";
    }

    async add(productData){
        try{
            // 1. Adding Product-->>
            productData.categories=productData.category.split(',');
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save(); 

            // 2. Updating the category of the product-->>
            await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {$push: {products: new ObjectId(savedProduct._id)}}
            )

            // MongoDB Code -->>
            // const db = getDB();
            // const collection = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;
        }catch(err){
            // console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async get(id){
        // console.log("Get executed"); // Applied check becoz of filterproducts route error 
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async filter(minPrice,maxPrice,categories){
        // console.log('i m in filter'); // Applied check becoz of filterproducts route error 
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)};
            }
            if(maxPrice){
                filterExpression.price = {...filterExpression.price , $lte: parseFloat(maxPrice)};
            }
             // ['Cat1', 'Cat2'] // Changing category string to array-->>
             categories = JSON.parse(categories.replace(/'/g, '"'));
             console.log(categories);
             
             if(categories){
                 filterExpression={$and:[{category:{$in:categories}} , filterExpression]}
                 // filterExpression.category=category
             }
             return collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:-1}}).toArray();
            // return await collection.find(filterExpression).toArray();
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }
    }

    //  async rate(userID,productID,rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // 1. Find the product-->>
    //         const product = await collection.findOne({_id: new ObjectId(productID)});
    //         // 2. Find the ratings of the user-->>
    //         const userRating = product?.ratings?.find(i=>i.userID==userID);
    //         // 3. Update the rating-->>
    //         if(userRating){
    //             await collection.updateOne(
    //                 {_id: new ObjectId(productID) , "ratings.userID": new ObjectId(userID)} , {$set : {"ratings.$.rating":rating}}
    //             );
    //         }else{
    //             await collection.updateOne(
    //                 {_id: new ObjectId(productID)} , {$push : {ratings :{ userID : new ObjectId(userID) , rating}}}
    //             );
    //         }
    //     }catch(err){
    //         console.log(err);
    //         errorHandlerMiddleware(err);
    //         throw new ApplicationError("Something went wrong with Database",500);
    //     }
    // }
       
    async rate(userID,productID,rating){
        try{

            // 1. Check if product exists -->>
            const productToRate = await ProductModel.findById(productID);
            if(!productToRate){
                throw new Error("Product not Found");
            }

            // 2. Find the existing review-->>
            const userReview = await ReviewModel.findOne({product : new ObjectId(productID) , user : new ObjectId(userID)}) 
            // If user review is already there , update the rating-->>
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }
            else{  // If no review exists , create new review using ReviewModel and save it-->>
                const newReview = new ReviewModel({
                    product : new ObjectId(productID),
                    user : new ObjectId(userID),
                    rating : rating
                })
                await newReview.save();
            }

            // const db = getDB();
            // const collection = db.collection(this.collection);
            // // 1. Remove existing rating-->>
            // await collection.updateOne(
            //     {_id: new ObjectId(productID)} , {$pull : {ratings :{ userID : new ObjectId(userID)}}}
            // );
            // // 2. Add new entry-->>
            // await collection.updateOne(
            //     {_id: new ObjectId(productID)} , {$push : {ratings :{ userID : new ObjectId(userID) , rating}}}
            // );

        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }
    }

    async averageProductPricePerCategory(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.aggregate([
                // Get Average price per category-->>
                {
                    $group : {
                        _id : "$category",
                        averagePrice : {$avg : "$price"}
                    }
                },
                // Sorted in descending order-->>
                {
                    $sort : {averagePrice : -1}
                }
            ]).toArray();
        }catch(err){
            console.log(err);
            errorHandlerMiddleware(err);
            throw new ApplicationError("Something went wrong with Database",500);
        }
    }

}
