sendpic=async function(req, res){
    const curr=req.body.email
    console.log('C:/Users/sapra/Desktop/Taj/webd/React Projects/OpenPM_Backend/photos/'+req.body.email.replaceAll('.', '_')+'.JPG')
    if(req.body.email==undefined){
        res.json({error:'Email Not Found. Please try again'})
    }
    else{
        try{
            res.setHeader('Content-Type', 'image/jpeg');
            res.sendFile('C:/Users/sapra/Desktop/Taj/webd/React Projects/OpenPM_Backend/photos/'+req.body.email.replaceAll('.', '_')+'.JPG')
        }
        catch(err){
            res.json({error:'Email Not Found. Please try again'})
        }
    }
}
module.exports=sendpic