const mongoose = require('mongoose');

async function main() {
    console.log(process.env.DB_CONNECT_STRING);
    await mongoose.connect(process.env.DB_CONNECT_STRING);
}

module.exports=main;