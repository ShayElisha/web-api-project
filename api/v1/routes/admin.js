const router= require('express').Router()
const users = require('../models/register');
const urls = require('../models/urlModel');
const gemini = require('../models/gemini');

const {getinfo,adduser,getmanager,geturl,getGemini}=require('../controller/admin')



router.get('/', getinfo);
router.get('/addUSer', adduser);
router.get('/adminmanager', getmanager);
router.get('/urls', geturl);
router.get('/gemini', getGemini);
router.post('/addUSer/:userId', async (req, res) => {
    // תיקון: השימוש ב-req.params.userId במקום req.params.Email
    const userId = req.params.userId; // תיקון: השימוש במזהה המשתמש שנשלח ב-URL
    await users.findOneAndUpdate({ _id: userId }, { $set: { isAdmin: true } });

    return res.send({ success: true, message: 'User updated to admin successfully' });
});
router.delete('/addUSer/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // קבלת המזהה מה-URL
        await users.findByIdAndDelete(userId); // מחיקת המשתמש מהדאטאבייס
        return res.send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send({ success: false, message: 'Error deleting user' });
    }
});
router.delete('/urls/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // קבלת המזהה מה-URL
        await urls.findByIdAndDelete(userId); // מחיקת המשתמש מהדאטאבייס
        return res.send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send({ success: false, message: 'Error deleting user' });
    }
});
router.delete('/gemini/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // קבלת המזהה מה-URL
        await gemini.findByIdAndDelete(userId); // מחיקת המשתמש מהדאטאבייס
        return res.send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).send({ success: false, message: 'Error deleting user' });
    }
});




module.exports=router