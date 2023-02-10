const Router = require('express').Router()
require('dotenv').config()
const usersModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { application } = require('express')

const { verifyAdminToken , verifyToken } = require('../middlewares/authmiddlewares')





Router.post( '/users/login' , (req,res) => {
   usersModel.login(req.body.email , req.body.password).then( (token) => {
        res.status(200).json({token : token  })
   } ).catch( 
    (error) => { 
        if( error.message == 'user account is locked !!!!'  ){
            res.status(423).json(error.message)
        }else{
            res.status(404).json(error.message)
        }
     }
    )
    
} )

application.use(verifyToken)


Router.post('/users' , (req,res) => {
    usersModel.addNewUser(req.body.firstName , req.body.lastName , req.body.email  , req.body.password , req.body.status , req.body.role)
                .then( user => res.status(201).json(user) )
                .catch( err => res.status(404).send(err) )
    })





Router.post('/users/register' , (req,res) =>{
    usersModel.register( req.body.firstName , req.body.lastName , req.body.email,  req.body.password ).then( 
        (user) => res.status(200).json({user : user , msg : 'registred'})
     ).catch( 
        err => {   res.status(404).json({error : err  })}
      )
})

Router.get('/users'  , (req,res) => {

    let token = req.headers.authorization
    let user = jwt.decode( token , {complete : true} )
    usersModel.getUsers().then( users => {
       return res.status(200).json({users : users , user : user })
    } ).catch( (err) => {
        return res.status(404).json(err)
    } )
})

Router.get('/users/:id' , (req,res) => {
    
    usersModel.geUserById(req.params.id).then( user => {
        return res.status(200).json(user)
    } ).catch( err => {
        return res.status(404).json(err)
    })
})

Router.delete('/users/:id' , (req,res) => {
    usersModel.deleteUser(req.params.id).then(
        (user) => { res.json(user) }
    ).catch(
        ( user ) => { res.json(user) }
    )
})

Router.put('/users/:id'  , (req,res) => {
    usersModel.updateUser(req.params.id , req.body.firstName , req.body.lastName , req.body.email ,  req.body.password ,req.body.role ,req.body.status).then(
        (user) => { res.json(user) }
    ).catch(
        ( user ) => { res.json(user) }
    )
})







module.exports = Router