const express = require("express");

const app = express();

app.use("/",(req,res)=>{
    res.send("Welcome to DevTinder application");
})

app.use("/test",(req,res)=>{
    res.send("Test page");
})

app.listen(3000,()=>{
    console.log("Server listening on port 3000....")
})   