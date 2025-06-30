const express = require('express');

const profileRouter = express.Router(); 
const {userAuth} = require('../Middleware/auth.js');
const { validateEditProfile } = require('../utils/validators.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

profileRouter.get("/profile/view",userAuth, async (req,res) =>{
    try{
        const userInfo =  req.user;
        res.status(200).send(userInfo);
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }

})

profileRouter.patch("/profile/update",userAuth, async (req,res) =>{
    try{
        validateEditProfile(req);
        const loggedUser = req.user;
        await loggedUser.save();
        res.status(200).send("Profile updated successfully");
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})

profileRouter.patch("/profile/forgotPassword",userAuth, async (req,res) =>{
    try{
        const {emailId , password} = req.body;
        if(!emailId){
            throw new Error("Please enter valid email Id");
        }   

        const user = await User.findOne({emailId : emailId});

        if(!user){
            throw new Error("User does not exists");
        }

        const passwordHash = await bcrypt.hash(password , 10);

        user.password = passwordHash;
        await user.save();

    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = profileRouter ; 
