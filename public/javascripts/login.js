var app = new Vue({
    el: "#login-box",
    data : {
        email: "",
        password : "",
        infos: [],
        message : "",
        hasInfo: null,
        isLogging: false
    },
    methods: {
        login : function(){
            this.infos = [];

            if(this.email == "" || this.password == ""){
                this.infos.push("-Input cannot be blank");
                //console.log("empty");
            }

            else{

                const myValidator = new Validator();

                //check length
                //if(!myValidator.isValidUsernameLength(this.username)){
                //    this.infos.push("-Username should be " + myValidator.min_username_length + " ~ " + myValidator.max_username_length + " characters long.");
                //}

                if(!myValidator.isValidEmailLength(this.email)){
                    this.infos.push("-Email should be " + myValidator.min_email_length + " ~ " + myValidator.max_email_legnth + " characters long.");
                }

                //validate format
                //if(!myValidator.isValidUsername(this.username)){
                //    this.infos.push("-Incorrect form of username: username should only contain a~z, A~Z or followed with '.' or '_'. ");
                //}

                if(!myValidator.isValidEmail(this.email)){
                    this.infos.push("-Incorrect form of email");
                }

                //check two passwords first 
                //if(this.password !== this.password2){
                //    this.infos.push("-Passwords should be same.");
                //}

                if(!myValidator.isValidPasswordLength(this.password)){
                    this.infos.push("-Passowrd should be " + myValidator.min_password_length + " ~ " + myValidator.max_password_length + " characters long.");
                }

                else if(!myValidator.isValidPassword(this.password)){
                    this.infos.push("-Incorrect form of password: password should have at least one letter and one number.");
                }


                ////check email format
                //if(this.email.length < 4 || this.email.length > 50){
                //    this.infos.push("-Email shoud be 4 ~ 50 characters long.");
                //}

                //// check password format
                //if (this.password.length < 6 || this.password.length >30){
                //    this.infos.push("-Passwords should 6 ~ 30 characters long.");
                //}

            }

            document.querySelector("#error").style.display = 'none';
            // if there 
            if(this.infos.length !== 0) {

                //there is something wrong with login report it

            }
            else {
                //console.log("ready to signin ");

                //Disable login submit
                this.isLogging = true;

                let loginUser = {
                    email : this.email,
                    password : this.password
                }

                //ajax post request to /login
                let xhttp = new XMLHttpRequest();
                let that = this;

                xhttp.open("POST", "/login", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(loginUser));

                xhttp.onreadystatechange = function() {
                    if(this.readyState == 4){
                        if(this.status == 200){
                            //console.log(this.getResponseHeader('auth-token'));
                            //console.log(JSON.parse(this.responseText));
                            //get token from cookie
                            //console.log(getCookie('auth_token'));

                            //redirect to some page depending on url.query
                            var url = window.location.search;
                            var query = url.split('?')[1];
                            
                            var turned = false;
                            if(query){
                                var params = query.split('&');
                                
                                if(params.length > 0){
                                    
                                    for(var i = 0;i< params.length;i++){
                                        if(params[i].split('=')[0] == 'attempt'){
                                            turned = true;
                                            //console.log(params[i].split('=')[1]);
                                            window.location.replace(params[i].split('=')[1]);
                                        
                                        }
                                    }
                                }
                            }
                            if(!turned){
                                window.location.replace('/');
                            }
                        
                        }
                        else {
                            //something went wrong report on login page
                            //console.log(JSON.parse(this.responseText));
                            
                            that.isLogging = false;
                            let error = document.querySelector("#error");
                            error.style.display = 'block';
                            error.textContent = JSON.parse(this.responseText).message;
                        }
                    }
                }
                
                
            }


        },
        checkUrl : function(){
            var url = window.location.search;
            var query = url.split('?')[1];
            
            
            if(query){
                var params = query.split('&');
                
                if(params.length > 0){
                    
                    for(var i = 0;i< params.length;i++){
                        if(params[i].split('=')[0] == 'access'){
                            if(params[i].split('=')[1] == 'rejected'){
                                //console.log('access=rejected..');

                                //display an info
                                this.hasInfo = true;
                                //console.log('executed');
                            }
                        
                        }
                    }
                }
            }
        }
    },
    beforeMount(){
        this.checkUrl();
    }
});