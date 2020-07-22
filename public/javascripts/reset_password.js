var resetPassword = new Vue({
    el : "#resetPassword",

    data : {
        isValid : false,
        info : "Password length : 6 ~ 30; ",
        newPass : "",
        conPass : "",
        isSending : false
    },
    methods : {
        reset : async function(){
            try{
                this.isSending = true;
                // console.log(window.location.pathname);
                const ajax = new Ajax();
                const result = await ajax.post(window.location.pathname, {
                    newPassword : this.newPass
                });

                //console.log(result);
                if(result.status == -1){
                    document.querySelector("#info").innerHTML = result.message;
                }
                else {
                    document.querySelector("#info").innerHTML = "Reset password successfully, redirecting to home page in 3s...";
                    document.querySelector("#info").classList.add("bg-success");
                    document.querySelector("#info").classList.add("text-white");
                    setTimeout(function(){
                        window.location.replace("/?reset=success");
                    }, 3000);

                }
                
                this.isSending = false;
                
            }
    
            catch(err){
                this.isSending = false;

            }
        },
        changed : function(){
            const validator = new Validator();
            if(this.newPass !== this.conPass){
                this.isValid = false;
            }
            else if(!validator.isValidPassword(this.newPass)) {
                this.isValid = false;
            }
            else {
                this.isValid = true;
            }
        }
    }
})