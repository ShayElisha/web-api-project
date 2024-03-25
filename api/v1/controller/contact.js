require('dotenv').config();
// ייבוא המודול transporter מתיקייה אחרת (מודל הקשר)
const transporter= require('../models/contact')

// יצוא אובייקט המכיל פונקציה בשם sendMail
module.exports={

     // הגדרת הפונקציה sendMail כפונקציה אסינכרונית שמקבלת בקשה ותגובה
     sendMail: async(req,res)=>{
          
          // הוצאת משתנים מתוך גוף הבקשה
          const {Email,name,subject,Text}=req.body
          try{
          // שליחת המייל הראשון עם פרטי התגובה למשתמש
          const info= await transporter.sendMail({
               from: process.env.MAIL_USER, // כתובת השולח
               to: Email, // רשימת המקבלים
               subject: `receive: ${subject}`, // נושא ההודעה
               text: `Hello ${name}!
Thank you for your request/report, you will receive an answer within 5 working days
               
Thank you for your patience and understanding.
               By-Gemini Group
               
This mail has been sent from a '''no-reply'' e-mail address. Please do not reply to this e-mail. We will not receive your reply and therefore we will not answer your questions.
               ` // גוף ההודעה
          })
          // שליחת המייל השני עם פרטי הבקשה לאדם המתאים בארגון
          const info1= await transporter.sendMail({
               from: Email, // כתובת השולח
               to: process.env.MAIL_USER, // רשימת המקבלים
               subject: `receive: ${subject}`, // נושא ההודעה
               text: `from ${name},
               ${Text}`, // גוף ההודעה
          })
          // הדפסת הודעה על שליחת המייל השני
          console.log("Message sent: %s", info1.messageId);
          // הדפסת הודעה על שליחת המייל הראשון
          console.log("Message sent: %s", info.messageId);
          // החזרת המשתמש לדף הבית לאחר השלמת התהליך
          return res.redirect('/contact')

     }catch(error){
          // הדפסת השגיאה במקרה של כישלון
          console.log(error)
     }
}
}
