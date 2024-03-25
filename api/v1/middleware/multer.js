
// ייבוא חבילת multer לטיפול בהעלאת קבצים
const multer = require('multer')

// הגדרת האחסון לקבצים שמועלים
const storage = multer.diskStorage({
    // פונקציה להגדרת מיקום האחסון של הקובץ, בהתאם לשדה שממנו הקובץ מועלה
destination: (req, file, cb) => {
        // אם השדה הוא 'profile', שמירת הקובץ בתיקייה מסוימת
     if (file.fieldname == "profile")
          cb(null, 'static/uploads/pics')
        // אם השדה הוא 'video', שמירת הקובץ בתיקייה אחרת
     else if (file.fieldname == "video")
          cb(null, 'uploads/pic')
        // לכל שאר הקבצים, שמירה בתיקייה כללית
     else
          cb(null, '/uploads/file')
},
    // פונקציה להגדרת שם הקובץ המועלה
filename: (req, file, cb) => {
        // יצירת שם קובץ רנדומלי עבור קובץ מסוג 'profile'
     if (file.fieldname == "profile") {
          let filename = Math.floor(Math.random() * 100000)
          let fileExt = file.originalname.split('.').pop()
          cb(null, filename + "." + fileExt)
     }
        // יצירת שם קובץ רנדומלי עם קידומת 'vod' עבור קובץ מסוג 'video'
     else if (file.fieldname == "video") {
            let filename = 'vod' + Math.floor(Math.random() * 100000)
          let fileExt = file.originalname.split('.').pop()
          cb(null, filename + "." + fileExt)
     }
        // יצירת שם קובץ רנדומלי לכל שאר הקבצים
     else {
          let filename = Math.floor(Math.random() * 1000000)
          let fileExt = file.originalname.split('.').pop()
          cb(null, filename + "." + fileExt)
          }
     }
})

// יצירת מופע של multer עם אובייקט האחסון שהוגדר
const uploadfile = multer({
     storage
})

// יצוא המופע של multer, כדי שניתן יהיה להשתמש בו במקומות אחרים באפליקציה
module.exports = uploadfile;
