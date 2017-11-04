// Importing Modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); 
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');

// Connection URL
var url = 'mongodb://hello:hello@ds243055.mlab.com:43055/alc-assessment';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
// we're connected!
console.log("Connected correctly to server");
});

// Initializing App
var app = express();

//Bring in models
var Student = require('./models/homepage');

// Load View Engine
app.set('view engine', 'pug');


// Loading body-parser middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false });


// Setting static folder
app.use(express.static('./public/'));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    
    while(namespace.length) {
      formParam += '[' + namespace + ']';
    }

    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Home Route
app.get('/', (req, res) => {
  Student.find({}, (err, students) => {
    if(err) {
      console.log(err);
    }
    else {
      // I also sorted the list so they can be scanned through easily ;-)
      res.render('homepage', {students: students.sort((a,b) => a.lastname > b.lastname ? 1 : -1)});
    }
  });
});

// Student View Route
app.get('/studentview/:id', (req, res) => {
  Student.findById(req.params.id, (err, student) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render('studentview', {student: student});
    }
  });
});

// Student Edit Route
app.get('/studentview/edit/:id', (req, res) => {
  Student.findById(req.params.id, (err, student) => {
    if(err) {
      console.log(err);
      return;
    }
    else {
      res.render('studentedit', {student: student});
    }
  });
  
});
// submit Student Edit route

// Student Add Route
app.get('/student/add', (req, res) => {
  res.render('studentadd');
});


// Submitting Student Add
app.post('/student/add',urlencodedParser, (req, res) => {
  // Validating form
  req.checkBody('firstname', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('lastname', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('phone', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('gender', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('email', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('level', 'Empty or invalid field(s)').notEmpty();
  req.checkBody('course', 'Empty or invalid field(s)').notEmpty();
  

  // Error(s) check
  var errors = req.validationErrors();

  if(errors) {
    res.render('studentadd', {
      errors: errors
    });
  }
  else {
    // Adding new student resource
    var student = new Student();

    student.firstname = req.body.firstname;
    student.lastname = req.body.lastname;
    student.phone = req.body.phone;
    student.email = req.body.email;
    student.gender = req.body.gender;
    student.img = req.body.img;
    student.course = req.body.course;
    student.level = req.body.level;
    

    student.save(err => {
      if(err) {
        console.log(err);
        return;
      }
      else {
        console.log('Student created!');
        
        // Alert for newly added student resource.
        req.flash('success'," student created" );
        res.redirect('/');
      }
    });
  }
});

// After editing student resourse
app.post('/studentview/edit/:id', urlencodedParser, (req, res) => {
  var student = {};
  student.firstname = req.body.firstname;
  student.lastname = req.body.lastname;
  student.phone = req.body.phone;
  student.gender = req.body.gender;
  student.email = req.body.email;
  student.img = req.body.img;
  student.course = req.body.course;
  student.level = req.body.level;
  
  var query = {_id: req.params.id};

  Student.update(query, student, (err) => {
    if(err) {
      console.log(err);
      return;
    }
    else {
      // Alert for saved edit(s).
       // Alert for newly added student resource.
       req.flash('success', 'Hello '+student.firstname+' you just updated your page');
       res.redirect('/');
    }
  });
});

// Deleting Student Resource
app.delete('/studentview/:id', (req, res) => {
  var query = {_id: req.params.id};
  Student.remove(query, err => {
    if(err) {
      console.log(err);
    }
    // Alert for deleted student resource.
    req.flash('danger', 'Student page Deleted.');
    res.send('Success');
  });
});

// Start Server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});