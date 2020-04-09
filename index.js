const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'xxxxxxxx',
    database:'employeesdatabase'
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('Connected!');
    else
    console.log('Failed! \n Error'+JSON.stringify(err, undefined, 2));

});


app.listen(3000, ()=>console.log('Server running at port number 3000'));

//get all employees data
app.get('/employees', (req, res)=>{
    mysqlConnection.query('SELECT * FROM Employee', (err, results, fields)=>{
        if(!err)
        res.send(results);
        else
        console.log(err);
    });
});

//get an employee
app.get('/employees/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM Employee WHERE EmpID = ?', [req.params.id], (err, results, fields) =>{
        if(!err)
        res.send(results)
        else
        console.log(err);
    });
});

//delete an employee
app.delete('/employees/:id', (req, res) =>{
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?', [req.params.id], (err, results, fields) =>{
        if(!err)
        res.send('Employee deleted successfuly');
        else
        console.log(err)
    });

});

//Insert an Employee
app.post('/employees', (req, res)=>{
    let emp = req.body;
    var sql  = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
                CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, results, fields)=>{
        if(!err)
            results.forEach(element => {
                if(element.constructor == Array)
                res.send("Inserted Employee" +element[0].EmpID);
            });
        else
        console.log(err);
    })

}); 

//Update an Employee
app.put('/employees', (req, res)=>{
    let emp = req.body;
    var sql  = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
                CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, results, fields)=>{
        if(!err)
           res.send('Employee updated successfully');
        else
        console.log(err);
    })

}); 