// טעינת משתני סביבה מקובץ .env
require('dotenv').config()
// ייבוא המודול של מודל המשתמשים
const users = require('../models/register')
// ייבוא החבילה להצפנת סיסמאות
const bcrypt = require('bcrypt')
// ייבוא חבילה ליצירת ואימות טוקנים
const jwt = require('jsonwebtoken')
// ייבוא חבילה לטיפול בהעלאת קבצים
const multer = require('multer')

// יצוא אובייקט עם פונקציות לרישום והתחברות
module.exports = {
    // פונקציה לרישום משתמשים
    register: (req, res) => {
        try {
            // קריאה לפרטי המשתמש מגוף הבקשה
            const { Email, Password, Username, birthdate, phon, profile } = req.body
            // בדיקה אם המשתמש כבר קיים במסד נתונים
            users.find({ Email }).then((results) => {
                if (results.length > 0)
                    return res.status(401).json({ msg: "that user is already exist" })
                // הצפנת הסיסמה לפני שמירתה במסד הנתונים
                bcrypt.hash(Password, 10).then((hashPass) => {
                    // יצירת רשומה חדשה במסד הנתונים עם הסיסמה המוצפנת
                    users.insertMany({ Username, Email, Password: hashPass, birthdate, phon, profile: req.file.filename }).then((result) => {
                        // הפניה לדף ההתחברות לאחר הרישום
                        return res.status(200).redirect('login')
                    })
                })
            })
        } catch (error) {
            console.log(error)
        }
    },
    // פונקציה להתחברות משתמשים
    Login: (req, res) => {
        const { Email, Password, isAdmin } = req.body;
        // חיפוש המשתמש לפי האימייל
        users.findOne({ Email }).then((result) => {
            if (!result) {
                // אם המשתמש לא נמצא, שלח הודעת שגיאה
                return res.status(401).json({ msg: "not exist" });
            }
            const hashPass = result.Password;
            // השוואת הסיסמה המוצפנת עם הסיסמה שהוזנה
            bcrypt.compare(Password, hashPass).then((status) => {
                if (!status) {
                    // אם ההשוואה נכשלת, הפנה חזרה לדף ההתחברות
                    return res.redirect('/login')
                }
                // יצירת טוקן למשתמש לאחר התחברות מוצלחת
                const token = jwt.sign({ Email, MyUser: result }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
                                // קביעת פרטי המשתמש לשמירה בסשן
                                const UserData = { 
                                Email, 
                                token,
                                userName: result.Username, // שם המשתמש מהתוצאה
                                profilePicture: result.profile, // תמונת הפרופיל מהתוצאה
                                isAdmin // האם המשתמש הוא מנהל
                            };
                              // שמירת פרטי המשתמש בסשן
                            req.session.User = UserData;
                              // הפניה לדף המתאים לפי סטטוס המשתמש (מנהל או לא)
                            if(result.isAdmin){
                                  return res.redirect('/admin'); // אם המשתמש הוא מנהל
                            } else {
                                  return res.redirect('/gemini'); // אם המשתמש אינו מנהל
                            }
                              // פונקציה זו אינה נדרשת בפועל מכיוון שההפניות למעלה תמיד יכללו return
                              //res.redirect('/gemini'); 
                            }).catch((error) => {
                              // במקרה של שגיאה בתהליך השוואת הסיסמה
                                console.error('Error processing your request:', error);
                                res.status(500).json({ msg: "An error occurred during password comparison" });
                            });
                        }).catch((error) => {
                          // במקרה של שגיאה בחיפוש המשתמש
                            console.error(error);
                            res.status(500).json({ msg: "An error occurred while finding the user" });
                        });
                    }
                };