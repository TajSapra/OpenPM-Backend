const express=require("express");
const bodyParser = require('body-parser')
const path=require('path')
const cors=require('cors')
const cookies=require('cookie-parser')
const tokens=require('./tokens.js')
const session=require('express-session')
const expresslayout=require('express-ejs-layouts')
const passport = require('passport');
const loginChecker=require('./Services/Other/Login_Checker.js')
const get_user =require('./Services/Other/verify_and_get_user.js')
const sessionPool = require('pg').Pool
const { Client } = require('pg')
const app=express();
const port=process.env.PORT || 8000;
const pgSession = require('connect-pg-simple')(session)
const sessionDBaccess = new sessionPool({
    user: 'postgres',
    host: 'localhost',
    database: 'OpenPM',
    password: tokens.postgrespassword,
    port: 5432
})
app.use(cors())
app.use(session({
    store: new pgSession({
        pool: sessionDBaccess,
        tableName: 'session'
    }),
    name:'loginsessions',
    secret:'secret',
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, 
    resave: false, 
    saveUninitialized: false,   
}))
app.use(cookies())
app.use(expresslayout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true,}))
app.use(express.urlencoded());         
app.post('/login/checker', loginChecker)
app.post('/app/get_user', loginChecker)
app.listen(port, function(err){
    if(err){
        console.error("error on loading server" ,err)
    }
    else{
        console.log(`working on port: ${port}`);
    }
})
