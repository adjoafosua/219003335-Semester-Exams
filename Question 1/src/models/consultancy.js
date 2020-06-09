const mongoose = require('mongoose')

const Consultancy = mongoose.model("Consultancy",{
    patient:{
        type:String,
        required:true
    },
    consultDate:{
        type:Date,
        required: true
    },
    consultTime:{
        type:String,
        required: true
    },
    doctor:{
        type:String,
        required: true
    },
    consultAmount:{
        type:Number,
        required: true
    }
})

module.exports = Consultancy