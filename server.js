// call need package and defines port and some instances
var express = require('express'),
    app = express(),
    bodyPasrer = require('body-parser');
var port = 8080;
var router = express.Router();

// model instances
var User = require('./app/models/user');

// user boduy parser to get data from HTTP request
app.use(bodyPasrer.urlencoded({
    extended:true
}));
app.use(bodyPasrer.json());

// create connection to Mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/study_kasus_nodejs', { useNewUrlParser: true } );
var db = mongoose.connection;

// added check for DB connection
if (!db)
    console.log("Error Connecting Database..")
else
    console.log("Database Connected Successfully..")

// API routes
router.get('/', function(req, res){
    res.json({
        message:"Welcome to REST API sample"
    });
});

// model related routes
// post : create user
// get : get all user
router.route('/users')
    .post(function(req, res){
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        user.save(function(err){
            if(err) res.send(err);
            else res.json({
                message:'new user created'
            });
        });
    })
    .get(function(req, res){
        User.find(function(err, users){
            if(err) res.send(err);
            else res.json(users);
        });
    });

router.route('/users/:username')
    .get(function(req, res){
        User.findOne({
            username:req.params.username
        }, function(err,user){
            if(err) res.send(err);
            else res.json(user);
        });
    })
    .put(function(req, res){
        User.findOne({
            username:req.params.username
        },function(err, user){
            if(err) res.send(err);
            else{
                user.username = req.body.username;
                user.password = req.body.password;
                user.name = req.body.name;
                user.email = req.body.email;
                user.save(function(err){
                    if(err) res.send(err);
                    else res.json({
                        message:'user updated'
                    });
                });
            }
        });
    })
    .delete(function(req, res){
        User.remove({
            username:req.params.username
        }, function(err, user){
            if (err) res.send(err);
            else res.json({
                message:'user deleted'
            })
        });
    });

app.use('/api', router);
app.listen(port);
console.log('services started at pot : ' +port);
