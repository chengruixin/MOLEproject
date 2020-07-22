/* 
    Routes settings: 
*/

//middleware 
//async function authenticateUser (req,res,next){
    
//    try{
//        if(typeof req.cookies.auth_token == 'undefined'){
//            const pathname = req.originalUrl.split('?')[0];
//            if(pathname == '/' || pathname == '/login' || pathname == '/signup'){
//                console.log('\nAccess acceted as none identity users');
//                req.userInfo = new Object();
//                req.userInfo.isLoggedIn = false;
//                next();
//            }
//            else{
//                console.log(req.body.pathname);
//                console.log('\nAccess denied: token nnot found\n');
//                res.status(401).redirect('/login?attempt='+req.url+'&access=rejected');
//            }
            
//        }
//        else {
//            const verified = jwt.verify(req.cookies.auth_token, process.env.TOKEN_SECRET);

//            const foundUser = await User.findById(verified._id);

//            if(foundUser){
//                console.log('\nAccess accepted:  ');
//                console.log(verified,'\n');
//                req.userInfo = new Object();
//                req.userInfo.isLoggedIn = true;
//                req.userInfo._id = foundUser._id;
//                req.userInfo.username = foundUser.username;
//                req.userInfo.role = foundUser.role;
//                next();
//            }

//            else{
//                console.log('\nAccess denied: no matched user\n')
//                res.status(401).redirect('/login?attempt='+req.url+'&access=rejected');
//            }
            
            
//        }
//    }
//    catch(err){
//        console.log('\nError: ' + err,'\n');
//        res.status(400).send({
//            message: "Error",
//            Error: err
//        });
//    }
//}

//function authenticateAdmin(req,res,next){
//    try{
//        if(typeof req.userInfo.role == 'undefined'){
//            res.status(401).send('Access Denied: no user role found');
//        }
//        else{
//            if(req.userInfo.role != 'admin'){
//                res.status(401).send('Access Denied: restricted to admin');
//            }
//            else {
//                console.log('Access Accepted with admin identity');
//                next();
//            }
//        }
//    }
//    catch(err){
//        console.log('Error: ',err);
//        res.status(500).send('Something went wrong' + err);
//    }
//}


//app.get('/checkStatus', async (req,res)=>{
//    console.log('\nGET request to /checkStatus');

//    try{
//        if(typeof req.cookies.auth_token == "undefined"){
//            console.log('Check result: token not found\n');
//            res.status(204).send("Token not found");
//        }
//        else{
//            const verified = jwt.verify(req.cookies.auth_token, process.env.TOKEN_SECRET);
//            const foundUser = await User.findById(verified._id);
//            if(foundUser){
//                console.log('Access accepted:  ');
//                console.log(verified,'\n');
//                res.json({
//                    user_id : foundUser._id,
//                    username : foundUser.username,
//                    role: foundUser.role
//                });
//            }

//            else{
//                console.log('Access denied: no matched user\n')
//                res.status(204).send("Invalid token");
//            }
//        }
//    }catch(err){
//        console.log('Error: ' + err,'\n');
//        res.status(400).send({
//            message: "Error",
//            Error: err
//        });
//    }
//});

////GET request to '/'
//app.get('/',authenticateUser,function(req,res){
//    res.render('homepage.ejs',{userInfo: req.userInfo});
//});


//// user auth routes
//app.get('/signup', authenticateUser,(req,res)=>{
//    res.render('signup.ejs', {userInfo: req.userInfo});
//});

//app.post('/signup', authenticateUser,async (req,res)=>{
//    console.log("\n POST request to '/signup'");
    
//    console.log(req.body);
    
    
//    let requestUser = req.body;
    
//    let validationResult = validate(requestUser);
//    if(validationResult.status != 200){
//        console.log("Error:");
//        console.log({
//            message: "validation failed",
//            data : validationResult
//        },'\n');
//        res.status(400).send({
            
//            message: "validation failed",
//            data : validationResult
//        });
//    }
//    else{
//        let obj = {
//            message : []
//        }
//        //check existence of username and email
//        let foundUsername = await User.findOne({username : requestUser.username});
//        let foundEmail = await User.findOne({email : requestUser.email});

//        if(foundUsername){
//            obj.message.push("Username existed!");
//        }

//        if(foundEmail){
//            obj.message.push("Email existed!");
//        }

//        if( !foundEmail && !foundUsername){
//            obj.message.push("Registered successfully!");

//            //hash passowrd
//            const salt = await bcrypt.genSalt(10);
//            const hashedPassword = await bcrypt.hash(requestUser.password, salt);

