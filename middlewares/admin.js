function admin(req,res,next){

    if(req.user.roles != "admin"){
        return res.status(403).send("You are not authorized to Perform this action!")
    }

    next()

}

module.exports = admin