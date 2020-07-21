'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var noteSchema = Schema({
    title : {type: String,default: "Title"},
    content  :{
        iv: String,
        encryptedData : String
    },
    Date : {type: Date,default : Date.now()},
});

var userSchema = Schema({
    name: String,
    email: String,
    password: String,
    // gender: {type: String, enum: ["Male", "Female"]},
    dob: Date,
    // city: String,
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

var Note = mongoose.model('Note',noteSchema);
var User = mongoose.model('User', userSchema);

// module.exports = {
//     User: User,
//     Note: Note
// }
module.exports = User;