// ייבוא החבילות הדרושות: selenium-webdriver לאוטומציה דפדפן ו-csv-writer לכתיבת קבצי CSV
const { Builder, By, until } = require('selenium-webdriver');
const { createObjectCsvWriter } = require('csv-writer');

module.exports = {
    // פונקציה אסינכרונית לסקרייפינג של כתבות
    scraper: async function scrapeArticles() {
        // יצירת דרייבר לדפדפן Chrome
        let driver = await new Builder().forBrowser('chrome').build();
        try {
            // ניתוב הדרייבר לכתובת המבוקשת
            await driver.get('https://www.foxnews.com/category/world/world-regions/israel');
            // סימון להמשך טעינת תוכן נוסף בעמוד
            let hasMore = true;
            // מונה לספירת הכתבות שנטענו
            let articlesCount = 0;

            // הגדרת כותב ה-CSV ומבנה הקובץ
            const csvWriter = createObjectCsvWriter({
                path: './articles.csv', // נתיב הקובץ
                append: false, // אין להוסיף לקובץ קיים, אלא ליצור מחדש
                header: [
                    {id: 'title', title: 'TITLE'},
                    {id: 'articleDesc', title: 'DESCRIPTION'}
                ]
            });

            // לולאה שתמשיך כל עוד יש תוכן נוסף לטעין ולא נטענו 200 כתבות
            while (hasMore && articlesCount < 200) {
                // מציאת כל הכתבות בעמוד
                let articles = await driver.findElements(By.css("article.article"));
                
                // עיבוד כל כתבה בנפרד
                for (let article of articles) {
                    if (articlesCount >= 200) {
                        hasMore = false;
                        break; // יציאה מהלולאה אם הגענו ל-200 כתבות
                    }
                    
                    // איסוף והדפסת כותרת ותיאור הכתבה
                    let title = await article.findElement(By.css("h4.title")).getText();
                    let articleDesc = await article.findElement(By.css("div.content")).getText();

                    // שמירת הכתבה בקובץ CSV
                    await csvWriter.writeRecords([{ title, articleDesc }]);
                    console.log(title); // הדפסת הכותרת לקונסול
                    console.log(articleDesc); // הדפסת התיאור לקונסול

                    articlesCount++; // עדכון מונה הכתבות
                }

                // ניסיון לטעון תוכן נוסף אם קיים כפתור 'טען עוד'
                if (hasMore) {
                    let loadMoreButton = await driver.findElements(By.css("div.load-more.js-load-more"));
                    if (loadMoreButton.length > 0) {
                        await driver.execute
                        // פעולת גלילה לכפתור 'טען עוד' ולחיצה עליו
                        await driver.executeScript("arguments[0].scrollIntoView(true);", loadMoreButton[0]);
                        await loadMoreButton[0].click();
                        // המתנה לטעינת התוכן הנוסף
                        await driver.sleep(2000); 
                    } else {
                        // אם אין כפתור 'טען עוד', משמע שאין עוד תוכן לטעין
                        hasMore = false;
                    }
                }
            }
        } catch (error) {
            // במקרה של שגיאה בתהליך, הדפסת השגיאה
            console.error('An error occurred:', error);
        } finally {
            // סגירת הדרייבר והדפדפן בסיום התהליך, לשחרור משאבים
            await driver.quit();
        }
    }
}
