const express = require('express');
const router = express.Router();
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const methodOverride = require('method-override');  //used for PUT, DELETE requests
//const port = process.env.PORT || '3000';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');
const emailer = require('../sendEmail.js');
const Test = require('../models/test.js');
const User = require('../models/user.js');

const authenticateUser = require('../authenticateUser.js');
const authenticateAdmin = require('../authenticateAdmin.js');

router.get('/', authenticateUser, async (req,res)=>{
    const foundUser = await User.findById(req.userInfo._id);
    let obj = {
        username : foundUser.username,
        email : foundUser.email
    }
    res.render('profile.ejs', {data: obj, userInfo: req.userInfo});
});

router.put('/', authenticateUser, async (req,res)=>{
    console.log('\n-PUT request to /profile');
    try{
        const foundUser = await User.findOne(req.body);
        if(foundUser){
            res.status(400).send('Fail to update: repeated input!');
        }
        else{
            const updated = await User.updateOne({_id: req.userInfo._id}, { $set : req.body});
            res.send('Upate successfully!');
        }
        
        
    }
    catch(err){
        console.log(err);
        res.status(500).send('Something went wront', err);
    }
});

router.put('/password', authenticateUser, async(req,res)=>{
    console.log('\n-PUT request to /profile/password');
    try{
        //to check whether this is validated password.
        const foundUser = await User.findById(req.userInfo._id);
        const isPassed = await bcrypt.compare(req.body.curPass, foundUser.password);

        if(!isPassed){
            res.status(401).send('Incorrect password');
        }
        else {

            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPass, salt);

            //save new password
            const updated = await User.updateOne({_id: foundUser._id}, { $set: {password : hashedPassword}});
            res.send('Update password successfully!');
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send('Something went wront', err);
    }
});

router.get('/password/reset/:emailToken', (req,res) => {
    try {
        const verified = jwt.verify(req.params.emailToken, process.env.RESET_PASSWORD);
        User.findOne({email : verified.email}, (err, found) => {
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            else {
                if(found.resetToken != req.params.emailToken){
                    // res.status(400).send("Invalid auth info");
                    res.redirect('/?reset=error');
                }
                else {
                    res.render('reset-password.ejs');
                }
            }
        })
    }
    catch (err){
        res.status(400).send('Invalid auth info or invliad token or expired token, Please re-send email!');
    }
    
});

router.post('/password/reset/:emailToken' ,async (req,res)=>{
    try{
        const verified = jwt.verify(req.params.emailToken, process.env.RESET_PASSWORD); 
        const found = await User.findOne({email : verified.email});
        
        
        //first : check the valid reset token in user database
        if(found.resetToken !== req.params.emailToken){
            res.sendStatus(400);
        }
        else {
            //first: check whether new password is the same as old password
            const isSame = await bcrypt.compare(req.body.newPassword, found.password);
            // const isPassed = await bcrypt.compare(req.body.curPass, foundUser.password);

            
            if(isSame) {
                res.json({
                    status : -1,
                    message : "New password cannot be the same as old one",
                    token : found.resetToken
                })
            }
            else {
                console.log(req.body.newPassword);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

                //save new password
                const updated = await User.updateOne({email: verified.email}, { $set: {password : hashedPassword, resetToken : ''}});
                res.json({
                    status : 1,
                    message : updated
                });
            }
        }
        
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server error!");
    }
    
})
router.get('/account-recovery', authenticateUser, (req, res) => {
    res.render('account-recovery.ejs', {userInfo : req.userInfo});
});

router.post('/account-recovery', async (req, res) => {
    try {
        const resetUser = await User.findOne({email : req.body.email});
        console.log(req.hostname);
        console.log(req.path);

        
        
        if(!resetUser) {
            console.log("email not sent!!!");
            res.json({
                mess: "-1",
                hostname : req.hostname,
                path: req.path
            });
        }

        else {
            const token = jwt.sign({ email: resetUser.email }, process.env.RESET_PASSWORD, {expiresIn : "20m"});
            await User.updateOne({email : resetUser.email}, { $set: {resetToken : token}});
            await emailer(resetUser.email, token, req.hostname).catch(console.error);
            console.log("email sent!!!");

            res.json({
                mess : "1",
                hostname : req.hostname,
                path : req.path
            });
        }

        //res.json({data: email});
    }

    catch(err){
        console.log(err);
        res.status(500).send('Something went wront', err);
    }
});





module.exports = router;

