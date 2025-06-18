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


module.exports = {validateSigngUp}