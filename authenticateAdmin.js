
module.exports = function authenticateAdmin(req,res,next){
    try{
        if(typeof req.userInfo.role == 'undefined'){
            res.status(401).send('Access Denied: no user role found');
        }
        else{
            if(req.userInfo.role != 'admin'){
                res.status(401).send('Access Denied: restricted to admin');
            }
            else {
                console.log('Access Accepted with admin identity');
                next();
            }
        }
    }
    catch(err){
        console.log('Error: ',err);
        res.status(500).send('Something went wrong' + err);
    }
}