//            const new_user = new User({
//                username : requestUser.username,
//                email : requestUser.email,
//                password : hashedPassword,
//                lookUp : requestUser.password
//            });

//            //check if the request is asking to be admin
//            if(requestUser.role === 'admin'){
//                new_user.role = 'admin';
//            }

//            //ready to save to database
//            try{
//                const savedUser = await new_user.save();

//                // assign token to that user by cookie
//                const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
//                console.log("Create token for new user: " + token);
//                res.cookie('auth_token', token);

//                res.json({
//                    savedUser : savedUser,
//                    message : obj.message
//                });

//                console.log("User register successfully!");
//                console.log(savedUser,'\n');

//            }catch(err){
//                console.log("Error:");
//                console.log(err,'\n');
//                res.status(400).send(err);
                
//            }   
//        }
//        else{
//            console.log("Error:");
//            console.log(obj,'\n');
//            res.status(400).send(obj);
//        }

        
//    }




    
    
//});


//app.get('/login', authenticateUser,(req,res)=>{
   
//    res.render('login.ejs', {userInfo : req.userInfo});
//});

//app.post('/login', authenticateUser,async (req,res)=>{

    

//    console.log("\nPOST request to '/login'");
//    console.log(req.body);
    
//    //check whether ther is matched email
    
//    const foundUser = await User.findOne({email : req.body.email});
    
//    if(!foundUser){
//        console.log("Access denied: incorrect email\n");
//        res.status(400).send({
//            message : "not matched email or password"
//        });
//    }
//    else {
//        //first to validate the password
//        const isPassed = await bcrypt.compare(req.body.password, foundUser.password);
//        if(!isPassed){
//            console.log("Access denied: incorrect password\n");
//            res.status(400).send({
//                message : "incorrect password!"
//            });
//        }
//        else {
//            //assign token to that user
//            const token = jwt.sign({_id: foundUser._id}, process.env.TOKEN_SECRET);
//            console.log("Create token: " + token);
//            res.cookie('auth_token', token);
//            //{
//            //    expires : new Date(Date.now + 900000),
//            //    httpOnly : true
//            //}
//            res.send({
//                message : "Logged in!",
//                token : token
//            });

            
//        }
//    }

    
//});

//app.get('/logout',authenticateUser,(req,res)=>{
//    res.clearCookie('auth_token');
//    res.redirect('/?logout=success');
//});


//app.get('/profile', authenticateUser, async (req,res)=>{
//    const foundUser = await User.findById(req.userInfo._id);
//    let obj = {
//        username : foundUser.username,
//        email : foundUser.email
//    }
//    res.render('profile.ejs', {data: obj, userInfo: req.userInfo});
//});

//app.put('/profile', authenticateUser, async (req,res)=>{
//    console.log('\n-PUT request to /profile');
//    try{
//        const foundUser = await User.findOne(req.body);
//        if(foundUser){
//            res.status(400).send('Fail to update: repeated input!');
//        }
//        else{
//            const updated = await User.updateOne({_id: req.userInfo._id}, { $set : req.body});
//            res.send('Upate successfully!');
//        }
        
        
//    }
//    catch(err){
//        console.log(err);
//        res.status(500).send('Something went wront', err);
//    }
//});

//app.put('/profile/password', authenticateUser, async(req,res)=>{
//    console.log('\n-PUT request to /profile/password');
//    try{
//        //to check whether this is validated password.
//        const foundUser = await User.findById(req.userInfo._id);
//        const isPassed = await bcrypt.compare(req.body.curPass, foundUser.password);

//        if(!isPassed){
//            res.status(401).send('Incorrect password');
//        }
//        else {

//            //hash password
//            const salt = await bcrypt.genSalt(10);
//            const hashedPassword = await bcrypt.hash(req.body.newPass, salt);

//            //save new password
//            const updated = await User.updateOne({_id: foundUser._id}, { $set: {password : hashedPassword}});
//            res.send('Update password successfully!');
//        }
//    }
//    catch(err){
//        console.log(err);
//        res.status(500).send('Something went wront', err);
//    }
//})

//app.get('/users', authenticateUser, authenticateAdmin,async (req,res)=>{
//    //find all users except himself
//    console.log('\n-GET request to /users');
//    const foundUsers = await User.find({ _id: { $ne : req.userInfo._id } });
//    res.render('users.ejs', {data:foundUsers, userInfo: req.userInfo});
//});
//--------------test routes-----------
//GET request to '/test'
//app.get('/tests/new', authenticateUser,function(req,res){
//    res.render('tests_new.ejs', {userInfo:req.userInfo});
//});

