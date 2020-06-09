const express = require('express')
require('./db/mongoose')
const bodyParser = require('body-parser')
const Student = require('./models/Student')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

//save new student
app.post('/student', async(req,res)=>{
    const student = new Student(req.body)
    await Student.save().then(()=>{
        res.send(student).status(200)
    }).catch(
            err => res.send("Error").status(400)
        )
})

//delete student
app.delete('/student/:id',async(req,res)=>{
    const student = Student.findByIdAndDelete(req.params.id)
    if(!student){
        res.send('Could not delete student').status(400)
    }
    res.send('Student Deleted').status(200)
})

//update student
app.patch('/student',async(req, res)=>{
    try{
        const student = await Student.findByIdAndUpdate(req.body.id, req.body, { new:true, runValidators:true })
        if(!student){
            res.send('Could not update student record').status(400)
        }
        res.send('student record updated').status(200)        
    }catch(e){

    }
})

//get all student record
app.get('/students', async(req, res)=>{
    await Student.find({}).then((student)=>{
        res.send(student)
    })
})
app.listen(port, ()=>{
    console.log('Server started. Listening on port '+port)
})