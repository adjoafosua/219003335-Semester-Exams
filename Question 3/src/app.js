const express = require('express')
const bodyParser = require('body-parser')
const config = require('./db/mssql_config')
const sql = require('mssql')

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const port = process.env.PORT || 3000
const dbConn=""
const dbTable = "TblTodoRecord"
app.listen(port, ()=>{
    dbConn = new sql.Connection(config)
    dbConn.connect().then(()=>{
        console.log("Connected to MSSQL Server")
    }).catch(
            err => console
        )
    console.log('Server started. Listening on port '+port)
})

//get todo records
app.get('/todo/get', async(req, res)=>{
    var transaction = new sql.transaction(dbConn)
    await transaction.begin().then(()=>{
        var request = new sql.Request()
        request.query("Select * from "+dbTable).then((response)=>{
            dbConn.close()
            res.send(response).status(200)
        }).catch(
                err => {
                    dbConn.close()
                    res.send({msg:'Error with query',err}).status(400)
                })
    }).catch(
            err => {
                dbConn.close()
                res.send({msg:'Error in transaction',error: err})
            })
})

//post new todo record
app.post('/todo/post', async(req, res)=>{
    var transaction = new sql.transaction(dbConn)
    await transaction.begin().then(()=>{
        var request = new sql.Request()
        request.query("Insert into "+dbTable + "(todoDate,todoTime,todoDesc,status,item)"+
         "values("+req.body.todoDatereq.body.todoTime,req.body.todoDesc,req.body.status,req.body.item).then((response)=>{
            transaction.commit().then((recordSet)=>{
                dbConn.close()
                res.send({msg:'Todo successfully posted',recordSet}).status(200)
            }).catch(err=>{
                dbConn.close()
                res.send({msg:'Commit Error',err}).status(400)
            })
        }).catch(
                err => {
                    dbConn.close()
                    res.send({msg:'Error with query',err}).status(400)
                })
    }).catch(
            err => {
                dbConn.close()
                res.send({msg:'Error in transaction',error: err})
            })
})

//delete todo record
app.delete('/todo/delete/:id', async(req, res)=>{
    var transaction = new sql.transaction(dbConn)
    await transaction.begin().then(()=>{
        var request = new sql.Request()
        await request.query("Delete from "+dbTable+" Where id="+req.params.id).then((response)=>{
            transaction.commit().then((recordSet)=>{
                dbConn.close()
                res.send({msg:'Todo Record deleted',recordSet}).status(200)
            })
        }).catch(
                err => {
                    dbConn.close()
                    res.send({msg:'Error with query',err}).status(400)
                })
    }).catch(
            err => {
                dbConn.close()
                res.send({msg:'Error in transaction',error: err})
            })
})