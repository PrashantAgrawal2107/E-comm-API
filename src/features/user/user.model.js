export default class UserModel {
    constructor(name, email, password, type, id) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.type = type;
      this.id = id;
    }
    
    static SignUp(name,email,password,type){
        const newUser = new UserModel(name,email,password,type,users.length+1);
        users.push(newUser);
        return newUser;
    }

    static SignIn(email,password){
        const user = users.find((user)=>user.email==email && user.password==password);
        return user;
    }

    static getAll() {
        return users;
      }
  
  }
  
  let users = [
    {
      id: 1,
      name: 'Seller User',
      email: 'seller@ecom.com',
      password: 'Password1',
      type: 'seller',
    },
    {
      id: 2,
      name: 'Customer User',
      email: 'customer@ecom.com',
      password: 'Password1',
      type: 'customer',
    },
  ];
  