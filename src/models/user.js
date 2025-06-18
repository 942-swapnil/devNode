const { type } = require("express/lib/response");
const { mongoose } = require("mongoose");
const validator = require('validator');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };

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
        trim: true,
        // validate: [validateEmail, 'Please fill a valid email address'],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email address ' + value )
            }
        }
    },
    password:{
        type: String,
        require : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please enter strong password.')
            }
        }
        
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
        default : "https://static.vecteezy.com/system/resources/thumb…-images-for-unfilled-user-profile-free-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Photo url is invalid ' + value )
            }
        }
    },
    about:{
        type : String,
        default: "This is default imformation about user"
    },
    skills:{
        type: [String]
    }
},{ timestamps : true});


userSchema.methods.getJWT = async function() {

    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'Swapnil_dev@Tinder',{ expiresIn: '1h' });

    return token ; 

}

userSchema.methods.validatePassword = async function(userPasswordInput) {

    const user = this;
    const isPassword = await bcrypt.compare(userPasswordInput , user.password);

    return isPassword;
}



module.exports = mongoose.model("User", userSchema);