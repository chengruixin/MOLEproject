const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');  //used for PUT, DELETE requests
const port = process.env.PORT || '3000';
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const indexRoute = require('./routes/indexRoute.js');
const profileRoute = require('./routes/profileRoute.js');
const testsRoute = require('./routes/testsRoute.js');

app.use(bodyParser.urlencoded({extended: true}));   //allow using body-parser
app.use(express.static("public"));  //allow files in public/ folder to be accessed
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cookieParser());

dotenv.config();

//Connect to Local MongoDB named MOLE_1
// mongoose.connect("mongodb://localhost:27017/MOLE_1", 
// {useNewUrlParser:true, useUnifiedTopology: true}).then(() =>{
//    console.log('Connected to local database\n');
// }).catch(err =>{
//    console.log('ERROR: ' + err);
// });

// Connect to MongoDB Altas(cloud database)
mongoose.connect( process.env.MONGODB_URI,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log('Connected to could database\n');
}).catch( err =>{
    console.log('ERROR: ' , err.message);
});

app.use('/', indexRoute);
app.use('/profile', profileRoute);
app.use('/tests', testsRoute);


/* 
    Server Port:3000 
*/
app.listen(port, function(){
    console.log('\nServer listening on port '+ port);
});
