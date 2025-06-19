const express = require('express');

const profileRouter = express.Router(); 
const {userAuth} = require('../Middleware/auth.js');

profileRouter.get("/profile",userAuth, async (req,res) =>{
    try{
        const userInfo =  req.user;
        res.status(200).send(userInfo);
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }

})

module.exports = profileRouter ; 
