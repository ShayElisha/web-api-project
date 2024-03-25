// Load environment variables from .env file
require('dotenv').config();

// Import necessary libraries and middleware
const express = require('express');
const morgan = require('morgan'); // Logging middleware
const mongoose = require('mongoose'); // MongoDB object modeling tool
const session = require('express-session'); // Session middleware for handling user sessions
const hbs = require('express-handlebars'); // Handlebars view engine for Express
const jwt = require('jsonwebtoken'); // Used for generating and verifying JSON Web Tokens
const mongoStore = require('connect-mongo'); // MongoDB session store for Connect and Express
const app = express(); // Create an Express application
const axios=require('axios');
const cheerio= require('cheerio')

// Import route handlers
const geminiroute = require('./api/v1/routes/gemini');
const userRoute = require('./api/v1/routes/users');
const contactRoute = require('./api/v1/routes/contact');
const adminRoute = require('./api/v1/routes/admin');
const shorturlRoute = require('./api/v1/routes/shorturl');


// Import middleware for authentication
const auth = require('./api/v1/middleware/authSession');

// Middleware for logging HTTP requests
app.use(morgan('dev'));
// Middleware for parsing JSON and urlencoded data sent by clients
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Array of IPs allowed to access the server
const servers1 = ['10.21.123.23', '::1', '10.12.12.10'];
// Middleware to check if the request comes from an allowed IP
app.use((req, res, next) => {
    let i;
    for (i = 0; i < servers1.length; i++) {
        if (req.ip == servers1[i])
            break;
    if (i == servers1.length)
        return res.status(403).json({ msg: "Can't recognize The Request" });
    else
        next();
    }
});


// Session configuration
const twentyMin = 1000 * 60 * 20;
app.use(session({
    secret: 'shay2024',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: twentyMin },
    store: mongoStore.create({ mongoUrl: process.env.CONN_DB + "SessionDB" })
}));
app.get('/session-count', async (req, res) => {
    const store = req.sessionStore;
    store.all((error, sessions) => {
        if (error) {
            console.error(error);
            res.status(500).send('Server Error');
            return;
        }
        res.json({ count: sessions.length }); // שליחת מספר הסשנים כתגובה בפורמט JSON
    });
});

// Connect to MongoDB
const connDb = process.env.CONN_DB + "users";
mongoose.connect(connDb).then((status) => {
    if (status)
        console.log("Connected to DB");
    else
        console.log("Can't connect");
});

// Set up Handlebars as the view engine
app.set('views', './views');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}));
app.set('view engine', 'hbs');

// Serve static files from the 'static' directory
app.use(express.static('static'));
// Serve static files from the 'pub' directory under the '/assets' path
app.use('/assets', express.static('pub'));

// Set up routes with optional authentication middleware
app.use('/gemini', auth, geminiroute);
app.use('/', userRoute);
app.use('/contact', auth, contactRoute);
app.use('/admin', auth, adminRoute);
app.use('/shortURL',auth, shorturlRoute);
app.get('/shortURL', (req, res) => {
    return res.render('shortURL', shortURL);
});
// Route for checking user session info
app.get('/api/session', (req, res) => {
    if (req.session.User) {
        const { userName, profilePicture } = req.session.User;
        res.json({ loggedIn: true, userName, profilePicture });
    } else {
        res.json({ loggedIn: false });
    }
});

// Basic routes for serving pages

app.get('/login', (req, res) => {
    return res.render('login', { layout: 'main', css: 'main.css' });
});

app.get('/signup', (req, res) => {
    return res.render('signup', { layout: 'main', css: 'main.css' });
});

app.get('/contact', (req, res) => {
    return res.render('contact', { layout: 'main', css: 'main.css' });
});






// הגדרת הנתיב '/' עבור בקשות GET, עם התייחסות אסינכרונית.
app.get('/', async (req, res) => {
    try {
        const articles = []; // מערך לאחסון המאמרים שנמצאים.

        // כתובת האתר ממנו אנו רוצים לגרור מידע.
        const website = "https://www.now14.co.il";

        // שליחת בקשת HTTP GET אסינכרונית לכתובת האתר ושמירת התגובה.
        const response = await axios.get(website);

        // קריאת תוכן התגובה, שהוא קוד ה-HTML של הדף.
        const html = response.data;

        // טעינת קוד ה-HTML לתוך cheerio לניתוח והפעלת שאילתות jQuery אילו.
        const $ = cheerio.load(html);

        // עבור כל אלמנט בדף שמתאים למחלקה 'mibzak-unit'.
        $('.mibzak-unit').each(function(){
            // איתור וקריאת הטקסט של הקישור (התואר) וטיהורו מרווחים עודפים.
            const title = $(this).find('a').text().trim();

            // איתור הכתובת של הקישור ושמירתה.
            let link = $(this).find('a').attr('href');

            // בדיקה אם הקישור אינו מכיל התחלה של כתובת מלאה.
            if (!link.startsWith('http')) {
                link = website + link; // המרה לכתובת מלאה על ידי הוספת הכתובת הבסיסית.
            }

            // הוספת המאמר (כולל הכותרת והקישור) למערך המאמרים.
            articles.push({
                title,
                link
            });
        });

        // שליחת המאמרים בתגובה דרך מנגנון התצוגה, עם עיצוב ומערך המאמרים.
        res.render('home', {layout: 'main', css: 'main.css', articles})
    } catch (error) {
        // במקרה של שגיאה, הדפסת השגיאה ושליחת תגובת שגיאה למשתמש.
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Logout route, destroys session
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("An error occurred while logging out.");
        }
        res.redirect('/');
    });
});

// Catch-all route for undefined paths
app.use('*', (req, res) => {
    return res.status(404).json({ msg: "Not Found Page!" });
});

const cors = require('cors');
app.use(cors());

// Export the app for use in other files
module.exports = app;
