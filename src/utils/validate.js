const validator = require('validator');

const validate =(data)=> {
    const madatoryField = ['firstName','emailId','password'];
    const isAllowed = madatoryField.every((k)=>Object.keys(data).includes(k))
    if(!isAllowed){
        throw new Error("Some field missing!");
    }

    if(!validator.isEmail(data.emailId)){
        throw new Error("inValid Email!");
    }
    // if(!validator.isStrongPassword(data.password)){
    //     throw new Error("weak password!");
    // }
    
}

module.exports=validate;