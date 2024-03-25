const admin = require('../models/admin'); // טעינת מודל האדמין
const users = require('../models/register'); // טעינת מודל המשתמשים
const bcrypt= require('bcrypt') // טעינת הספרייה להצפנת סיסמאות
const jwt= require('jsonwebtoken') // טעינת הספרייה לניהול טוקנים
const multer=require('multer') // טעינת הספרייה לניהול העלאת קבצים

module.exports = {
    getinfo: async (req, res) => {
        try {
            const users = require('../models/register'); // טעינה מחדש של מודל המשתמשים
            const gemini = require('../models/gemini'); // טעינת מודל ג'מיני
            const url = require('../models/urlModel'); // טעינת מודל כתובות URL

                    // Fetch data from the specified collection
            const gem = await gemini.find().lean(); // שליפת כל הנתונים מהמודל של ג'מיני
            const user = await users.find().lean(); // שליפת כל הנתונים מהמודל של המשתמשים
            const urls = await url.find().lean(); // שליפת כל הנתונים מהמודל של כתובות ה-URL
            
            return res.render('admin', { layout: 'admin', gem: gem, users: user, url: urls}); // שליחת הנתונים לתצוגה בעמוד האדמין
        } catch (error) {
            console.error("Error fetching data:", error);
            // טיפול בשגיאה ושליחת תגובת שגיאה ללקוח
            return res.status(500).send('Internal Server Error');
        }
    },
    adduser:async(req,res)=>{
        try {
            const users = require('../models/register'); // טעינה מחדש של מודל המשתמשים

            const user = await users.find().lean(); // שליפת כל הנתונים מהמודל של המשתמשים
            
            return res.render('addUSer', { layout: 'admin', users: user}); // שליחת הנתונים לתצוגה בעמוד הוספת משתמש
        } catch (error) {
            console.error("Error fetching data:", error);
            // טיפול בשגיאה ושליחת תגובת שגיאה ללקוח
            return res.status(500).send('Internal Server Error');
        }
    },
    getmanager:async(req,res)=>{
        try {
            const users = require('../models/register'); // טעינה מחדש של מודל המשתמשים

            const user = await users.find().lean(); // שליפת כל הנתונים מהמודל של המשתמשים
            
            return res.render('adminmanager', { layout: 'admin', users: user}); // שליחת הנתונים לתצוגה בעמוד ניהול האדמין
        } catch (error) {
            console.error("Error fetching data:", error);
            // טיפול בשגיאה ושליחת תגובת שגיאה
            // טיפול בשגיאה ושליחת תגובת שגיאה ללקוח
            return res.status(500).send('Internal Server Error');
        }
    },
    geturl:async(req,res)=>{
        try {
            const urls = require('../models/urlModel'); // טעינת מודל כתובות URL

            const url = await urls.find().lean(); // שליפת כל הנתונים מהמודל של כתובות ה-URL
            
            return res.render('geturl', { layout: 'admin', urls: url}); // שליחת הנתונים לתצוגה בעמוד של כתובות ה-URL
        } catch (error) {
            console.error("Error fetching data:", error);
            // טיפול בשגיאה ושליחת תגובת שגיאה ללקוח
            return res.status(500).send('Internal Server Error');
        }
    },
    getGemini:async(req,res)=>{
        try {
            const geminis = require('../models/gemini'); // טעינת מודל ג'מיני

            const gemini = await geminis.find().lean(); // שליפת כל הנתונים מהמודל של ג'מיני
            
            return res.render('geminiadmin', { layout: 'admin', geminis: gemini}); // שליחת הנתונים לתצוגה בעמוד ניהול ג'מיני
        } catch (error) {
            console.error("Error fetching data:", error);
            // טיפול בשגיאה ושליחת תגובת שגיאה ללקוח
            return res.status(500).send('Internal Server Error');
        }
    }
};
