verifyToken = (req,res , next) => {
    let token = req.headers.authorization
    if(!token){
        res.status(401).json({ msg : 'access rejected....!!!'  })
    }

    try{
        jwt.verify(token ,privateKey)
        next()
    }catch(e){
        res.status(404).json({  e })
    }

}

// Verify admin Token

verifyAdminToken = (req,res , next) => {
    let token = req.headers.authorization
    if(!token){
        res.status(404).json({ msg : 'access rejected....!!!'  })
    }
 
 
    jwt.verify(token ,privateKey , (err , payload) => {
        if(err) {
            res.send({ err })
        }else{
            let role = payload.role
            if(role !== 'Admin'){
                res.status(401).json({ msg : 'access rejected....!!!'  })
            }
        }
    } )
    next()
}

module.exports = { verifyAdminToken , verifyToken }