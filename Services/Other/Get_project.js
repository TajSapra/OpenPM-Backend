const pool=require('../../config/postgres')
const access_allowed=async function(email, project){
    if(email===project['project_owner'])return true;
    if(project['contributors']!=null&&project['contributors'].includes(email))return true;
    return false;
}
const get_project=async function(req,res){
    const {rows}=await pool.query('Select * from projects where project_id=$1', [req.body.projectId])
    // console.log(rows[0])
    if(rows.length==0){
        res.json({error:'No such project found'})
    }
    if(access_allowed(req.body.emailid, rows[0])){
        res.json({success:"Project Details Fetched", status:200, project:rows[0]})
    }
    else{
        res.json({error:'Access to project not allowed'})
    }
}
module.exports=get_project