
const redisClient = require('../config/redis');
const Submissions = require('../models/submission');
const User = require('../models/user');
const validate = require('../utils/validate');
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken');

const adminRegister = async (req,res)=>{
    try{
        //validate the data
        validate(req.body);
        const {firstName,emailId,password} =req.body;
        req.body.password = await bcrypt.hash(password,10);
        req.body.role="admin";
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user.id,emailId:emailId,role:"user"},process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000}); //maxAge: after maxAge time cookie will be expried.
        res.status(201).send("User registed Successfully!")

    }catch(err){
        res.status(400).send("Error: "+err);
    }
}
const register = async(req,res)=>{

    try{
        //validate the data
        console.log(req.body);
        validate(req.body);
        const {firstName,emailId,password} =req.body;
        req.body.password = await bcrypt.hash(password,10);
        req.body.role="user"
        const user = await User.create(req.body);

        const token = jwt.sign({_id:user.id,emailId:emailId,role:"user"},process.env.JWT_SECRET,{expiresIn:60*60});
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }
        res.cookie('token',token,{maxAge: 60*60*1000}); //maxAge: after maxAge time cookie will be expried.
        // res.status(201).send("User registed Successfully!")
        res.status(201).json({
            user:reply,
            message:"loggin Successfully from register function"
        });

    }catch(err){
        res.status(400).send("Error: "+err);
    }
}

const login = async (req,res)=>{
    try{
        const {emailId,password}=req.body;

        if(!emailId){
            throw new Error("invaild Credentials!")
        }

        if(!password){
            throw new Error("invaild Credentials!")
        }

        console.log('emailId: '+emailId);
        const user = await User.findOne({emailId: emailId});
        console.log(password);
        console.log(user.emailId);
        const match = await bcrypt.compare(password,user.password)

        if(!match){
            throw new Error("invaild Credentials!")
        }

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token = jwt.sign({_id:user.id,emailId:emailId,role:user.role},process.env.JWT_SECRET,{expiresIn:60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).json({
            user:reply,
            message:"loggin Successfully from login function"
        });


    }catch(err){
        res.status(401).send("Error: "+err);
    }
}

const logout = async (req,res)=>{
    try {
        
        const {token} = req.cookie;

        const payload = jwt.decode(token);
        
        await redisClient.set(`token:${token}`,`Blocked`);
        await redisClient.expireAt(`token:${token}`,payload.exp)    //
        //token add to the redis blocklist
        // clear coookie
        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logout successfully!");

    } catch (err) {
        res.status(503).send("Error: "+err);
    }
}

const deleteProfile = async (req,res)=>{
    try{
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);   //User profit is deleted

        //Now all submission which is created by that User should also delete
        await Submissions.deleteMany({userId})

        res.status(200).send("Deleted Successfully!");
    }catch(err){
        res.status(500).send('server error: '+err);

    }
}

module.exports={register,login,logout,adminRegister,deleteProfile};