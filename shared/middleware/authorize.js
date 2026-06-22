
const authorize = (role) => {

    return (req,res,next)=>{ 
    
        if(!req.user.role.includes(role)){
            return res.status(403).json({message : 'Access Denied'});
        }

        next();
    }

}

module.exports = authorize;