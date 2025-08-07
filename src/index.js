const express = require('express');
const app = express();
require('dotenv').config({
    path:'./.env'
});
const main=require('./config/db');      //For DB connection
const cookieParser=require('cookie-parser');
const authRounter = require('./routes/userAuth');
const redisClient = require('./config/redis');      // for Redis connection
const problemRouter = require('./routes/problemCreator');


app.use(express.json());  //Je req.body asbe, take json format ---> JS object;
app.use(cookieParser());

app.use('/user',authRounter);
app.use('/problem',problemRouter);

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