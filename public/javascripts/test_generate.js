const main = document.querySelector("#main");
const centerBox = document.querySelector("#centerBox");
const testName = document.querySelector('#testName');
const testNameAlert = document.querySelector('#testNameAlert');
const input_ques = document.querySelector("#questions");
const input_ites = document.querySelector("#iterations");
const input_mode = document.querySelector('#mode');
const alert_mode = document.querySelector('#modeAlert');
const btn_submit = document.querySelector('#submit');
const info = document.querySelector("#info");
const instruction = document.querySelector('#instruction');
var name;         //test name
var num_ques;    //sent to backend
var cur_ques;    //track current question
var num_ites;    //sent to backend
var mode;        // mode being choosed
var questions = []; //sent to backend
var results = [];   //  - sent to backend -  a collection of answers(answer is bunch of iterated answers for each question)
var answers = [];//bunch of iterated answers to be collected to questions
var cur_i;
var cur_Q;

/* pre defined functions */
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

//methods to generate random number
function getRandomNumberInclusive(curQuestion){
    let tempNum = parseFloat((Math.random()*(curQuestion.max - curQuestion.min) + parseFloat(curQuestion.min)).toFixed(curQuestion.sigfig));
    return tempNum;
}

function getResult(value1,value2,confidenceLevel,sig) {
    if (confidenceLevel == 100 ||confidenceLevel ==0){
        return null;
    }
    if (confidenceLevel>50){
        return parseFloat(parseFloat(value1 + (value2-value1)*confidenceLevel/100).toFixed(sig));
    }else{
        return parseFloat(parseFloat(value2 - (value2-value1)*(100-confidenceLevel)/100).toFixed(sig));
    }
}

/* 
    Events:
    add events to some divs 
*/
// Info on mode selection when conservative selected
input_mode.addEventListener("change", function(){
    if(input_mode.value == "conservative"){
        //console.log("conservative choosed");
        alert_mode.style.display = "block";
    }
    
    else if ( input_mode.value == "strict") {
        alert_mode.style.display = "none";
    }
});


// Infor on testName when it is clciked
document.addEventListener("click", function(event){
    
    let targetDom = event.target;
    if (targetDom == testName || testName.contains(targetDom) || targetDom == testNameAlert) {
        testNameAlert.style.display = "block";
    } else {
        testNameAlert.style.display = "none";
    }
  });



//when submit button is clicked first time
btn_submit.addEventListener("click", function(){
    //check invalid input
    if(input_ques.value == "" || input_ites.value == "" || testName.value == ""){
        
        info.style.display = "block";
        info.innerText = "Input should not be empty!";
    }
    else if(Number(input_ques.value) <= 0 || Number(input_ites.value <= 0)){
        info.style.display = 'block';
        info.innerText = "Invalid input: only positive integer allowed";
    }
    else {
        //console.log("clicked_setup");
        info.style.display = "none";
        // save values of questions and iterations and set cur_ques to 0
        name = testName.value;
        num_ques = parseInt(input_ques.value);
        num_ites = parseInt(input_ites.value);
        mode = input_mode.value;
        cur_ques = 0;

        //console.log("Test name: " + name + " Questions - Ites : " + num_ques + " - " + num_ites + " - mode: " + mode);
        setUp();
        
        

    }
    
});

