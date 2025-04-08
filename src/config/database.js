const mongoose =require('mongoose');


const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://swapnilnavghare942:aQL6WV5X6YpAAR5K@devtinder1.x5pfji6.mongodb.net/devTinder")
}

module.exports = connectDB;


