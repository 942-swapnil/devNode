const express = require("express");

const app = express();

const cookieParser = require('cookie-parser')

const connectDB = require("./config/database.js");

app.use(express.json());
const User = require('./models/user.js');
var jwt = require('jsonwebtoken');
const {validateSigngUp} = require('./utils/validators.js');
const bcrypt = require('bcrypt');
app.use(cookieParser());
const {userAuth} = require('./Middleware/auth.js');



app.post("/singup",async (req,res)=>{

    // Validate data
    try{
    validateSigngUp(req);

    // Encrept password (Hash password)

    const { firstName , lastName , emailId , password } = req.body ;

    const passwordHash = await bcrypt.hash(password , 10);



    // console.log(req.body)
    const user = new User({
        firstName , lastName , emailId , password : passwordHash
    })

   
        await user.save()
        res.send("User created successfully")
    }catch(err){
        res.status(400).send("User not created : "+ err.message);
    }

})

app.post("/login", async (req,res)=>{

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

app.get("/profile",userAuth, async (req,res) =>{
    try{
        const userInfo =  req.user;
        res.status(200).send(userInfo);
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
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

// app.patch("/updateUserById", async (req,res)=>{
//     const userId = req.body.userId;
//     const data = req.body;
//     try{
        
//         const user = await User.findByIdAndUpdate(userId, data, {
//             returnDocument:'after',
//             runValidators : true
//         });
//         if(!user){
//             res.status(404).send("User not found");
//         }else{
//             res.send("User updated successfully");
//         }
//     }catch(err){
//         res.status(400).send("Something went wrong : "+ err.message );
//     }
// })


app.patch("/updateUserById/:userID", async (req,res)=>{
    const userId = req.params?.userID;
    const data = req.body;
    try{
        const allowed_parameter = ["imgUrl","about","skills","firstName","lastName","password","gender"];
        const isAllowed = Object.keys(data).every(k => allowed_parameter.includes(k))

        if(!isAllowed){
            throw new Error("Parameter not proper");
        }

        if(req.body?.skills?.length > 10){
            throw new Error("maximum 10 skills you can add");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument:'after',
            runValidators : true
        });
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send("User updated successfully");
        }
    }catch(err){
        res.status(400).send("Something went wrong : "+ err.message );
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

 