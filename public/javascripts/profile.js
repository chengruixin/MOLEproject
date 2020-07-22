const info = document.querySelector('#info');
var profile = new Vue({
    el : "#profile",
    data : {
        username : recData.username,
        email : recData.email,
        curPass : null,
        newPass : null,
        isIndex : true,
        isUsername : false,
        isEmail : false,
        isPassword : false,
        info: ""
    },

    methods: {
        editUsername : function(){
            this.isIndex = false;
            this.isUsername = true;
            this.info = "";
        },
        editEmail : function(){
            this.isIndex = false;
            this.isEmail = true;
            this.info = "";
        },
        editPassword : function(){
            this.isIndex = false;
            this.isPassword = true;
            this.info = "";
            this.curPass = null;
            this.newPass = null;
        },
        
        toIndex : function(){
            this.isIndex = true;
            this.isUsername = false;
            this.isEmail = false;
            this.isPassword = false;
            
        },
        changeUsername : function(){
            //console.log(this.username);
            const xhttp = new XMLHttpRequest();
            xhttp.open('PUT', '/profile', true);
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify({
                username : this.username
            }));

            const that = this;
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4){
                    if(this.status == 200){
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        
                        document.querySelector('#info').classList.remove('alert-warning');
                        document.querySelector('#info').classList.add('alert-success');

                    }
                    else{
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        document.querySelector('#info').classList.remove('alert-success');
                        document.querySelector('#info').classList.add('alert-warning');
                    }
                }
            }
        },
        changeEmail : function (){
            //console.log(this.email);
            const xhttp = new XMLHttpRequest();
            xhttp.open('PUT', '/profile', true);
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify({
                email : this.email
            }));

            const that = this;
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4){
                    if(this.status == 200){
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        
                        document.querySelector('#info').classList.remove('alert-warning');
                        document.querySelector('#info').classList.add('alert-success');

                    }
                    else{
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        document.querySelector('#info').classList.remove('alert-success');
                        document.querySelector('#info').classList.add('alert-warning');
                    }
                }
            }
        },
        changePassword : function(){
            //console.log(this.curPass, this.newPass);
            const xhttp = new XMLHttpRequest();
            xhttp.open('PUT', '/profile/password', true);
            xhttp.setRequestHeader('Content-type', 'application/json');
            xhttp.send(JSON.stringify({
                curPass : this.curPass,
                newPass : this.newPass
            }));

            const that = this;
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4){
                    if(this.status == 200){
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        
                        document.querySelector('#info').classList.remove('alert-warning');
                        document.querySelector('#info').classList.add('alert-success');

                    }
                    else{
                        //console.log(this.responseText);
                        that.info = this.responseText;
                        that.toIndex();
                        document.querySelector('#info').classList.remove('alert-success');
                        document.querySelector('#info').classList.add('alert-warning');
                    }
                }
            }
        }
    }
});

