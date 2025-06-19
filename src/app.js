const express = require("express");

const app = express();

const cookieParser = require('cookie-parser')

const connectDB = require("./config/database.js");

app.use(express.json());

app.use(cookieParser());

const authRouter  = require('./routers/auth.js')
const profileRouter  = require('./routers/profile.js')

app.use("/",authRouter);
app.use("/",profileRouter);




connectDB().then(()=>{
    console.log("Database connection establish");
    app.listen(3000,()=>{
        console.log("Server listening on port 3000....")
    })  
}).catch(err=>{
    connect.error("Database not connected")
})

 