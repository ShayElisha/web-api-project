// ייבוא חבילת jsonwebtoken לשימוש בפונקציות יצירת ואימות טוקנים
const jwt = require('jsonwebtoken');

// מודול ביניים (middleware) שמבצע בדיקה או פעולה על הבקשה לפני שהיא מגיעה לראוט הסופי
module.exports = (req, res, next) => {
     try {
          // אם אין אובייקט סשן קיים, יוצר אחד חדש
          if (!req.session) {
               req.session = {};
          }
          // אם אין משתמש מחובר כרגע (כלומר, אין פרטי משתמש בסשן), נשלח את המשתמש לדף ההתחברות
          else if (req.session.User == undefined) {
               return res.redirect('/login');
          }
          
          // אם הבדיקות עברו, ממשיכים לפונקציה הבאה בשרשרת הטיפול בבקשה
          next();

     } catch (error) {
          // במקרה של שגיאה, הדפסת השגיאה והפנייה של המשתמש חזרה לדף ההתחברות
          console.log(error);
          return res.redirect('/login');
     }
}
