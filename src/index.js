const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const main=require('./config/db');      //For DB connection
const cookieParser=require('cookie-parser');
const authRounter = require('./routes/userAuth');
const redisClient = require('./config/redis');      // for Redis connection
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');

app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true                 // allow cookies/auth headers
}));
app.use(express.json());  //Je req.body asbe, take json format ---> JS object;
app.use(cookieParser());

app.use('/user',authRounter);
app.use('/problem',problemRouter);
app.use('/submit',submitRouter)

console.log("MONGO_URI:", process.env.DB_CONNECT_STRING);


const initalizeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB connected!");
        app.listen(4000,()=>{
          console.log("Server listening at PORT: "+4000)
        })
    }catch(err){
        console.log("Error: ",err);
    }
}

initalizeConnection();

// main()
// .then(async ()=>{
//     app.listen(process.env.PORT,()=>{
//         console.log("Server listening at PORT: "+process.env.PORT)
//     })
// })
// .catch((err)=>{
//     console.log("Error: "+err);
// });