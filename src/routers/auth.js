const express = require('express');

const authRouter = express.Router();
const User = require('../models/user.js');
const {validateSigngUp} = require('../utils/validators.js');
const {userAuth} = require('../Middleware/auth.js');
const bcrypt = require('bcrypt');


authRouter.post("/singup",async (req,res)=>{

    try{
    validateSigngUp(req);

    const { firstName , lastName , emailId , password } = req.body ;

    const passwordHash = await bcrypt.hash(password , 10);

    const user = new User({
        firstName , lastName , emailId , password : passwordHash
    })
   
        await user.save()
        res.send("User created successfully")
    }catch(err){
        res.status(400).send("User not created : "+ err.message);
    }

})

authRouter.post("/login", async (req,res)=>{

    try{
        const { emailId , password } = req.body ;

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("Invalid credentials");
        }

        // const isPassword = await bcrypt.compare(password , user.password);

        const isPassword = await user.validatePassword(password);
        
        if(isPassword){

            // const JWTtoken = jwt.sign({ _id: user._id }, 'Swapnil_dev@Tinder',{ expiresIn: '1h' });
            const JWTtoken = await user.getJWT();
            res.cookie('token',JWTtoken,{expires: new Date(Date.now() + 8 * 3600000)});

            res.status(200).send("User login successfully ....!");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }

   
})

authRouter.post("/logout",userAuth, async (req,res)=>{
    const user = req.user;

    res.cookie('token','',{expires: new Date(Date.now())});

    res,send("User logged out successfully ....!");
})

module.exports = authRouter;