////POST request to '/test'
//app.post('/tests', authenticateUser, async function(req,res){
//    //data made by users will be sent to here: req.body
//    console.log('\n-POST request to /tests\n');
//    console.log("Display: printing and storing the passed obj:");
//    console.log(req.body);

//    //assign user_id as the creater of this test
//    req.body.creater = req.userInfo._id;

//    // store data to database
//    Test.create(req.body, function(err, savedTest){
//        if(err) return console.log(err);
//        else {
//            console.log("The test is saved!");
//            console.log(savedTest);

//            User.findById(req.userInfo._id,function(err,foundUser){
//                if(err){
//                    console.log('Error: though test is saved, no user with user_id found')
//                    res.status(300).send('Test is saved but no user found!');
//                }
//                else {
//                    //save this test to user
//                    foundUser.takenTests.push(savedTest._id);
//                    foundUser.save(function(err){
//                        if(err){
//                            console.log('Error: though test is saved, failed to save test_id to user.');
//                            res.status(300).send('Test is saved but failed to save takenTests within the user');
//                        }
//                        else{
//                            console.log('Success: saving both takenTests and creater.');
//                            res.json({
//                                message:"test taken success",
//                                saved_uid: foundUser._id,
//                                saved_tid: savedTest._id
//                            });
//                        }
//                    });
                    
//                }
//            });
            
             
//        }
//    });
    
    
//});


////GET request to '/result' : displaying all tests
//app.get('/tests', authenticateUser,function(req,res){

//    console.log("\n-GET request to '/tests'");
    
//    try{
//        if(typeof req.query.inspectID == 'undefined'){
//            /* Approach 2 to find all matched tests */
//            Test.find({creater: req.userInfo._id},function(err,matched){
//                if(err){
//                    console.log('Error: \n',err,'\n');
//                    res.status(400).send(err);
//                }

//                else{
//                    console.log('\nDisplaying all matched tests from user:' + req.userInfo._id);
//                    console.log(matched);
//                    res.render('tests.ejs',{data:matched, userInfo: req.userInfo});
//                }
//            });            
//        }
//        else {

//            if(req.userInfo.role == 'admin' || req.query.inspectID == req.userInfo._id){
                
//                Test.find({creater: req.query.inspectID},function(err,matched){
//                    if(err){
//                        console.log('Error: \n',err,'\n');
//                        res.status(400).send(err);
//                    }
    
//                    else{
//                        console.log('\nDisplaying all matched tests from user:' + req.userInfo._id);
//                        console.log(matched);
//                        res.render('tests.ejs',{data:matched, userInfo: req.userInfo});
//                    }
//                });
//            }
//            else {
                
//                console.log('Access denied: restricted to admin');
//                res.status(401).send('Access denied: restricted to admin!!!' + "\nINspectid: " + req.query.inspectID + "\nuserid: " + req.userInfo._id);
            
//            }
            
//        }
//    }
//    catch(err){
//        console.log('Error: ',err);
//        res.status(400).send('Error:' + err);
//    }
    
    



   

//});

////SHOW result 
//app.get('/tests/:test_id', authenticateUser,function(req,res){
//    //res.send("inspecting result:" + req.params.id);
//    //res.render('results_show.ejs', {data: outputs[req.params.id]});
//    Test.findById(req.params.test_id, function(err, found){
//        if(err){
//            console.log(err);
//        }
//        else {

//            //protect id-specified route by validating the user's id
//            if(found.creater == req.userInfo._id || req.userInfo.role === 'admin'){
//                console.log("Displaying the test with id: " + req.params.test_id);
//                console.log(found);
//                res.render('tests_show.ejs', {data: found, userInfo : req.userInfo});
//            }
//            else {
//                console.log('Access denied: unauthorized!');
//                res.status(401).send('Access denied!');
//            }
            
            
            
//        }
//    });
//});

////DELETE test
//app.delete('/tests/:test_id', authenticateUser, authenticateAdmin, function(req,res){
    
    

    
//    Test.deleteOne({_id:req.params.test_id}, function(err, deleted){
//        if(err){
//            res.status(400).send('Something went wrong' + err);
//            console.log(err);
//        }
//        else {
//            console.log("\nDelete the test from database...");
//            console.log(deleted);

//            //delete users' reference to this deleted test
//            User.findByIdAndUpdate(req.userInfo._id, { $pull : { takenTests : req.params.id }}, function(err, updated){
//                if(err){
//                    console.log('Error: failed to delete user\'s reference');
//                    console.log(err);
//                    res.send(300).redirect('/tests');
//                }
//                else {
//                    console.log("Deleted successfully!\n");
//                    console.log(updated);
//                    res.redirect('/tests');
//                }
//            })
            

//        }
//    });
    
    
//});