//questions set up: set up the name of the question and min & max values of the question
function setUp(){
    //// 1.display the settings for each question
    centerBox.innerHTML = "<h2> Set Question " + (cur_ques+1) + "</h2>\
                            <div class='form-group row'>\
                                <label class='col-sm-6 col-form-label' for='question_name'>Set question's name:</label>\
                                <div class='col-sm-6'>\
                                    <input class='form-control' type='text' id='question_name'>\
                                </div>\
                            </div>\
                            <div class='form-group row'>\
                                <label class='col-sm-9 col-form-label' for='question_name'>Set min value:</label>\
                                <div class='col-sm-3'>\
                                    <input class='form-control text-center' type='number' id='question_min'>\
                                </div>\
                            </div>\
                            <div class='form-group row'>\
                                <label class='col-sm-9 col-form-label' for='question_name'>Set max value:</label>\
                                <div class='col-sm-3'>\
                                    <input class='form-control text-center' type='number' id='question_max'>\
                                </div>\
                            </div>\
                            <div class='form-group row'>\
                                <label class='col-sm-9 col-form-label' for='question_name'>Set sig.fig:</label>\
                                <div class='col-sm-3'>\
                                    <input class='form-control text-center' type='number' id='question_sfig'>\
                                </div>\
                            </div>\
                            <button class='btn btn-primary' id='question_submit'>submit</button>\
                            ";
    //console.log("\n ----- Set Up Done!------");

    /*  2.
        Add click event to the submit button 
        once the button being clicked, go to next question set up page 
        or go to formal question answering phrase
    */
    //get question's elements 
    let question_name = document.querySelector("#question_name");
    let question_min = document.querySelector("#question_min");
    let question_max = document.querySelector("#question_max");
    let question_sfig = document.querySelector("#question_sfig");
    let question_submit = document.querySelector("#question_submit");
    //add click event
    question_submit.addEventListener("click",function(){
        //check invalid input
        //console.log(myTrim(question_name.value).length);
        if( myTrim(question_name.value).length  === 0 || question_min.value == "" || question_max.value == "" || question_sfig.value == "") {
            info.style.display = "block";
            info.innerText = "Input should not be empty!";
            //console.log("should be empty");
        }

        else if(Number(question_max.value) <= Number(question_min.value)){
            info.style.display = "block";
            info.innerText = "Invalid min or max value!";
            //console.log("should be empty");
        }
        else {
            //clear alerts
            info.style.display = "none";

            //if there are questions not being set yet
            if(cur_ques < num_ques){
                cur_ques++;

                // store question's input values into an object
                let obj = {
                    title: question_name.value,
                    min: Number(question_min.value),
                    max: Number(question_max.value),
                    sigfig: parseInt(question_sfig.value),
                    STARTING_MIN: Number(question_min.value),
                    STARTING_MAX: Number(question_max.value)
                };

                //console.log("current Question pushed into questions queue:");
                //console.log(obj);
                //console.log("\n");
                //push obj into questions[]
                questions.push(obj);


                //when it is not the last question setup => then keep set up questions
                if(cur_ques != num_ques){
                    setUp();
                }
                //when it is the last question that is set up already => turn to question answering phrase
                else{
                    
                    // store questions set up
                    //let obj = {
                    //    num_ques: num_ques, //track how many questions are there
                    //    num_ites: num_ites, //track how many iterations for each question
                    //    questions: questions    //all data information in an array of questions
                    //};
                    //console.log("\nAll questions being set up:");
                    //console.log(questions);
                    //console.log("\nReady to answer questions...");

                    cur_Q=0;
                    cur_i=0;
                    confirmQuestion();
                    

                    ////set pointers to current question and current iteration
                    //cur_Q=0;
                    //cur_i=0;
                    //generateQuestions();
                    ////display the instruction:
                    //instruction.style.display = "block";
                }
                
            }
        }

    });

    //console.log(centerBox);
}

function confirmQuestion(){
    centerBox.innerHTML = "\
    <div class='d-flex flex-column align-items-center'>\
    <h4>Ready to answer Question "+Number(cur_Q+1)+"?</h4>\
    <button class='btn btn-primary responsive-width-20 my-3'id='confirm'>Yes</button>\
    </div>\
    \
    \
    ";
    instruction.style.display = "none";

    let btn_confirm = document.querySelector('#confirm');
    btn_confirm.addEventListener('click', function(){
        
        generateQuestions();
        //display the instruction:
        instruction.style.display = "block";
        
    });
}

