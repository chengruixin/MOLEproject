const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        min: 2,
        max : 255
    },
    email : {
        type : String,
        required : true,
        min : 4,
        max : 255
    },
    password : {
        type : String,
        required : true,
        min : 6,
        max : 1024
    },

    //lookUp : {
    //    type: String,
    //    min : 6,
    //    max : 1024
    //},

    date : {
        type : Date,
        default : Date.now
    },

    takenTests : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test'
        }
    ],

    role : {
        type : String,
        default : 'normal'
    },

    resetToken: {
        type: String,
        default : ""
    }
});

module.exports = mongoose.model('User', userSchema);