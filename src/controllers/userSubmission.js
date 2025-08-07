const Problems = require("../models/problem");
const Submission = require("../models/submission")
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.id;

        const {code,language}=req.body;

        if(!userId||!problemId||!code||!language){
            return res.status(400).send("some field is missing!");
        }

        const problem = await Problems.findById(problemId);

        //Before get the answer from judeg0, we store that submission in the database and mark as pending.
        const submissionResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            testCasesPassed:0,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length,
        })

        const languageId = getLanguageById(language);

        const submission = problem.hiddenTestCases.map((testCases)=>(
                {
                    source_code:code,
                    language_id:languageId,
                    stdin:testCases.input,
                    expected_output:testCases.output
                }
        ))

        const submitResult = await submitBatch(submission);
        const resultToken = submitResult.map((value)=>{
            return value.token;
        })  
        
        const testResult = await submitToken(resultToken);

        //Update submit result
        let testCasesPassed =0;
        let runtime=0;
        let memory=0;
        let status='accepted';
        let errorMessage=null;
        console.log("TestResult: "+testResult);
        for(const test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime+= parseFloat(test.time);
                memory=Math.max(memory,test.memory)
            }else{
                if(test.status_id==4){
                    status='error';
                    errorMessage=test.stderr;
                }else{
                    status='wrong';
                    errorMessage=test.stderr;
                }
            }
        }

        //Stone the result in the database in submission
        submissionResult.status=status;
        submissionResult.testCasesPassed=testCasesPassed
        submissionResult.runtime=runtime;
        submissionResult.errorMessage=errorMessage;
        submissionResult.memory=memory;

        await submissionResult.save();  //First we update the value of 'submissionResult' and save


        //Insert ProblemId in the User Schema
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }
        res.status(200).send(submissionResult);
    }catch(err){
        res.status(500).send("Internet Server Error: "+err);
    }
}

const runCode = async (req,res)=>{
    try{
        const userId = req.result._id;
        const problemId = req.params.id;

        const {code,language}=req.body;

        if(!userId||!problemId||!code||!language){
            return res.status(400).send("some field is missing!");
        }

        const problem = await Problems.findById(problemId);

        const languageId = getLanguageById(language);

        const submission = problem.visibleTestCases.map((testCases)=>(
                {
                    source_code:code,
                    language_id:languageId,
                    stdin:testCases.input,
                    expected_output:testCases.output
                }
        ))
        console.log("input of submitBatch: \n"+submission);
        const submitResult = await submitBatch(submission);
        const resultToken = submitResult.map((value)=>{
            return value.token;
        })  
        console.log("input of submitToken: \n"+resultToken);
        const testResult = await submitToken(resultToken);

        res.status(200).send(testResult);

    }catch(err){
        res.status(500).send("Internet Server Error: "+err);
    }
}

module.exports={submitCode,runCode}