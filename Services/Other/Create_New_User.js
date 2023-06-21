const pool=require('../../config/postgres')
const bcrypt=require('bcrypt')
const multer  = require('multer')
const fs=require('fs')
const saltround=10
const storageimg=multer.diskStorage({
	destination:(req, file, cb) =>{
		curr_email=req.body.User_email.replaceAll('.', '_')
        console.log(curr_email)
        if(fs.existsSync(`./photos/`)){
            cb(null, `./photos/`)
        }
        else{
            fs.mkdirSync(`./photos/`,{recursive:true})
            cb(null, `./photos/`)
        }
    },
	filename:function(req,file,cb){
		curr_email=req.body.User_email.replaceAll('.', '_')
        console.log(curr_email)
		cb(null, curr_email+'.jpg')
	}
})
const upload_img=multer({
    storage:storageimg,
    fileFilter: (req, file, cb) => {
        if(file.mimetype!='image/jpg'&&file.mimetype!='image/jpeg'){
            cb(null, false)
            console.log("Error here")
            return cb(new Error('Only .jpg format allowed!'))
        }
        console.log(req.body)
        cb(null, true)
    }
}).single('upload_image')

addnewuser=async function(req, res){
    pool.query('Select * from users where mail=$1', [req.body.User_email]).then(result=>{        
        if(result.rows.length>0){
            res.json({message:'User Account Already exists'})
        }
        else{
            const hash=bcrypt.hashSync(req.body.User_email+req.body.User_name, saltround)
            var userdata=[req.body.User_email, req.body.User_name, hash, req.body.User_org, req.body.password]
            pool.query('INSERT into users(mail, username, user_secret, organisation, password) VALUES($1,$2,$3,$4,$5)',userdata)
            console.log(userdata)
            res.json({message:'New Account Created'})
        }
    })
}
module.exports={addnewuser,upload_img}