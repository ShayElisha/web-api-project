
const router = require('express').Router();

// ייבוא הפונקציות מהבקר של URL
const { generateUrl, getUrl, shorten } = require('../controller/shorturl');

// הגדרת נתיב לדף הבית, שם יתבצע פעולת GET להצגת כל ה-URLs
router.get('/', getUrl);

// הגדרת נתיב ליצירת URL מקוצר חדש דרך פעולת POST
router.post('/generate', generateUrl);

// הגדרת נתיב להפניה דרך ה-URL המקוצר
router.get('/:shortUrl', shorten);


module.exports = router;