/*  
    @function generateQuestions();
    -------------------------------
    generate a question for getting possibility and choosed value according to cur_Q and cur_i
    cur_Q : num_ques
    cur_i : num_ites
    use questions[cur_Q]

    Once submit clicked:
    cur_i++;
    cur_Q++;
    push values {selected: value, possibility: float} to answers

*/
//the index of current question

function generateQuestions(){

    //alert("you are ready to answer questions, are you sure?");


    //console.log(cur_Q+ " : " +num_ques);
    //console.log(cur_i+ " : " +num_ites);

    let ran_val_1 = getRandomNumberInclusive(questions[cur_Q]);
    let ran_val_2 = getRandomNumberInclusive(questions[cur_Q]);

    //make sure two random number are not same
    while(ran_val_1 == ran_val_2){
        ran_val_1 = getRandomNumberInclusive(questions[cur_Q]);
        ran_val_2 = getRandomNumberInclusive(questions[cur_Q]);
    }
    if (ran_val_1>ran_val_2){
        // swap(ran_val_1,ran_val_2);
        let temp = ran_val_1;
        ran_val_1 = ran_val_2;
        ran_val_2 = temp;
    }
    
    /* 1. Generation begins ... */
    // asdlfj;asdkl;fjasldfjl
    //afsdlf;asjdfkl;asjdf
    //fasdjfklasd;
    // the two values(radnom_val1 and random_val2) of input[type='range'] should be random each iteration
    centerBox.innerHTML = "<h3>Question "+ parseInt(cur_Q+1) + ": " + questions[cur_Q].title + "</h3>\
                            <h5>Iteration: "+parseInt(cur_i+1)+"</h5>\
                            <p>Which of these values is closer to the true value? </p>\
                            <div class='row'>\
                                <div class='col-4 hd-highlight text-left' id='val-1'>"+ ran_val_1.toFixed(questions[cur_Q].sigfig)+"</div>\
                                <div class='col-4 hd-highlight text-center' id='possi'>50%</div>\
                                <div class='col-4 hd-highlight text-right' id='val-2'>"+ ran_val_2.toFixed(questions[cur_Q].sigfig)+"</div>\
                            </div>\
                            <div class='form-group'>\
                                <input type='range' class='form-control-range' id='range' min='0' max='100' >\
                            </div>\
                            <button class='btn btn-primary' id='answer_submit' disabled>submit</button>\
                            ";
    
    let select_possi = centerBox.querySelector("input[type='range']");
    let submit_btn = document.querySelector("#answer_submit");

    // enable submit button when input is clicked
    select_possi.addEventListener("click",function(){
        if(submit_btn.disabled == true){
            submit_btn.disabled = false;
        }
    });

    // Change possibility value whenever input-range's value is changed
    select_possi.addEventListener("input",function(){

        // enable submit button when input's value is changed
        if(submit_btn.disabled == true){
            submit_btn.disabled = false;
        }
        if( parseInt(this.value) >= 50){
            document.querySelector("#possi").innerText = this.value  + "%";
        }
        else {
            document.querySelector("#possi").innerText = (100 - parseInt(this.value))  + "%";
        }
    });

    //console.log("Display: values draw from range: " + questions[cur_Q].min + " - " + questions[cur_Q].max);
    //console.log(ran_val_1.toFixed(questions[cur_Q].sigfig)+" -------- "+ran_val_2.toFixed(questions[cur_Q].sigfig));
    //console.log(typeof ran_val_1);
    //console.log(typeof ran_val_2);
    //console.log("\n ----- Display question:iterations Done!------");
    

    /*  3.
        add click event to submit button - based on cur_Q and cur_i
    */
    
    submit_btn.addEventListener("click",function(){
        
        //console.log("Value_1: "+ ran_val_1 + " Value_2: " + ran_val_2 + " Possibility:" + select_possi.value);

        //Depneding on cur_Q and cur_i, determine what next action will be
        if(cur_Q < num_ques){
            if(cur_i < num_ites){

                if (parseInt(select_possi.value) === 100){
                    
                    if(mode == "strict"){
                        questions[cur_Q].min = Number((parseFloat(ran_val_2+ran_val_1)/2).toFixed(questions[cur_Q].sigfig));
                    }
                    else if(mode == "conservative"){
                        questions[cur_Q].min = Number((parseFloat(ran_val_1)).toFixed(questions[cur_Q].sigfig));
                    }
                }
                if(parseInt(select_possi.value) ==0){
                    
                    if(mode == "strict"){
                        questions[cur_Q].max = Number((parseFloat(ran_val_2+ran_val_1)/2).toFixed(questions[cur_Q].sigfig));
                    }
                    else if(mode == "conservative"){
                        questions[cur_Q].max = Number((parseFloat(ran_val_2)).toFixed(questions[cur_Q].sigfig));
                    }
                }

                //console.log("Info: Question " + cur_Q + "'s range cut to " + questions[cur_Q].min + " - " + questions[cur_Q].max);
                
                //value pushed to answer
                let cur_answer = {
                    low_value : ran_val_1,
                    high_value: ran_val_2,
                    possibility: parseInt(select_possi.value),
                    result: getResult(ran_val_1, ran_val_2, parseInt(select_possi.value), questions[cur_Q].sigfig)
                };
                answers.push(cur_answer);
                cur_i++;
                if(cur_i === num_ites){
                    cur_Q++;
                    cur_i = 0;
                    //push all "answers" for each question as whole to results
                    results.push(answers);
                    //clear "answers" for next use
                    answers = [];

                    if(cur_Q != num_ques){
                        confirmQuestion();
                    }

                }

                else{
                    if(cur_Q != num_ques){
                        generateQuestions();
                    }
                    
                }
                
            }
            
            if(cur_Q === num_ques){

                centerBox.innerHTML = "Test finished. Ready to show results...";
                //show info after test finished//

                let passedObj = {
                    testName: name,         //name of the test
                    num_questions: num_ques,    //int: size of questions
                    num_iterations: num_ites,   //int: size of iterations
                    mode : mode,                //mode
                    questions: questions,   //[] : an array of questions
                    results: results,    //[][]: an array of an array of answers ( eah array is an answer for each question)
                    bestGuess:[]
                };
                for (var i = 0; i<results.length;i++){
                    let sum = 0;
                    let count = 0;
                    let count_null = 0;
                    for(var j = 0;j<results[i].length;j++){
                        let tempNum = results[i][j].result;
                        if (tempNum!=null && questions[i].min<=tempNum && questions[i].max>= tempNum){
                            //console.log(tempNum);
                            sum+= tempNum;
                            count++;
                        }
                        if(tempNum == null){
                            count_null++;
                        }
                    }
                    if(count_null === results[i].length){
                        passedObj.bestGuess.push(parseFloat(passedObj.questions[i].min + passedObj.questions[i].max)/2);
                    }
                    else{
                        passedObj.bestGuess.push(Number(parseFloat(sum/count).toFixed(questions[i].sigfig)));
                    }
                    
                    //console.log("Final guess: " + parseFloat(sum/count).toFixed(questions[i].sigfig));
                }

                //console.log("Test finished. Ready to show results...");
                //console.log(passedObj);


                //send passedObj to backend
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if(this.status == 200){
                             //console.log("********showing results from server side**********");
                            //console.log(JSON.parse(this.responseText));
                            //console.log("********showing results from server side**********");
                            let receivedData = JSON.parse(this.responseText);
                            //console.log(receivedData);
                            window.location.replace("/tests/"+receivedData.saved_tid);
                        }
                        
                        //else{
                        //    console.log("Something went wrong!!! StatusCode: " + this.status);
                        //    console.log(this.responseText);
                        //}
                    }
                };
                xhttp.open("POST", "/tests", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(passedObj));
                // //it should be a callback func but now just redirect after ajax post request
                instruction.style.display = "none";

            }
            //else {
                
            //    generateQuestions();
                
            //}
            
        }
        
        
    });

        
}