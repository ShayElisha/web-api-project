const mongoose= require('mongoose')
require('dotenv').config()
mongoose.pluralize(null)

const signupSchema = new mongoose.Schema({
     Email:{
          type:String,
          require:true
     },
     Username:{
          type:String,
          required:true
     },
     Password:{
          type:String,
          required:true
     },
     birthdate:{
          type:Date,
          required:true
     },phon:{
          type:String,
          required:true
     },
     profile:{
          type:String,
          
     },
     isAdmin:{
          type:Boolean,
          default:false
     }
})

module.exports= mongoose.model('user',signupSchema)