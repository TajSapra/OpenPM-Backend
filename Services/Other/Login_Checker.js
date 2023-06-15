const pool=require('../../config/postgres')
const bcrypt=require('bcrypt')
const saltround=10
loginChecker=async function(req, res){
    const query='SELECT * FROM users WHERE mail=$1'
    const {rows}=await pool.query(query, [req.body.emailid])
    if(req.body.secret==undefined&&req.body.password==undefined){
        res.json({error:'Authentication Error. Please try again'})
    }
    if(req.body.secret==undefined){
        if(req.body.password==rows[0].password){
            res.json({success : "Updated Successfully", status : 200, user: rows[0]})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
    else{
        if(req.body.secret==rows[0].user_secret){
            res.json({success : "Updated Successfully", status : 200, user: rows[0]})
        }
        else{
            res.json({error:'Authentication Error. Please try again'})
        }
    }
}
module.exports=loginChecker