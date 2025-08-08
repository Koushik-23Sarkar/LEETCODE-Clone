const Problems = require("../models/problem");
const Submissions = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility")

const createProblem = async (req,res)=>{
    console.log("Enter in the CreateProblem!");
    const {title,description,difficulty,tags,
        hiddenTestCases,visibleTestCases,startCode,
        referenceSolution,problemCreator}=req.body;


    try{
        for(const {language,completeCode} of referenceSolution){
            // {language,code,input,output} give to the judge0. To check Admin's code input output is correct or not.
            // Judge0 format: {language_id,source_code,stdin,expected_output}
            //c++: 

            console.log("ReferenceSolution: "+referenceSolution);
            const languageId = getLanguageById(language);
            console.log("languageId: "+languageId);
            // now, we have 2 options: (1)send each testcases at each request (2)Send a batch of testcases to the Judge0.

            //Creating Batch submission for each language:
            const submission = visibleTestCases.map((testCases)=>(
                {
                    source_code:completeCode,
                    language_id:languageId,
                    stdin:testCases.input,
                    expected_output:testCases.output
                }
            ))
            

            // Submit your batch to your jugde0
            console.log("Submit your batch to your Judge0!");
            const submitResult = await submitBatch(submission); //This will give you 'token';
            console.log("submitResult: "+submitResult);
            const resultToken = submitResult.map((value)=>{
                return value.token;
            })
            
            console.log("resultToken: "+resultToken);
            const testResult = await submitToken(resultToken);
            console.log(testResult);
            console.log(testResult.status_id);
            for(const test of testResult){
                console.log("Enter in the for-of loop!");
                if(test.status_id!=3){
                    //Error in that Code
                    return res.status(400).send("error in this Code!");
                }
            }
            console.log("Exit from for-of loop!");



        }

        console.log("Problem DB is calling...!")
        console.log("ProbemCreater: "+req.result._id);
        //Now we can save in the DB.
        console.log(req.body);
        req.body.problemCreator=req.result._id;
        console.log(req.body.problemCreator);
        const userProblem = await Problems.create(req.body);
        console.log("DB call is completed!")

        res.status(201).send("Problem saved successflly!")
        console.log("userProblem: "+userProblem);
    }catch(err){
        console.log(err);
        res.status(400).send("Error: ",err);
    }
}

const updateProblem = async (req,res)=>{
    console.log("Enter in the UpdateProblem!");
    console.log(req.body);
    const {id}=req.params;

    const {title,description,difficulty,tags,
        hiddenTestCases,visibleTestCases,startCode,
        referenceSolution,problemCreator}=req.body;

    try{
        if(!id){
            return res.status(400).send("Missing ID field!");
        }

        const DsaProblem = await Problems.findById(id);
        if(!DsaProblem){
            return res.status(404).send("ID is not present in Sever");
        }

        for(const {language,completeCode} of referenceSolution){
            // {language,code,input,output} give to the judge0. To check Admin's code input output is correct or not.
            // Judge0 format: {language_id,source_code,stdin,expected_output}
            //c++: 

            const languageId = getLanguageById(language);

            // now, we have 2 options: (1)send each testcases at each request (2)Send a batch of testcases to the Judge0.

            //Creating Batch submission for each language:
            const submission = visibleTestCases.map((testCases)=>(
                {
                    source_code:completeCode,
                    language_id:languageId,
                    stdin:testCases.input,
                    expected_output:testCases.output
                }
            ))
            

            // Submit your batch to your jugde0
            const submitResult = await submitBatch(submission); //This will give you 'token';

            const resultToken = submitResult.map((value)=>{
                return value.token;
            })

            const testResult = await submitToken(resultToken);
            
            for(const test of testResult){
                if(test.status_id!=3){
                    //Error in that Code
                    return res.status(400).send("error in this Code!");
                }
            }
        }   //Check the reference solution

        //now we can update that information
        const newProblem = await Problems.findByIdAndUpdate(id,{...req.body},{runValidators:true,new: true});// `new:true` --> to get updated new document.
        res.status(200).send(newProblem);
    }catch(err){
        res.status(404).send("Error: "+err);
    }
}

const deleteProlem = async (req,res)=>{
    const {id}=req.params;

    try{
        if(!id){
            return res.status(400).send("ID is missing!");
        }

        const deletedProblem = await Problems.findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(404).send("Problem is Missing!");
        }

        res.status(200).send("Successfully Deleted!");
    }catch(err){
        res.status(400).send("Error: ",err);
    }
}

const getProblemByID = async (req,res)=>{
    const {id} = req.params;

    
    try{
        if(!id){
            return res.status(404).send("Id is missing!");
        }
        const getProblem = await Problems.findById(id).select('_id title description difficuty tags visibleTestCases startCode referenceSolution');

        if(!getProblem){
            return res.status(404).send("Problem is missing!");
        }

        res.status(200).send(getProblem);

    }catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getAllProblems = async (req,res)=>{   //pagenation in future
    try{
        const getProblem = await Problems.find({}).select('_id title difficulty tags');

        if(getProblem.length==0){
            return res.status(404).send("Problems is Missing!");
        }

        res.status(200).send(getProblem);
    }catch(err){
        res.status(500).send("Error: "+err);
    }
}

const solvedAllProblemByUser = async (req,res)=>{
    try{
        // const count = req.result.problemSolved.length;
        // res.status(200).send(count);


        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path:"problemSolved",
            select: "_id title difficulty tags"
        })

        res.status(200).send(user.problemSolved);
    }catch(err){
        res.status(500).send("Server Error!")
    }
}

const submittedProblem = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.pid;

        const answer = await Submissions.find({userId,problemId});
        if(answer.length==0){
            res.status(200).send("No Submission is present!");
        }
        res.status(200).send(answer);
    }catch(err){
        res.status(500).send("Internet Server Error!");
    }
}

module.exports={createProblem,updateProblem,deleteProlem,getProblemByID,getAllProblems,solvedAllProblemByUser,submittedProblem};