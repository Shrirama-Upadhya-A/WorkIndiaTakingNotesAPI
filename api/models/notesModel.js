'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var noteSchema = Schema({
    // title : {type: String,default: "Title"},
    content : String,
    Date : {type: Date,default : Date.now()},
});

var userSchema = Schema({

    name: {type :String,unique:true, required : "Please enter username"},
    // email: String,
    password: {type :String, required : "Please enter password"},
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
});

var Note = mongoose.model('Note',noteSchema);
var User = mongoose.model('User', userSchema);

module.exports = User;