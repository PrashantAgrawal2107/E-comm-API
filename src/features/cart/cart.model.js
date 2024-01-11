

export default class CartModel{
    constructor(productID, userID , quantity,id){
        this.productID = productID;
        this.userID = userID;
        this.quantity = quantity;
        this.id = id;
    }

    static addItem(productID,userID,quantity){
        const cartItem = new CartModel(
            productID,
            userID,
            quantity,
            cartItems.length+1
            );
        cartItems.push(cartItem);
        return cartItem;
    }

    static get(userID){
        return cartItems.filter((i)=>i.userID==userID);
    }
    
    static delete(cartItemID,userID){
        const cartItemIndex = cartItems.findIndex(
            (i)=>i.id==cartItemID);
            // (i)=> i.id==cartItemID && i.userID==userID);
        if(cartItems[cartItemIndex].userID!=userID){
            return "You can not delete items from other person cart"
        }
        if(cartItemIndex == -1 ){
            return "Item not Found"; 
        }else{
            cartItems.splice(cartItemIndex,1);
        }
    }
}

var cartItems = [
    new CartModel(1,2,1,1),
    new CartModel(1,1,2,2)
];