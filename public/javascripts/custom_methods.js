function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

function getCookie(cookieName){
    var cookieObj={},
          cookieSplit=[],
          
          cookieArr=document.cookie.split(";");
    for(var i=0,len=cookieArr.length;i<len;i++)
        if(cookieArr[i]) {
           
            cookieSplit=cookieArr[i].split("=");
           
            cookieObj[myTrim(cookieSplit[0])]=myTrim(cookieSplit[1]);
        }
    return cookieObj[cookieName];
}

function getQueries(string){
    const queries =  string.split('?')[1].split('&');
    let q_obj = new Object();
    queries.forEach((query)=>{
        q_obj[query.split('=')[0]] = query.split('=')[1];
    });

    return q_obj;
    
}

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
        //console.log("minpass: " + this.min_password_length);
        //console.log("maxpass: " + this.max_password_length );
        if(string.length < this.min_password_length || string.length > this.max_password_length){
            return false;
        }
        else{
            return true;
        }
    }
}

class Ajax {
    get = (url) => {
        return new Promise((resolve, reject)=> {
            try{
                let xhttp = new XMLHttpRequest();
                xhttp.open('get', url, true);
                xhttp.send();
    
                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200) {
                        resolve(this.responseText);
                    }
                    
                }
            }

            catch(err){
                reject(err);    
            }

        });
    }


    post = (url, data) => {
        return new Promise((resolve, reject) => {
            try{
                let xhttp = new XMLHttpRequest();
                xhttp.open('POST', url, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(data));

                xhttp.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    }
                    else if(this.readyState == 4 & this.status != 200){
                        reject(this.status);
                    }
                }
            }

            catch(err){
                reject(err);
            }
        })
    }
}

