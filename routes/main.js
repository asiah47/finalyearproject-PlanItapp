// Create a new router
const express = require("express")
const router = express.Router()

// Handle the routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
            res.send('You Are Now Logged Out. <a href='+'./'+'>Home</a>');
        })
 })

// Export the router object so index.js can access it
module.exports = router;