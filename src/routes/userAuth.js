const express=require('express');
const authRounter = express.Router();
const {register,login,logout,adminRegister,deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
//Register
//login
//logout
//getProfile


//Register
authRounter.post("/register",register);
authRounter.post('/login',login);
authRounter.post('/logout',userMiddleware,logout);
// authRounter.get('getProfile',getProfile)
authRounter.post('/admin/register',adminMiddleware,adminRegister);
authRounter.delete('/profile',userMiddleware,deleteProfile);
authRounter.get('/check',userMiddleware,(req,res)=>{
    const reply = {
        firstNAme:req.result.firstNAme,
        emailId:req.result.emailId,
        _id:req.result._id
    }
    res.status(200).json({
        user:reply,
        message: "Valid User"
    })
})

module.exports=authRounter;