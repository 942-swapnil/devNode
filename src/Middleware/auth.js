
var jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async (req,res,next) =>{

    try{
        const {token} = req.cookies;

        if(!token){
            throw new Error("Invalid token ..");
        }
    
        const decoded = jwt.verify(token,'Swapnil_dev@Tinder');
    
        const user = await User.findById({_id : decoded._id});
    
        if(!user){
            throw new Error("User does not exists");
        }

        req.user = user;
    
        next();
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
}



module.exports = {userAuth}