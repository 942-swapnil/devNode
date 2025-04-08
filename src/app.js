const express = require("express");

const app = express();


const connectDB = require("./config/database.js");

app.use(express.json())
const User = require('./models/user.js');




app.post("/singup",async (req,res)=>{
    // console.log(req.body)
    const user = new User(req.body)

    try{
        await user.save()
        res.send("User created successfully")
    }catch(err){
        res.status(400).send("User naot created : "+ err.massage);
    }

})

app.post("/user",async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        const users = await User.find({emailId :userEmail })
        if(users.length ===0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }

    }catch(err){
        res.status(400).send("Something went wrong") 
    }
})

app.get("/feed", async (req,res)=>{
    try{
        const user = await User.find({});
        res.send(user)
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})



app.post("/getUserById",async (req,res)=>{
    const userID = req.body.userID;
    console.log(userID);

    try{
        const user = await User.findById(userID);
        if(!user){
            res.status(404).send("User not found")
        }else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

app.delete("/deleteUserById",async (req,res)=>{
    const userID = req.body.userID;
    console.log(userID);

    try{
        const user = await User.findByIdAndDelete(userID);
        if(!user){
            res.status(404).send("User not found")
        }else{
            res.send("User deleted successfully");
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch("/updateUserById", async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        
        const user = await User.findByIdAndUpdate(userId, data);
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send("User updated successfully");
        }
    }catch(err){
        res.status(400).send("Something went wrong");
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

 