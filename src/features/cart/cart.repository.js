import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { errorHandlerMiddleware } from "../../error-handler/errorHandler.js";

export default class CartRepository{
    constructor(){
        this.collection = "cartItems";
    }

    async addItem(item){
        try{
            const db  = getDB();
            const collection = db.collection(this.collection);
            const {productID , userID , quantity} = item;
            const id  = await this.getNextCounter(db); // Getting the counter for cartItemId
            //  find the document, either insert or update , use upsert 
            // UPSERT - updates the document if find , else insert new documnet
            await collection.updateOne(
                {productID:new ObjectId(productID), userID:new ObjectId(userID)}, // Filter
                {   // Update or Insertion details--
                    $setOnInsert: {_id:id}, // It will be performed only when insertion takes place , not on deletion 
                    $inc:{ // Increment quantity attribute in db by amount 'quantity' we recieved from user
                    quantity: quantity
                }},
                {upsert: true}) // Options for updateOne -->> Using upsert

            // await collection.insertOne({productID : new ObjectId(productID),userID : new ObjectId(userID),quantity});
        }catch(err){
            //  console.log(err);
             errorHandlerMiddleware(err);
             throw new ApplicationError("Something went wrong with Database",503);
        }

    }

    async deleteCartItems(cartItemID , userID){
        try{
            const db  = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({_id : new ObjectId(cartItemID) , userID : new ObjectId(userID)});
        // Return true if no. of items deleted is more than 0-->>
            return result.deletedCount>0 ;
        }catch(err){
             // console.log(err);
             errorHandlerMiddleware(err);
             throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async getCartItems(userID){
        try{
            const db  = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({userID : new ObjectId(userID)}).toArray();
        }catch(err){
             // console.log(err);
             errorHandlerMiddleware(err);
             throw new ApplicationError("Something went wrong with Database",503);
        }
    }

    async getNextCounter(db){
        const resultDocument = await db.collection("counters").findOneAndUpdate(
            {_id : 'cartItemId'},  // Filtering and finding document for cartItemId
            {$inc : {value : 1}},  // Incrementing the current value by 1
            {returnDocument : 'after'} // {returnNewDocumet : 'true'} // To return document...after updation
        )

        console.log(resultDocument.value);
        return resultDocument.value;
    }


}