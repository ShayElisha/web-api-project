require('dotenv').config();
// ייבוא החבילה של GoogleGenerativeAI לשימוש בAI גנרטיבי והמודול של gemini מתיקייה נתיב יחסי
const { GoogleGenerativeAI}  = require("@google/generative-ai");
const gemini= require('../models/gemini');

// יצוא אובייקט המכיל מספר פונקציות
module.exports={
     // פונקציה להפקת טקסט באמצעות מודל AI
     getText: async (req, res) => {
          // יצירת אינסטנס של GoogleGenerativeAI עם מפתח API
          const genAI = new GoogleGenerativeAI(process.env.API_KEY);
          // בחירת המודל 'gemini-pro' לשימוש
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          // קבלת הפרומפט מהבקשה
          const prompt = req.body.Prompt;
          console.log(req.body); // הדפסת גוף הבקשה לקונסול
          // יצירת תוכן באמצעות המודל והפרומפט
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = await response.text(); // קריאה אסינכרונית לתוכן הטקסט
          console.log(text); // הדפסת הטקסט לקונסול
          // ולידציה של קיום המשתמש והאימייל בסשן
          if (!req.session || !req.session.User || !req.session.User.Email) {
               return res.status(400).send("User email is missing."); // שגיאה אם חסר אימייל
          }
          const userEmail = req.session.User.Email; // שמירת האימייל לשימוש מאוחר יותר
          try {
              // שמירת השאלה והתשובה במסד הנתונים
              const data = await gemini.create({ // שימוש ב`create` ליצירת רשומה בודדת
                    question: prompt,
                    answer: text,
                  userEmail: userEmail // הוספת האימייל לרשומה
               });
              return res.status(200).json({ text }); // החזרת הטקסט בתגובה
          } catch (error) {
              console.error("Failed to insert data into gemini:", error); // הדפסת שגיאה בכישלון
              return res.status(500).send("Failed to save data."); // החזרת שגיאת שרת
          }
     },
     // פונקציה להצגת דף הgemini
     textGenerator: (req, res) => {
          return res.status(200).render('gemini', {css: 'main.css'}); // רינדור של הדף עם הסטייל 'main.css'
     },
          // פונקציה להעלאת נתונים למסד הנתונים
          uploadData: async (req, res) => {
               try {
                   // קבלת הפרומפט והטקסט מגוף הבקשה
                    const prompt = req.body.Prompt;
                    const text = req.body.text;
                   // הוספת הנתונים למסד הנתונים באמצעות המודול gemini
                    const data = await gemini.insertMany({ question: prompt, answer: text });
                   // החזרת הנתונים שנשמרו למשתמש
                    return res.status(200).json(data);
               } catch (error) {
                    console.error(error); // הדפסת שגיאות במקרה של כישלון
                    return res.status(500).json({ error: 'Internal Server Error' }); // החזרת שגיאת שרת
               }
          },
          // פונקציה לקבלת כל התשובות של משתמש מסוים
          getAllAnswers: (req, res) => {
               // הגדרת המשתמש לפי האימייל שבסשן
               const userEmail = req.session.User.Email;
               // חיפוש במסד הנתונים לפי אימייל המשתמש
               gemini.find({userEmail: userEmail}).lean().then((data) => {
                    console.log(data); // הדפסת הנתונים לקונסול
                    // רינדור של דף התשובות עם הנתונים הרלוונטיים
                    return res.status(200).render('geminiall', {layout: 'main', css: 'main.css', title: "gemini", data});
               }).catch((error) => {
                    console.error(error); // הדפסת שגיאה במקרה של כישלון
                    return res.status(500).send("Failed to retrieve data."); // החזרת שגיאת שרת
               });
          }
     };
     
