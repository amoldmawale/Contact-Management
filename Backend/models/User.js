const mongoose  =require ('mongoose');


const Userschema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Name is required"]
    },
    email:{
        type: String,
        required:[true,"Email is required"]
    },
    password:{
        type: String,
        required:[true,"Password is required"]
    }
});

const User = new mongoose.model ("User",Userschema);
module.exports = User;