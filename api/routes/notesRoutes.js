'use strict';
module.exports = function (app) {
    var usersList = require("../controllers/notesController");
    app.route('/app/user')
        .post(usersList.addUser)
        .get(usersList.getUsers);
    app.route('/app/user/auth')
        .post(usersList.authUser);
    app.route('/app/sites/list/')
        .get(usersList.getNotes);
    app.route('/app/sites')
        .get(usersList.getAllNotes)
        .post(usersList.addNote)
        .delete(usersList.deleteAllNotes);
};