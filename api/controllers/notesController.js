'use strict';
var mongoose = require('mongoose');
var Note = mongoose.model('Note');
var User = mongoose.model('User');

const crypto = require('crypto');

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}
exports.addUser = function(req,res) {
    var newUser = new User({name: req.body.username, password: req.body.password});
    newUser.save(function(err,User){
        if(err)
            res.send(err);
        res.json({'status' : "account created"});
    })
}

exports.getUsers = function(req,res) {
    User.find({}, function (err,use) {
        if (err){
            res.send(err);
        }
        res.json(use);
    })
}

exports.authUser = function(req,res) {
    User.count({name:req.body.username, password: req.body.password}, function(err,count){

        if(err)
            res.send(err);
        if(count>0){
            User.find({name:req.body.username, password: req.body.password}, function(err, uu) {
                res.json({'status': "success", "userID": uu[0]._id});
            })
        }
        else{
            res.send("Wrong credentials! Please check your username and password")
        }
    })
}

exports.getNotes = function(req,res) {
    var userID = req.query.user;
    User.find({_id: userID}, function(err, user) {
        if(err)
            res.send(err);
        res.json(user[0].notes);
    })
}

exports.addNote = async function (req, res) {
    var note = req.body.note;

    var newNote = new Note({content: encrypt(note)})
    newNote.save((err)=>{
        if(err)
            res.send(err)
    })
    const user = await User.findOne({_id : req.query.user});
    user.notes.push(newNote);
    user.save((err)=>{
        if (err)
            res.send(err)
    })
    User.
    findOne({ _id: req.query.user }).
    populate('notes'). // only works if we pushed refs to children
        exec(function (err, person) {
            if (err) res.send(err);
            // res.json({"status" : "success"})
            res.json(person);
        });
}

exports.deleteAllNotes = function (req,res) {
    User.findOne({_id : req.query.user}, function(err,user){
        user.notes = [];
        user.save((err)=>{
            if(err)
                res.send(err)
        })
    })

    Note.remove({
        title : req.params.title
    }, function (err,Note) {
        if(err)
            res.send(err);
        res.json(Note);
    })
}

exports.getAllNotes = function (req,res) {
    var arr = [];
    User.findOne({_id : req.query.user}, function(err,user){
        for(var i =0;i<user.notes.length;i++){
            Note.findOne({_id : user.notes[i]},(err,not)=>{
                arr.push(decrypt(not.content))
            })
        }
    })
        .then(()=>{
            res.json(arr);
        })
}