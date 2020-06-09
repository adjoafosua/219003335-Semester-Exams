const express = require('express')
const path = require('path')
const app = express()
const Patient = require('./models/patients')
const Consultancy = require('./models/consultancy')
const Payments = require('./models/payments')
const moment = require('moment')

require('./db/mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const publicDirectory = path.join(__dirname,'/public')
const port = process.env.PORT || 3000
console.log(publicDirectory)

// set the view engine to ejs
app.set('views',path.join(__dirname,'/views'))
app.set('view engine', 'ejs');
console.log(path.join(__dirname,'/views'))
app.use(express.static(publicDirectory))
//app.use(express.json())

//patient routes
app.post('/newPatient',(req,res)=>{
    const patient = new Patient(req.body)
    patient.save().then(()=>{
        Patient.find({}).then((patient)=>{
            console.log(patient)
            res.render('patients',{
                data: patient,
                errors: {},
                status:'none'
            })
        })
    }).catch(
            err => console.log(err)
        )
})

//delete patient
app.get('/deletePatient',async (req,res)=>{
    try{
        const pat = await Patient.findByIdAndDelete(req.query.id)
        if(!pat){
            res.render('/patients',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Patient.find({}).then((patient)=>{
            console.log(patient)
            res.render('patients',{
                data: patient,
                errors: {},
                status:'none'
            })
        })

    }catch (err) {
    }
})

//update Patient record
app.patch('/updatePatient/:id',async(req,res)=>{
    try{
        const pat = await Patient.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })
        if(!pat){
            res.render('/patients',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Patient.find({}).then((patient)=>{
            console.log(patient)
            res.render('patients',{
                data: patient,
                errors: {},
                status:'none'
            })
        })
        
    }catch(e){

    }
})

//consultancy routes
//add consultancy routes
app.post('/newconsultancy',async (req,res)=>{
    var fn = "";
    Patient.findById(req.body.pid,{fullname:1,_id:0}).then((fullname)=>{
        fn=fullname
        console.log(fn)
    })
    const consultancy = new Consultancy({
        ...req.body,
        patient:fn
    })
    await consultancy.save().then(()=>{
        consultancy.find({}).then((consult)=>{
          Patient.findById(consult.patient,'fullname').then((fullname)=>{
              Patient.find({},{fullname:1,_id:1}).then((pat)=>{
                  res.render('consultancy',{
                      data: consult,
                      errors: {},
                      status:'none',
                      pats:pat,
                      fullname: fullname
                  })
              })
          })  
      })
  }).catch(
          err => console.log(err)
      )
})

//update consultancy record
app.patch('/updateConsultancy/:id',async(req,res)=>{
    try{
        const consult = await Consultancy.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })
        if(!pat){
            res.render('/consultancy',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Consultancy.find({}).then((consult)=>{
            res.render('consultancy',{
                data: consult,
                errors: {},
                status:'none'
            })
        })
        
    }catch(e){

    }
})

//delete consultancy
app.delete('/deleteConsultancy/:id',async (req,res)=>{
    try{
        const consult = await Consultancy.findByIdAndDelete(req.params.id)
        if(!pat){
            res.render('/consultancy',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Consultancy.find({}).then((consult)=>{
            res.render('consultancy',{
                data: consult,
                errors: {},
                status:'none'
            })
        })

    }catch (err) {
    }
})

//payments routes
//add new Payment
app.post('/newPayment',(req,res)=>{
    const payment = new Payments(req.body)
    payment.save().then(()=>{
        payment.find({}).then((pay)=>{
            res.render('consultancy',{
                data: pay,
                errors: {},
                status:'none'
            })
        })
    }).catch(
            err => console.log(err)
        )
})

//update Payment record
app.patch('/updatePayment/:id',async(req,res)=>{
    try{
        const pay = await Payments.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true })
        if(!pat){
            res.render('/payment',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Payments.find({}).then((pay)=>{
            res.render('payment',{
                data: consult,
                errors: {},
                status:'none'
            })
        })
        
    }catch(e){

    }
})

//delete Payment
app.delete('/deletePayment/:id',async (req,res)=>{
    try{
        const payment = await Payments.findByIdAndDelete(req.params.id)
        if(!pat){
            res.render('/payment',{
                data:{},
                error:{},
                status:'failed'
            }).status(400)
        }

        await Payments.find({}).then((pay)=>{
            res.render('payment',{
                data: pay,
                errors: {},
                status:'none'
            })
        })

    }catch (err) {
    }
})

 app.get("/login",(req,res)=>{
     res.render('login')
 })

 app.get("/",async (req,res)=>{
    await Consultancy.find({}).then((consult)=>{
        Patient.find({},{fullname:1,_id:1}).then((pat)=>{
            res.render('consultancy',{
                data: consult,
                errors: {},
                status:'none',
                pats:pat
            })
        })
    })
})

 app.get("/signup",(req,res)=>{
    res.render('signup')
})

app.get("/lnk_patient",async (req,res)=>{
    await Patient.find({}).then((patient)=>{
        console.log(patient)
        res.render('patients',{
            data: patient,
            errors: {},
            status:'none'
        })
    })
})

app.get("/lnk_payment",async (req,res)=>{
    await Payments.find({}).then((pay)=>{
        res.render('payment',{
            data: pay,
            errors: {},
            status:'none'
        })
    })
})

app.listen(port, ()=>{
    console.log('Server started. Listening on port '+port)
})