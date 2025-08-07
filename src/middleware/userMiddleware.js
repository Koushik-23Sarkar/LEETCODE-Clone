const jwt = require("jsonwebtoken")
const User = require('../models/user');
const redisclient = require('../config/redis');

const userMiddleware = async (req,res,next)=>{
    // input: 
    // output:

    try{
        //Is token exist or not?
        const {token}=req.cookies;  
        if(!token){
            throw new Error("Token is not present!");
        }

        // valify the token
        const payload = jwt.verify(token,process.env.JWT_SECRET);   
        const {_id}=payload;
        if(!_id){
            throw new Error("token invaild");
        }

        const result =await User.findOne({_id});
        if(!result){
            throw new Error("User doesn't exist!");
        }

        const isBlocked = await redisclient.exists(`token:${token}`); 
        if(isBlocked){
            throw new Error("invaild token!");
        }

        req.result=result

        next();
    }catch(err){
        res.status(401).send("Error: "+err.message);   // 401 => user authenticattion
    }
}

module.exports=userMiddleware;