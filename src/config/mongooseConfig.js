import mongoose from "mongoose";
import { errorHandlerMiddleware } from "../error-handler/errorHandler.js";
import { categorySchema } from "../features/product/category.schema.js";

export const connectUsingMongoose = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB using Mongoose')
        addCategories();
    }catch(err){
        console.log("Error while connected to db");
        errorHandlerMiddleware(err);
    }
}

// Function to add some categories in the database at starting of application-->>
async function addCategories(){
    const CategoryModel = mongoose.model('Category' , categorySchema);
    const categories = await CategoryModel.find();
    if(!categories || categories.length==0){
        await CategoryModel.insertMany([{name : 'Electronics'} ,{name : 'Clothing'},{name : 'Books'}]);
        console.log('Categories Added');
    }
}