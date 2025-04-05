const adminAuth = (req,res,next)=>{
    console.log("In admin middleware")

    let token = "abca";
    let isAdminAtherised = token === "abc";

    if(!isAdminAtherised){
        res.status(401).send("Admin is not authorized")
    }else{
        next();
    }
}

const userAuth = (req,res,next) =>{
    let token = "abc";
    let isUserAtherised = token === "abc";

    if(!isUserAtherised){
        res.status(401).send("User is not authorized")
    }else{
        next();
    }
}



module.exports = {adminAuth , userAuth}