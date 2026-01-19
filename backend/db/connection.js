const mongoose = require('mongoose')
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(res=>{
    console.log('MongoDb connected successfully');
    
}).catch(err=>{
    console.log(`connection failed due to ${err }`);
    
})