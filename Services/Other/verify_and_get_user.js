const pool=require('../../config/postgres')
const bcrypt=require('bcrypt')
const saltround=10
getuser=async function(req, res){
    const query='SELECT * FROM users WHERE mail=$1'
    const {rows}=await pool.query(query, [req.body.emailid])
    if(req.body.secret==undefined&&req.body.password==undefined){
        res.json({error:'Authentication Error. Please try again'})
    }
    temp_ans={}
    temp_ans['username']=rows[0]['username']
    temp_ans['mail']=rows[0]['mail']
    temp_ans['organisation']=rows[0]['organisation']
    temp_ans['projects']=rows[0]['projects']
    temp_ans['completed_tasks']=rows[0]['completed_tasks']
    temp_ans['assigned_tasks']=rows[0]['assigned_tasks']
    if(req.body.secret==undefined){
        if(req.body.password==rows[0].password){
            res.json({success : "Updated Successfully", status : 200, user: temp_ans})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
    else{
        if(req.body.secret==rows[0].user_secret){
            res.json({success : "Updated Successfully", status : 200, user: temp_ans})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
}
module.exports=getuser