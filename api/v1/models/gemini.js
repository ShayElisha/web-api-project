const mongoose= require('mongoose')
require('dotenv').config()
mongoose.pluralize(null)

const geminiSchema = new mongoose.Schema({
     
     question:String,
     answer:String,
     userEmail: {
          type: String,
          required: true
     }
})

module.exports= mongoose.model('gemini',geminiSchema)