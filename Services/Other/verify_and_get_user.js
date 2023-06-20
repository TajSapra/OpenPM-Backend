const pool=require('../../config/postgres')
const bcrypt=require('bcrypt')
const { emailid } = require('../../tokens')
const saltround=10
array_of_string_to_json=async function(data){
    ans=[]
    for(var i=0;i<data.length;i++){
        all=data[i].split(', ')
        curr={}
        curr["Name"]=all[0].split(':')[1]
        curr["ID"]=all[1].split(':')[1]
        curr["Owner"]=all[2].split(':')[1]
        curr["Time"]=all[3].split(':')[1]
        ans.push(curr)
    }
    return ans
}
getuser=async function(req, res){
    const query='SELECT * FROM users WHERE mail=$1'
    const {rows}=await pool.query(query, [req.body.emailid])
    rows[0].projects=await array_of_string_to_json(rows[0].projects)
    if(req.body.secret==undefined&&req.body.password==undefined){
        res.json({error:'Authentication Error. Please try again'})
    }
    else if(req.body.secret==undefined){
        if(req.body.password==rows[0].password){
            rows[0].password=""
            res.json({success : "Updated Successfully", status : 200, user:rows[0]})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
    else{
        if(req.body.secret==rows[0].user_secret){
            rows[0].password=""
            res.json({success : "Updated Successfully", status : 200, user:rows[0]})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
}
module.exports=getuser