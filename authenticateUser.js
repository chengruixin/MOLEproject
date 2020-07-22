//const express = require('express');
//const router = express.Router();
//const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
//const methodOverride = require('method-override');  //used for PUT, DELETE requests
//const port = process.env.PORT || '3000';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

const Test = require('./models/test.js');
const User = require('./models/user.js');

module.exports = async function authenticateUser (req,res,next){
    
    try{
        if(typeof req.cookies.auth_token == 'undefined'){
            const pathname = req.originalUrl.split('?')[0];
            if(pathname == '/' || pathname == '/login' || pathname == '/signup' || pathname == '/profile/account-recovery'){
                console.log('\nAccess acceted as none identity users');
                req.userInfo = new Object();
                req.userInfo.isLoggedIn = false;
                next();
            }
            else{
                console.log("fasdf", req.pathname);
                console.log(req.originalUrl);
                console.log('\nAccess denied: token nnot found\n');
                res.status(401).redirect('/login?attempt='+req.originalUrl+'&access=rejected');
            }
            
        }
        else {
            const verified = jwt.verify(req.cookies.auth_token, process.env.TOKEN_SECRET);

            const foundUser = await User.findById(verified._id);

            if(foundUser){
                console.log('\nAccess accepted:  ');
                console.log(verified,'\n');
                req.userInfo = new Object();
                req.userInfo.isLoggedIn = true;
                req.userInfo._id = foundUser._id;
                req.userInfo.username = foundUser.username;
                req.userInfo.role = foundUser.role;
                next();
                console.log('go to next');
            }

            else{
                //clear that auth_token
                res.clearCookie('auth_token');
                console.log('\nAccess denied: no matched user\n')
                res.status(401).redirect('/login?attempt='+req.url+'&access=rejected');
            }
            
            
        }
    }
    catch(err){
        console.log('\nError: ' + err,'\n');
        res.status(400).send({
            message: "Error",
            Error: err
        });
    }
}