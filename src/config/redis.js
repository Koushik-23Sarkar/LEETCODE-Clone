const {createClient}=require('redis');


console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PASSWORD);
const redisClient = createClient({
    username:'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12314

    }
})

module.exports=redisClient;




// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host:process.env.REDIS_HOST,
//         port: 12709
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();
