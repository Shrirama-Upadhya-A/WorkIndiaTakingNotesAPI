var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    Note = require('./api/models/notesModel'),
    routes = require('./api/routes/notesRoutes'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

const basicAuth = require('express-basic-auth');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/notes');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
// app.use(basicAuth({
//     users: { 'admin': 'supersecret' }
// }))
routes(app);

app.get("/", function (req,res) {
    res.send('<h2 style=\"font-family: Malgun Gothic,serif; color: darkred;\">Welcome BOiiss!</h2>');
})
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port);