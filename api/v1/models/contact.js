// טוען את חבילת dotenv לניהול משתני סביבה בצורה בטוחה ונסתרת
require('dotenv').config(); 

// ייבוא חבילת nodemailer שמספקת יכולת לשלוח אימיילים בקלות ב-JavaScript
var nodemailer = require('nodemailer');

// יצירת אובייקט המסדר (transporter) שישמש לשליחת האימיילים
// הגדרה של השירות (במקרה זה Gmail), ואימות המשתמש דרך משתני סביבה
var transporter = nodemailer.createTransport({
    service: 'gmail', // שימוש ב-Gmail כספק שירות לאימייל
    auth: {
      user: process.env.MAIL_USER, // שם המשתמש מתוך משתנה הסביבה MAIL_USER
      pass: process.env.MAIL_PASS // הסיסמא מתוך משתנה הסביבה MAIL_PASS
    }
});

// ייצוא האובייקט transporter כדי שניתן יהיה להשתמש בו בקבצים אחרים באפליקציה
// מאפשר לשלוח אימיילים מכל מקום בקוד שמייבא את האובייקט הזה
module.exports = transporter;
