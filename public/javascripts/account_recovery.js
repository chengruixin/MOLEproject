var recovery = new Vue({
    el : "#recovery",

    data : {
        isValid : false,
        email: "",
        info : "A recovery link will be sent to the email address.",
        isSending : false,
        success : false,
        fail : false
    },
    methods : {
        send: async function(){
            //console.log("is clicked");
            if(this.isValid){
                try{
                    this.isSending = true;
                    const ajax = new Ajax();
                    const data = await ajax.post('/profile/account-recovery', {email : this.email});
                    //console.log(data);

                    if(data.mess == '-1'){
                        this.info = "The email address does not exist.";
                        this.isSending = false;
                        this.fail = true;
                        this.success = false;
                    }
                    else if(data.mess == '1') {
                        this.info = "An email has been sent to your email account!";
                        this.isSending = false;
                        this.success = true;
                        this.fail =false;
                        this.email = "";
                    }
                }
                catch(err){
                    this.isSending = false;
                    this.success =false;
                    this.fail = true;
                    this.info ="Unknown error: possibly connection timeout"
                }
                
            }
            
            
        },
        changed : function(){
            const myValidator = new Validator();
            this.isValid = myValidator.isValidEmail(this.email);
        }
    }
})