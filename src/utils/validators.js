const validator = require('validator');


validateSigngUp = (req) =>{

    const { firstName , lastName , emailId , password } = req.body ;

    if(!firstName || !lastName){
        throw new Error("Please enter valid name")
    }
    else if(firstName.length < 4  ){
        throw new Error("Please enter valid name")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email Id")
    }
}

validateEditProfile = (req) =>{

    const isAllowed = ["firstName", "lastName", "emailId", "age", "gender", "imgUrl", "about", "skills"];

    Object.keys(req.body).forEach((keys) =>{
        if(!isAllowed.includes(keys)){
            throw new Error("Please send valid data to update profile");
        }
    })

}


module.exports = {validateSigngUp , validateEditProfile}