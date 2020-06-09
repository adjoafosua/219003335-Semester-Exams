const mongoose = require('mongoose')

const Payments = mongoose.model('Payments',{
    patient:{

    },
    paymentDate:{
        type: Date,
        required: true,
    },
    amountPaid:{
        type:Number
    },
    balanceRem:{
        type:Number
    }
})

module.exports = Payments