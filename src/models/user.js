const mongoose = require('mongoose');
const {Schema}=mongoose;


const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:50,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        min:10,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',

    },
    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],   //Array of String
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});


userSchema.post('findOneAndDelete',async function (userInfo){   //attach to 'findByIdAndDelete' because 'findByIdAndDelete' internaly use 'findOneAndDelete'
    if(!userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
})



const User = mongoose.model("user",userSchema);
module.exports=User;