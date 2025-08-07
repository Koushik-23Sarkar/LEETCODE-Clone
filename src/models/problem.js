const mongoose = require('mongoose');
const {Schema}=mongoose;


const problemSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
    },
    tags:{
        type:String,
        enum:['array','linkedlist','graph','DP'],
    },
    hiddenTestCases:[{
        input:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        },

        explanation:{
            type:String,
            required:true
        },
    }],
    visibleTestCases:[{
        input:{
            type:String,
            required:true,
        },
        output:{
            type:String,
            required:true,
        },

        explanation:{
            type:String,
            required:false
        },
    }],
    startCode:[{
        language:{
            type:String,
            required:false,
        },
        initialCode:{
            type:String,
            required:false,
        }
    }],
    referenceSolution:[{
        language:{
            type:String,
            required:true,
        },
        completeCode:{
            type:String,
            required:true,
        },
    }],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user', //Schema.Types = user (table)
        required:true,
    } 
})




const Problems = mongoose.model('problem',problemSchema);
module.exports=Problems;