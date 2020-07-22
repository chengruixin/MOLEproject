const express = require('express');
const router = express.Router();
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const methodOverride = require('method-override');  //used for PUT, DELETE requests
//const port = process.env.PORT || '3000';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

const Test = require('../models/test.js');
const User = require('../models/user.js');

const authenticateUser = require('../authenticateUser.js');
const authenticateAdmin = require('../authenticateAdmin.js');


router.get('/checkStatus', async (req,res)=>{
    console.log('\nGET request to /checkStatus');

    try{
        if(typeof req.cookies.auth_token == "undefined"){
            console.log('Check result: token not found\n');
            res.status(204).send("Token not found");
        }
        else{
            const verified = jwt.verify(req.cookies.auth_token, process.env.TOKEN_SECRET);
            const foundUser = await User.findById(verified._id);
            if(foundUser){
                console.log('Access accepted:  ');
                console.log(verified,'\n');
                res.json({
                    user_id : foundUser._id,
                    username : foundUser.username,
                    role: foundUser.role
                });
            }

            else{
                console.log('Access denied: no matched user\n')
                res.status(204).send("Invalid token");
            }
        }
    }catch(err){
        console.log('Error: ' + err,'\n');
        res.status(400).send({
            message: "Error",
            Error: err
        });
    }
});

//GET request to '/'
router.get('/',authenticateUser,function(req,res){
    res.render('homepage.ejs',{userInfo: req.userInfo});
});


// user auth routes
router.get('/signup', authenticateUser,(req,res)=>{
    res.render('signup.ejs', {userInfo: req.userInfo});
});

router.post('/signup', authenticateUser,async (req,res)=>{
    console.log("\n POST request to '/signup'");
    
    console.log(req.body);
    
    
    let requestUser = req.body;
    
    

    let obj = {
        message : []
    }
    //check existence of username and email
    let foundUsername = await User.findOne({username : requestUser.username});
    let foundEmail = await User.findOne({email : requestUser.email});

    if(foundUsername){
        obj.message.push("Username existed!");
    }

    if(foundEmail){
        obj.message.push("Email existed!");
    }

    if( !foundEmail && !foundUsername){
        obj.message.push("Registered successfully!");

        //hash passowrd
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(requestUser.password, salt);

        const new_user = new User({
            username : requestUser.username,
            email : requestUser.email,
            password : hashedPassword,
        });

        //check if the request is asking to be admin
        if(requestUser.role === 'admin'){
            new_user.role = 'admin';
        }

        //ready to save to database
        try{
            const savedUser = await new_user.save();

            // assign token to that user by cookie
            const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
            console.log("Create token for new user: " + token);
            res.cookie('auth_token', token);

            res.json({
                savedUser : savedUser,
                message : obj.message
            });

            console.log("User register successfully!");
            console.log(savedUser,'\n');

        }catch(err){
            console.log("Error:");
            console.log(err,'\n');
            res.status(400).send(err);
            
        }   
    }
    else{
        console.log("Error:");
        console.log(obj,'\n');
        res.status(400).send(obj);
    }

});


router.get('/login', authenticateUser,(req,res)=>{
   
    res.render('login.ejs', {userInfo : req.userInfo});
});

router.post('/login', authenticateUser,async (req,res)=>{

    

    console.log("\nPOST request to '/login'");
    console.log(req.body);
    
    //check whether ther is matched email
    
    const foundUser = await User.findOne({email : req.body.email});
    
    if(!foundUser){
        console.log("Access denied: incorrect email\n");
        res.status(400).send({
            message : "not matched email or password"
        });
    }
    else {
        //first to validate the password
        const isPassed = await bcrypt.compare(req.body.password, foundUser.password);
        if(!isPassed){
            console.log("Access denied: incorrect password\n");
            res.status(400).send({
                message : "incorrect password!"
            });
        }
        else {
            //assign token to that user
            const token = jwt.sign({_id: foundUser._id}, process.env.TOKEN_SECRET);
            console.log("Create token: " + token);
            res.cookie('auth_token', token);
            //{
            //    expires : new Date(Date.now + 900000),
            //    httpOnly : true
            //}
            res.send({
                message : "Logged in!",
                token : token
            });

            
        }
    }

    
});

router.get('/logout',authenticateUser,(req,res)=>{
    res.clearCookie('auth_token');
    res.redirect('/?logout=success');
});

router.get('/users', authenticateUser, authenticateAdmin,async (req,res)=>{
    //find all users except himself
    console.log('\n-GET request to /users');
    const foundUsers = await User.find({ _id: { $ne : req.userInfo._id } });
    res.render('users.ejs', {data:foundUsers, userInfo: req.userInfo});
});


module.exports = router;