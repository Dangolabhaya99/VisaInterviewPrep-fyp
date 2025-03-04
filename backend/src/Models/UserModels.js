const mongoose = require('mongoose');
const {Schema} = mongoose;
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,    
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    address:{
        type:String,
        required: true,
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;