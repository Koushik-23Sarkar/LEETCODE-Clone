const express = require('express');
const userMiddleware = require("../middleware/userMiddleware");
const { runCode, submitCode } = require('../controllers/userSubmission');
const submitRouter = express.Router();

submitRouter.post('/submit/:id',userMiddleware,submitCode);
submitRouter.post('/run/:id',userMiddleware,runCode);

module.exports=submitRouter;