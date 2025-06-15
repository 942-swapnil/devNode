const { type } = require("express/lib/response");
const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require : true,
        minLength: 3
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        require : true,
        unique: true,
        lowercase : true,
        trim: true
    },
    password:{
        type: String,
        require : true
    },
    age:{
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error("Gender data not valid")
            }
        }
    },
    imgUrl:{
        type : String,
        default : "https://static.vecteezy.com/system/resources/thumb…-images-for-unfilled-user-profile-free-vector.jpg"
    },
    about:{
        type : String,
        default: "This is default imformation about user"
    },
    skills:{
        type: [String]
    }
},{ timestamps : true})

module.exports = mongoose.model("User", userSchema);