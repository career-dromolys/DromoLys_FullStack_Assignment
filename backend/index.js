//9.import dotenv
require('dotenv').config() // loads .env file contents into process.env by default

// 1. import server
const express = require('express')

//5. import cors
const cors = require('cors')

//7.import router
const router = require('./router')

//11. import connection
require('./db/connection')


//2. create server
const csvserver = express()

//6.tell server to use cors
csvserver.use(cors())

//10. use json to parse 
csvserver.use(express.json())

//8.tell server to use router
csvserver.use(router)

//static files 
csvserver.use("/imguploads",express.static("./imguploads"))

//3.create port
const PORT = process.env.PORT || 3000

//4. tell server to listen
csvserver.listen(PORT,()=>{
    console.log(`csvserver  started running successfully at port ${PORT},waiting for the client request`);
    
})

csvserver.get('/',(req,res) => {
    res.status(200).send('csvserver server started ')
})


