
var jwt = require('jsonwebtoken');
const User = require('../models/user');

// const adminAuth = (req,res,next)=>{
//     console.log("In admin middleware")

//     let token = "abca";
//     let isAdminAtherised = token === "abc";

//     if(!isAdminAtherised){
//         res.status(401).send("Admin is not authorized")
//     }else{
//         next();
//     }
// }


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