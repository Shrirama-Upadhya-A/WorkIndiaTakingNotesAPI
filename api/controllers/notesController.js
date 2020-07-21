'use strict';
var mongoose = require('mongoose');
var Note = mongoose.model('Note');
var User = mongoose.model('User');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

exports.addUser = function(req,res) {
    var newUser = new User(req.body);
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
    User.find({name:req.body.username, password: req.body.password}, function(err,uu){
        if(err)
            res.send(err);
        res.json({'status' : "success", "userID" : uu[0]._id});
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
        var note;
        // res.send(user.notes)
        for(note in user.notes){
            Note.findOne()
        }
    }).then(()=>{

        res.json(arr);
    })
}