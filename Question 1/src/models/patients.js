const mongoose = require('mongoose')

const Patient = mongoose.model("Patient",{
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dob:{
        type: Date,
        required: true,
        trim: true
    },
    contactNumber:{
        type:String,
        trim:true,
        default:'NA'
    },
    residentialAdress:{
        type: String,
        trim: true,
        default:'NA'
    },
    emergancyNumber:{
        type:String,
        trim: true,
        default:"NA"
    },
    fullname:{
        type: String
    }
})

module.exports = Patient