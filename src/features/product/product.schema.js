import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name : String,
    desc : String,
    price : Number,
    category : String,
    inStock : Number,
    reviews : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    categories : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Category'
        }
    ]

});