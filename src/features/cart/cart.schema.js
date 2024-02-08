import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
    productID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    quantity : Number

});