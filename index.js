var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var fileUpload = require('express-fileupload');
var morgan = require('morgan');
var fs = require('fs');
var cors = require('cors');
const { request } = require("express");

var app = express();
var CONNECTION_STRING = "mongodb+srv://phallabot:0963848814@cluster0.r7yu7.mongodb.net/?retryWrites=true&w=majority"
var DATABASE = 'testdb';
var database;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use('/Photos', express.static(__dirname+'/Photos'));
app.use(cors());
app.use(morgan('tiny'));

app.listen(4000, () => {
    console.log("application running on port 4000");
    MongoClient.connect(CONNECTION_STRING, {useNewUrlParser:true},(error,client)=>{
        database=client.db(DATABASE);
        console.log("MongoDB Connection Successfull");
    });
    const apm = require('elastic-apm-node').start({
        serviceName: 'emp-api',
        secretToken: '',
        apiKey: '',
        serverUrl: 'http://128.199.95.186:8200',
      })
});

app.get('/version', (req, res) => {
    res.json(
        {
        version: 'devsecops-18'
        }
    );
});

app.get('/api/check/health', (req,res)=>{
    result ={
        status: 200,
        body: 'ok'
    }
    res.json(result);
});

app.get('/api/department', (req,res)=>{
    database.collection("Department").find({}).toArray((error,result)=>{
        if(error){
            console.log(error);
        }
        res.json(result);
    });
});

app.post('/api/department', (req,res)=>{
    database.collection("Department").count({},(error,numOfDocs)=>{
        if(error){
            console.log(error);
        }
        database.collection("Department").insertOne({
            DepartmentId: numOfDocs+1,
            DepartmentName: req.body['DepartmentName']
        });

        res.json("Added Successfully.");
    });
});

app.put('/api/department', (req,res)=>{
    database.collection("Department").updateOne(
        // Filter Criteria
        {
            "DepartmentId": req.body['DepartmentId']
        },
        //Update
        {$set:
            {
                "DepartmentName": req.body['DepartmentName']
            }
        }
    );
    res.json("Updated Successfully.");
});

app.delete('/api/department/:id', (req,res)=>{
    database.collection("Department").deleteOne({
        DepartmentId:parseInt(req.params.id)
    });
    res.json("Deleted Successfully.");
});


// Employee

app.get('/api/employee', (req,res)=>{
    database.collection("Employee").find({}).toArray((error,result)=>{
        if(error){
            console.log(error);
        }
        res.json(result);
    });
});

app.post('/api/employee', (req,res)=>{
    database.collection("Employee").count({},(error,numOfDocs)=>{
        if(error){
            console.log(error);
        }
        database.collection("Employee").insertOne({
            EmployeeId: numOfDocs+1,
            EmployeeName: req.body['EmployeeName'],
            Department: req.body['Department'],
            DateOfJoining: req.body['DateOfJoining'],
            PhotoFileName: req.body['PhotoFileName']
        });

        res.json("Added Successfully.");
    });
});

app.put('/api/employee', (req,res)=>{
    database.collection("Employee").updateOne(
        // Filter Criteria
        {
            "EmployeeId": req.body['EmployeeId']
        },
        //Update
        {$set:
            {
                "EmployeeName": req.body['EmployeeName'],
                "Department": req.body['Department'],
                "DateOfJoining": req.body['DateOfJoining'],
                "PhotoFileName": req.body['PhotoFileName']
            }
        }
    );
    res.json("Updated Successfully.");
});

app.delete('/api/employee/:id', (req,res)=>{
    database.collection("Employee").deleteOne({
        EmployeeId:parseInt(req.params.id)
    });
    res.json("Deleted Successfully.");
});

app.post('/api/employee/savefile', (req,res)=>{
    fs.writeFile("./Photos/"+ req.files.file.name,
    req.files.file.data, function(error){
        if(error){
            console.log(error);
        }
        res.json(req.files.file.name);
    }
    )
});

