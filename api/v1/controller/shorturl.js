// ייבוא מודול של מודל ה-URL
const Url = require('../models/urlModel');

// יצוא אובייקט עם פונקציות לטיפול ב-URLs
module.exports = {
    // פונקציה ליצירת URL מקוצר
    generateUrl: async (req, res) => {
        try {
            // בדיקה אם נשלח URL לטיפול
            if (!req.body.fullUrl) {
                return res.status(400).send('No URL provided');
            }

            // בדיקה האם ה-URL כבר קיים במסד הנתונים
            let existingUrl = await Url.findOne({ fullUrl: req.body.fullUrl });
            if (existingUrl) {
                // אם ה-URL כבר קיים, ניתן להחזיר אותו או לעשות רידיירקט
                return res.redirect('/shortURL');
            }

            // אם ה-URL לא קיים, יוצרים אותו חדש ושומרים במסד הנתונים
            const url = new Url({ fullUrl: req.body.fullUrl });
            await url.save();
            res.redirect('/shortURL'); // הפניה לדף של ה-URL המקוצר
        } catch (error) {
            // במקרה של שגיאה, שולחים הודעת שגיאה כללית
            res.status(500).send('Invalid URL');
        }
    },

    // פונקציה לקבלת כל ה-URLs
    getUrl: async (req, res) => {
        try {
            // שליפת כל ה-URLs מהמסד
            const urls = await Url.find();
            // המרת כל העצמים לפורמט שניתן לעבוד איתו בתבנית
            const urlsForTemplate = urls.map(url => url.toObject());
            // שליחת הנתונים לתבנית להצגה
            res.render('shortURL', { urls: urlsForTemplate });
        } catch (error) {
            // במקרה של שגיאה, שולחים הודעת שגיאה כללית
            res.status(500).send('Internal server error');
        }
    },

    // פונקציה להפניה דרך URL מקוצר
    shorten: async (req, res) => {
        try {
            // קבלת המזהה המקוצר מה-URL
            const shortUrl = req.params.shortUrl; 
            console.log(`Attempting to shorten URL: ${req.params.shortUrl}`);

            // חיפוש ה-URL במסד נתונים לפי המזהה המקוצר
            const url = await Url.findOne({ shortUrl });
            
            // במקרה וה-URL לא נמצא, שולחים הודעת שגיאה
            if (!url) {
                return res.status(404).send('URL not found');
            }

            // עדכון מונה הקליקים ושמירת השינוי
            url.clicks++;
            await url.save();

                        // הפניה ל-URL המלא מהדטה ששמורה במסד הנתונים
                        res.redirect(url.fullUrl);
                    } catch (error) {
                        // במקרה של שגיאה בתהליך, הדפסת השגיאה לקונסול ושליחת הודעת שגיאה למשתמש
                        console.error('Error processing your request:', error);
                        res.status(500).send('Error processing your request');
                    }
                }
    };
            
