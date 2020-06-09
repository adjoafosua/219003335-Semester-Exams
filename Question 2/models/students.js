const mongoose = require('mongoose')

const Student = mongoose.model('Mongoose',{
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required: true
    },
    contactNumber:{
        type: String,
        required:true,
    }
})

module.exports = Student