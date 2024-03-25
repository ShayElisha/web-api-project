const router= require('express').Router()

const {sendMail}=require('../controller/contact')



// נתיב לשליחת מייל תגובה למשתמש
router.post('/', sendMail);



module.exports=router