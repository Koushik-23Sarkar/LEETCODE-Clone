const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require("../middleware/userMiddleware");
const problemRouter = express.Router();
const {createProblem,updateProblem,deleteProlem,getProblemByID,getAllProblems,solvedAllProblemByUser,submittedProblem} = require('../controllers/userProblem')
//Create
//fetch
//update
//delete
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProlem);

problemRouter.get("/problemById/:id",userMiddleware,getProblemByID);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblems);
//Questions solve by a particuler User.
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser);


//How many submission is submited by user for a particular problem.
problemRouter.get('/submittedProblem/:pid',userMiddleware,submittedProblem);

/* 
database indexing: 
                (1) by default for '_id'     //never play with '_id'
                (2) for those which field is unique.
*/

//compound index: custom index

//If you do indexing for every field in the Database, it will incease size of the Database.
//you should do indexing only for those field which is used frequently.

module.exports=problemRouter;
