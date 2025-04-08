const express = require("express");

const app = express();

const connectDB = require("./config/database.js");
const User = require('./models/user.js');


app.post("/singup",async (req,res)=>{

    const user = new User({
        firstName: "Sachin",
        lastName : "Tendulkar",
        emailId: "sachin.Tendulkar@gamil.com",
        password : "sachin@123"
    })

    try{
        await user.save()
        res.send("User created successfully")
    }catch(err){
        res.status(400).send("User naot created : "+ err.massage);
    }

})


connectDB().then(()=>{
    console.log("Database connection establish");
    app.listen(3000,()=>{
        console.log("Server listening on port 3000....")
    })  
}).catch(err=>{
    connect.error("Database not connected")
})

 