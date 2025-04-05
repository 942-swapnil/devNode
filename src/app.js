const express = require("express");

const app = express();

app.get("/user/:userId/:userName",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"Swapnil" , lastName:"Navghare" , gender: "Male"})
})

app.get("/user",(req,res)=>{
    res.send({firstName:"Swapnil" , lastName:"Navghare" , gender: "Male"})
})

app.post("/user",(req,res)=>{
    res.send("Data updated successfully in database");
})

app.delete("/user",(req,res)=>{
    res.send("Data deleted from the  database");
})


app.use("/test",(req,res)=>{
    res.send("Test page");
})

app.use("/dev",(req,res)=>{
    res.send("dev page");
})

app.use("/",(req,res)=>{
    res.send("Welcome to DevTinder application");
})



app.listen(3000,()=>{
    console.log("Server listening on port 3000....")
})   