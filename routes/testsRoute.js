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





//GET request to '/test'
router.get('/new', authenticateUser,function(req,res){
    res.render('tests_new.ejs', {userInfo:req.userInfo});
});



//GET request to '/result' : displaying all tests
router.get('/', authenticateUser,function(req,res){

    console.log("\n-GET request to '/tests'");
    
    try{
        if(typeof req.query.inspectID == 'undefined'){
            /* Approach 2 to find all matched tests */
            Test.find({creater: req.userInfo._id},function(err,matched){
                if(err){
                    console.log('Error: \n',err,'\n');
                    res.status(400).send(err);
                }

                else{
                    console.log('\nDisplaying all matched tests from user:' + req.userInfo._id);
                    console.log(matched);
                    res.render('tests.ejs',{data:matched, userInfo: req.userInfo});
                }
            });            
        }
        else {

            if(req.userInfo.role == 'admin' || req.query.inspectID == req.userInfo._id){
                
                Test.find({creater: req.query.inspectID},function(err,matched){
                    if(err){
                        console.log('Error: \n',err,'\n');
                        res.status(400).send(err);
                    }
    
                    else{
                        console.log('\nDisplaying all matched tests from user:' + req.userInfo._id);
                        console.log(matched);
                        res.render('tests.ejs',{data:matched, userInfo: req.userInfo});
                    }
                });
            }
            else {
                
                console.log('Access denied: restricted to admin');
                res.status(401).send('Access denied: restricted to admin!!!' + "\nINspectid: " + req.query.inspectID + "\nuserid: " + req.userInfo._id);
            
            }
            
        }
    }
    catch(err){
        console.log('Error: ',err);
        res.status(400).send('Error:' + err);
    }
    

});



//SHOW result 
router.get('/:test_id', authenticateUser, function(req,res){
    //res.send("inspecting result:" + req.params.id);
    //res.render('results_show.ejs', {data: outputs[req.params.id]});
    Test.findById(req.params.test_id, async function(err, found){
        if(err){
            console.log(err);
        }
        else {
            
            //protect id-specified route by validating the user's id
            if(toString(found.creater) == toString(req.userInfo._id) || req.userInfo.role === 'admin'){
                console.log("Displaying the test with id: " + req.params.test_id);
                console.log(found);
                console.log(req.userInfo);
                const {username, email} = await User.findById(found.creater);
                console.log(username);
                console.log(email);

                let createrInfo = {
                    name : username,
                    email : email
                }
              
                res.render('tests_show.ejs', {data: found, userInfo : req.userInfo, createrInfo : createrInfo});
            }
            else {
                console.log('Access denied: unauthorized!');
                res.status(401).send('Access denied!');
            }
            
            
            
        }
    });
});




//POST request to '/test'
router.post('/', authenticateUser, async function(req,res){
    //data made by users will be sent to here: req.body
    console.log('\n-POST request to /tests\n');
    console.log("Display: printing and storing the passed obj:");
    console.log(req.body);

    //assign user_id as the creater of this test
    req.body.creater = req.userInfo._id;

    // store data to database
    Test.create(req.body, function(err, savedTest){
        if(err) return console.log(err);
        else {
            console.log("The test is saved!");
            console.log(savedTest);

            User.findById(req.userInfo._id,function(err,foundUser){
                if(err){
                    console.log('Error: though test is saved, no user with user_id found')
                    res.status(300).send('Test is saved but no user found!');
                }
                else {
                    //save this test to user
                    foundUser.takenTests.push(savedTest._id);
                    foundUser.save(function(err){
                        if(err){
                            console.log('Error: though test is saved, failed to save test_id to user.');
                            res.status(300).send('Test is saved but failed to save takenTests within the user');
                        }
                        else{
                            console.log('Success: saving both takenTests and creater.');
                            res.json({
                                message:"test taken success",
                                saved_uid: foundUser._id,
                                saved_tid: savedTest._id
                            });
                        }
                    });
                    
                }
            });
            
             
        }
    });
    
    
});


//DELETE test
router.delete('/:test_id', authenticateUser, authenticateAdmin, async function(req,res){
    
    try{
        const testId = req.params.test_id;
        const foundTest = await Test.findById(testId);
        const createrId = foundTest.creater;
        

        //create user's reference
        const res1 = await User.updateOne({_id: createrId}, {$pull : {takenTests : testId}});
        const res2 = await Test.deleteOne({_id: testId});

        let str1 = "";
        let str2 = "";
        str1 += createrId;
        str2 += req.userInfo._id;
        //console.log(createrId);
        //console.log(req.userInfo._id);
        //console.log(typeof createrId);
        //console.log(typeof req.userInfo._id);
        //console.log(typeof str1);
        //console.log(typeof str2);

        //console.log(str1);
        //console.log(str2);

        //console.log(toString(createrId) == toString(req.userInfo._id));
        //console.log( createrId == req.userInfo._id);
        //console.log( createrId === req.userInfo._id);
        //console.log(str1 == str2);
        if(str1 == str2){
            res.redirect('/tests');
        }
        else{
            res.redirect('/tests?inspectID='+createrId);
        }
        
        
    }
    catch(err){
        res.status(400).send('Something went wrong' + err);
        console.log(err);
    }

   
    
});

module.exports = router;