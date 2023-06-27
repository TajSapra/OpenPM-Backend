const pool=require('../../config/postgres')
const bcrypt=require('bcrypt')
const saltRounds=10
array_of_string_to_json=function(data){
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
idgen=function(project_name, owner=''){
    const hash=bcrypt.hashSync(project_name+owner, saltRounds)
    return hash
}
const create_project=async function(req,res){
    if(req.body.emailid==undefined){
        res.json({error:'Email Not Found. Please try again'})
    }
    else{
        try{
            var time=Date()
            const hashed=await idgen(req.body.project_details.name, req.body.emailid)
            data=[req.body.project_details.name, hashed, req.body.emailid, time, req.body.project_details.desc]
            pool.query('Insert into projects(project_name, project_id, project_owner, starting_time, project_desc) values($1, $2, $3, $4, $5)', data).then(async result=>{
                var data2=["Name:"+req.body.project_details.name+", ID:"+hashed+", Owner:"+req.body.emailid+", Time:"+time, req.body.emailid]
                pool.query("Update users set projects = ARRAY_APPEND(projects, $1) where mail=$2", data2).then(async result2=>{
                    const query='SELECT * FROM users WHERE mail=$1'
                    pool.query(query, [req.body.emailid]).then( async result3 => {
                        data=result3.rows[0]
                        data.projects=await array_of_string_to_json(data.projects)
                        data.password=""
                        res.json({success:"Project Created", user:data})
                    })
                })
            })
        }
        catch(err){
            res.json({error:'Email Not Found. Please try again'})
        }
    }
}
module.exports=create_project