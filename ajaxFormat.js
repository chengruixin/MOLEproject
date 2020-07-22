let xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        if(this.status == 200){
            
            console.log("\nSign up results:");
            console.log(JSON.parse(this.responseText),"\n");
            

            
        }
        
        else{
            console.log("Something went wrong!!! StatusCode: " + this.status);
            console.log(JSON.parse(this.responseText),"\n");

            
        }
    }
};

xhttp.open("POST", "/signup", true);
xhttp.setRequestHeader("Content-type", "application/json");
xhttp.send(JSON.stringify(obj));