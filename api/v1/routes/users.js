const router= require('express').Router()
const uploads= require('../middleware/multer')

const {register,Login}=require('../controller/user')
router.post('/signup',uploads.single("profile"),register)
router.post('/login',Login)




module.exports=router;