var mongoose = require('mongoose');

//Article Schema
var homepageSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: String, required: true},
    
    email: {type: String, required: true},
    gender: {type: String, required: true},
    img: {type: String, required: true},
    course: {type: String, required: true},
    
    level: {type: String, required: true},
    
    

});

var Student = module.exports = mongoose.model('Student', homepageSchema);