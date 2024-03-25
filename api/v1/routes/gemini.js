const router= require('express').Router()


const {getText,textGenerator,uploadData,getAllAnswers}=require('../controller/gemini')

router.post('/',getText)
router.get('/',textGenerator)
router.post('/',uploadData)
router.get('/all',getAllAnswers)



module.exports=router;