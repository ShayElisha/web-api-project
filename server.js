const http= require('http');
require('dotenv').config()
const app= require('./app')
const port= process.env.PORT

const srv= http.createServer(app)

srv.listen(port,()=>{
     console.log("srever is run on port "+port)
})