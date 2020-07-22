//const bcrypt = require('bcryptjs');


//var hashedValu = "$2a$10$GnQf40X/VxMc3Rg4sU8x6OkxmO6WuSW8pg7ZegJmE4TW9B0vacJ9W";
//bcrypt.genSalt(10,function(err,salt){
//    console.log("Salt: " + salt);
//    bcrypt.hash("qwerasdfff", salt, function(err,hashres){
//        console.log("Hashed pass: " + hashres);
        
//    })
//})
////$2a$10$MfTEOIW.qB9JqB7mynmSpOnx.LYbJtzcfVP0WbbjTYecHLKRZ.3mu
////$2a$10$bY7f8kJTyNLhVp/U0re9M.5oTHyhtEd7Z/1thf9zjDD.40YFm276K

//bcrypt.compare("qwerasdfff", hashedValu, function(err,res){
//    console.log(res);
//})



//var str = 'chen g@12.com';

class Validator {


    constructor () {
        this.email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        this.password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/;
        this.username_pattern = /^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        this.min_username_length = 3;
        this.max_username_length = 20;
        this.min_email_length = 4;
        this.max_email_legnth = 50;
        this.min_password_length = 6;
        this.max_password_length = 30;
    }
    /*  
        @validateEmail(string)
        Example of valid email id:

            mysite@ourearth.com
            my.ownsite@ourearth.org
            mysite@you.me.net

        Example of invalid email id:
        
            mysite.ourearth.com [@ is not present]
            mysite@.com.my [ tld (Top Level domain) can not start with dot "." ]
            @you.me.net [ No character before @ ]
            mysite123@gmail.b [ ".b" is not a valid tld ]
            mysite@.org.org [ tld can not start with dot "." ]
            .mysite@mysite.org [ an email should not be start with "." ]
            mysite()*@gmail.com [ here the regular expression only allows character, digit, underscore, and dash ]
            mysite..1234@yahoo.com [double dots are not allowed]

        Copy from : https://www.w3resource.com/javascript/form/email-validation.php

    */
    isValidEmail (string) {
        return this.email_pattern.test(string);
        //const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
    }

    /*
        @validatePassword(string)
        
        Minimum eight characters, at least one letter and one number:
        "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"

        Minimum eight characters, at least one letter, one number and one special character:
        "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"

        Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"

        Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

        Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"

        copied from:https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
        
        Answered by : Srinivas
        Edited by: Wiktor Stribiżew
    */

    isValidPassword (string) {
        //const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/;
        return this.password_pattern.test(string);
    }


    /*
        username is 8-20 characters long
        no _ or . at the beginning
        no __ or _. or ._ or .. inside
        allowed characters : a-zA-Z0-9._
        no _ or . at the end

        Copied from: https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
        Answered by : Ωmega
    */
    isValidUsername(string){
        //const username_pattern = /^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        return this.username_pattern.test(string);
    }

    isValidUsernameLength(string){
        if(string.length < this.min_username_length || string.length > this.max_username_length){
            return false;
        }
        else{
            return true;
        }
    }

    isValidEmailLength(string){
        if(string.length < this.min_email_length || string.length > this.max_email_length){
            return false;
        }
        else{
            return true;
        }
    }

    isValidPasswordLength(string){
        if(string.length < this.min_password_length || string.length > this.max_password_length){
            return false;
        }
        else{
            return true;
        }
    }
}




//console.log(validateEmail("alsasdfadsfasdaf.dsf.as.dfasdfasddfja@as.df"));

//var vali = new Validator();

//console.log(vali.isValidEmail("TasTdf@asdf.com"));
//console.log(vali.isValidPassword("RUI1231xin"));
//console.log(vali.isValidUsername("ru_ic.he.n1_23"));
//console.log(vali.isValidUsernameLength("as"));

/////promise/////

//const prom = new Promise((resolve, reject)=>{
//    console.log("ready to access database!!");
//    setTimeout(()=>{
//        console.log("data got !!");
//        resolve({person: "ruixin"});
//    },2000);
    
//});

//prom.then(data=>{
//    console.log("thing we got is :");
//    console.log(data);
//});

//function getQueries(string){
//    const queries =  string.split('?')[1].split('&');
//    let q_obj = new Object();
//    queries.forEach((query)=>{
//        q_obj[query.split('=')[0]] = query.split('=')[1];
//    });

//    return q_obj;
    
//}
//5ec2c856de8c0b34b113ab2d
//5ec2c36ddea0a931b9969bec
//const str1 = "5ec2c856de8c0b34b113ab2d";
//const str2 = "5ec2c36wdea0a931b9969bec";

//console.log(toString(str1) == toString(str2));
//console.log(toString(str1));

var str1 = "";
var str2 = "fads";

console.log(str1 + str2);