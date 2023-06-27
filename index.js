const express=require("express");
const bodyParser = require('body-parser')
const path=require('path')
const get_pic=require('./Services/Other/Send_photo_of_user')
const cors=require('cors')
const cookies=require('cookie-parser')
const tokens=require('./tokens.js')
const session=require('express-session')
const expresslayout=require('express-ejs-layouts')
const passport = require('passport');
const get_project=require('./Services/Other/Get_project.js')
const signup=require('./Services/Other/Create_New_User')
const loginChecker=require('./Services/Other/Login_Checker.js')
const create_project=require('./Services/Other/CreateProject')
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
app.post('/signup/add',signup.upload_img ,signup.addnewuser)
app.post('/app/get_user', get_user)
app.post('/app/get_pic',get_pic)
app.post('/app/get_project', get_project)
app.post('/app/create_project', create_project)
app.listen(port, function(err){
    if(err){
        console.error("error on loading server" ,err)
    }
    else{
        console.log(`working on port: ${port}`);
    }
})
