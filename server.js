const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000

app.use(cors(
    {origin: "localhost:8080",credentials: true}
));

app.use(bodyParser.json());

/*const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#GnhW*!9g27$%tc#&%",
    database: "codeaid",
    port: "3306"
});*/

/*const conn = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12600722",
    password: "QEWCp47aWv",
    database: "sql12600722",
    port: "3306"
});*/

// const conn = mysql.createConnection({
//     host: "db4free.net",
//     user: "root00",
//     password: "#GnhW*!9g27$%tc#&%",
//     database: "codeaid",
//     port: "3306"
// });

const conn = mysql.createConnection({
    host: "bwq55nufgkyo3jfrokkb-mysql.services.clever-cloud.com",
    user: "u71gidsmoszdrlzp",
    password: "bwq55nufgkyo3jfrokkb",
    database: "bwq55nufgkyo3jfrokkb",
    port: "3306"
});

conn.connect(async(err)=>{
    if(err) throw err;
    console.log("Connection Successful"); 
});

app.set("view engine","ejs");

//Getting all Subjects
app.post('/subjects',(req,res)=>{
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Max-Age", "1800");
    // res.setHeader("Access-Control-Allow-Headers", "content-type");
    // res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    // res.setHeader("Content-Type", "application/json;charset=utf-8"); // Opening this comment will cause problems
    if(Object.keys(req.body).length==0){
        conn.query("SELECT subject_name FROM subjects",async(err,result)=>{
            if(err) throw err;
            res.end(JSON.stringify(result));
        });
    }
    else{
        if(req.body.addsubj){
            var nsub = req.body.addsubj;
            conn.query("INSERT INTO subjects(`subject_name`,`created_by`,`created_at`) VALUES('"+nsub+"','Bhaskar',current_timestamp())",async(err,result)=>{
                if(err) throw err;
                conn.query("CREATE TABLE `"+nsub+"`(`sno` int NOT NULL AUTO_INCREMENT,`question_name` varchar(150) NOT NULL,`code` varchar(4000) NOT NULL,`output` varchar(2000) NOT NULL,`created_by` varchar(45) NOT NULL,`created_at` datetime NOT NULL,PRIMARY KEY (`sno`),UNIQUE KEY `sno_UNIQUE` (`sno`))",async(err,result)=>{
                    if(err) throw err;
                    res.end("Subject Added Successfully");
                });
            });
            res.end("Subject Created Successfully");

            // CREATE TABLE `oops in c++` (
            //     `sno` int NOT NULL AUTO_INCREMENT,
            //     `question_name` varchar(150) NOT NULL,
            //     `code` varchar(4000) NOT NULL,
            //     `output` varchar(2000) NOT NULL,
            //     `created_by` varchar(45) NOT NULL,
            //     `created_at` datetime NOT NULL,
            //     PRIMARY KEY (`sno`),
            //     UNIQUE KEY `sno_UNIQUE` (`sno`)
            // );
            

        }
    } 
    
})

//Getting all questions of a subject
app.post('/subjects/:subj',(req,res)=>{
    if(Object.keys(req.body).length==0){
        var tname=req.params.subj.toLowerCase();
        conn.query("SELECT question_name FROM `"+tname+"`",async(err,result)=>{
            if(err) throw err;
            res.end(JSON.stringify(result));
        })
    }
    else{
        var aq = req.body.addques;
        var ac = req.body.addcode;
        var ao = req.body.addoutput;
        if(aq&&ac&&ao){
            var sname=req.params.subj.toLowerCase();
            conn.query("INSERT INTO `"+sname+"`(`question_name`,`code`,`output`,`created_by`,`created_at`) VALUES('"+aq+"','"+ac+"','"+ao+"','Bhaskar',current_timestamp())",async(err,result)=>{
                if(err) throw err;
                res.end("Question Added Successfully");
            });
        }
    }
});


app.post('/subjects/:subj/:ques',(req,res)=>{
    var sname = req.params.subj.toLowerCase();
    var qname = req.params.ques.toLowerCase();
    if(Object.keys(req.body).length==0){
    //Getting code and output of a question
    
    conn.query("SELECT code,output FROM `"+sname+"`WHERE question_name='"+qname+"'",async(err,result)=>{
        if(err) throw err;
        res.end(JSON.stringify(result));
    })
    }
    
    else{
        //Updating code of a question in a subject
        if(req.body.ncode){
            var ncode = req.body.ncode;
            conn.query("UPDATE `"+sname+"` SET `code`='"+ncode+"' WHERE question_name='"+qname+"'",async(err,result)=>{
                if(err) throw err;
                res.end("Updated Successfully");
            })
        }
        //Updating output of a question in a subject
        else if(req.body.noutput){
            var noutput = req.body.noutput;
            conn.query("UPDATE `"+sname+"` SET `output`='"+noutput+"' WHERE question_name='"+qname+"'",async(err,result)=>{
                if(err) throw err;
                res.end("Updated Successfully");
            })
        }
    }
});

app.listen(port,()=>{
    console.log("App is listening on PORT 4000");
})
