const mongoose = require('mongoose');


// Set schema for "Test"
const testSchema = new mongoose.Schema({
    testName: String,
    num_questions : Number,
    num_iterations: Number,
    mode: String,
    questions: [{
        title : String,
        min : Number,
        max : Number,
        sigfig : Number,
        STARTING_MIN : Number,
        STARTING_MAX : Number
    }],

    results : [[{
        low_value : Number,
        high_value : Number,
        possibility : Number,
        result : Number
    }]],

    bestGuess : [Number],

    updated: {
        type: Date, 
        default: Date.now
    },

    creater : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});


module.exports = mongoose.model("Test", testSchema);