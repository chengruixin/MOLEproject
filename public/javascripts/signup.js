var app = new Vue({
    el : "#registerForm",
    data : {
        username: "",
        email : "",
        password : "",
        password2: "",
        infos : [],
        isRegistering: false,
        adminIsChecked: false
    },
    methods : {

        register : function(){
            
            this.infos = [];
            //check emptyness
            if(this.username == "" || this.email == "" || this.password == "" || this.password2 == ""){
                this.infos.push("-Empty inputs");
            }
            else{
                /*
                    regular expression
                    use regex to validate user's information
                */
                    //not done yet

                const myValidator = new Validator();

                //check length
                if(!myValidator.isValidUsernameLength(this.username)){
                    this.infos.push("-Username should be " + myValidator.min_username_length + " ~ " + myValidator.max_username_length + " characters long.");
                }

                if(!myValidator.isValidEmailLength(this.email)){
                    this.infos.push("-Email should be " + myValidator.min_email_length + " ~ " + myValidator.max_email_legnth + " characters long.");
                }

                //validate format
                if(!myValidator.isValidUsername(this.username)){
                    this.infos.push("-Incorrect form of username: username should only contain a~z, A~Z or followed with '.' or '_'. ");
                }

                if(!myValidator.isValidEmail(this.email)){
                    this.infos.push("-Incorrect form of email");
                }

                //check two passwords first 
                if(this.password !== this.password2){
                    this.infos.push("-Passwords should be same.");
                }

                else if(!myValidator.isValidPasswordLength(this.password)){
                    this.infos.push("-Passowrd should be " + myValidator.min_password_length + " ~ " + myValidator.max_password_length + " characters long.");
                }

                else if(!myValidator.isValidPassword(this.password)){
                    this.infos.push("-Incorrect form of password: password should have at least one letter and one number.");
                }

                ////check username format
                //if(this.username.length <2 || this.username.length > 20){
                //    this.infos.push("Username shoud be 2 ~ 20 characters long.");
                //}

                ////check email format
                //if(this.email.length < 4 || this.email.length > 50){
                //    this.infos.push("Email shoud be 4 ~ 50 characters long.");
                //}

                ////check the similarity of passwords
                //if(this.password !== this.password2){
                //    this.infos.push("Passwords should be same.");
                //}

                ////else: check password format
                //else if (this.password.length < 6 || this.password.length >30){
                //    this.infos.push("Passwords should 6 ~ 30 characters long.");
                //}

                
            }

            if(this.infos.length === 0){
                //disable submit button for temporary
                this.isRegistering = true;

                //submit to /signup
                let obj = {
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    role : 'normal'
                }

                if(this.adminIsChecked){
                    obj.role = 'admin';
                }
                let xhttp = new XMLHttpRequest();
                let that = this;
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if(this.status == 200){
                            //console.log("\nSign up results:");
                            //console.log(JSON.parse(this.responseText),"\n");
                            let responseObj = JSON.parse(this.responseText);

                            //if(responseObj.message[0] == "Registered successfully!"){
                            //that.isRegister = true;
                            
                            //save token at here
                            //console.log(getCookie('auth_token'));
                        
                            document.querySelector('#registerSuccess').style.display = 'block';
                            //turn to anypage you want

                            window.location.replace('/');
                        }
                        
                        else{
                            //console.log("Something went wrong!!! StatusCode: " + this.status);
                            //console.log(JSON.parse(this.responseText),"\n");
                            that.infos = JSON.parse(this.responseText).message;
                            that.isRegistering = false;
                        }
                    }
                };

                xhttp.open("POST", "/signup", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(obj));

            }
            
        }
        
    }
});