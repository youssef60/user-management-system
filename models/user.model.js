
const  mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const validator = require('validator')

require('dotenv').config()

let url = process.env.URL


async function connectToDB() {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(url)
    } catch (error) {
      console.error('Error connecting to database:', error);
    }
  }
  

  connectToDB()

  
// Handle connection events
mongoose.connection.on('error', (error) => {
console.error('Error in MongoDB connection:', error);
});

//User Schema

let userShema = mongoose.Schema({
    firstName : { type : String , required : true , min : 3 },
    lastName : { type : String , required : true , min : 3 },
    email : { 
        type : String ,
        required : true ,
        unique : true,
        validate : {
            validator : (value) => {
                return validator.isEmail(value)
            },
            message : 'Invalid email format'

        },
        },
    status : { 
        type : String ,
        enum : ['locked' , 'unlocked']        
    }, 
    role : {
        type : String,
        enum : ['Admin' , 'User']
    },
    password : String
})


// User Model
let User = mongoose.model('user' , userShema)




exports.addNewUser = async (firstName , lastName , email , password , status , role ) => {


    try{
         password = await bcrypt.hash(password , 10)
        await User.create({
            firstName,
            lastName,
            email,
            password,
            status,
            role
        }  )    
    }catch(error){
        console.log( error)
    }


   
}

exports.getUsers = async() => {


    try{
        const users = await User.find()
        return users;
    }catch(error){
        throw new Error('error fetching data : ' + error)
    }


}

exports.geUserById = (id) => {


    try{
        const user = User.findById(id);
        return user;
    }catch(error){
        throw new Error(error)
    }

   
}

exports.deleteUser = (id) => {


    try{
        return User.deleteOne({ _id : id })     
    
    }catch(error){
        throw new Error( error )
    }

}


exports.updateUser = async (id , firstName , lastName ,email , password ,   role , status ) => {

    try{

        const hashedPass = await bcrypt.hash(password , 10)
        const res = await User.updateOne( { _id : id } , {$set : {firstName : firstName , role : role, lastName : lastName , password : hashedPass , email : email , status : status  } } )
            return res;
    }catch(error){
        throw new Error(error)
    }

    
}


let privateKey = process.env.PRIVATE_KEY

exports.login = async (email , password) => {


    try{
        const user = await User.findOne( { email : email } )
        if(!user){
            throw new Error('this email doesnt exist')
        }
        try{
            if(user.status === 'locked'){
                throw new Error('user account is locked !!!!')
            }

            const checkPassword = await bcrypt.compare( password , user.password )
           
            if(checkPassword){
                let token = jwt.sign({ id : user.id , role : user.role , firstName : user.firstName } , privateKey , { expiresIn : '1h' })
                return {token};
            }else{
                throw new Error('password incorrect !!!!')
            }
        }catch(error){
            console.log(error.message)
            throw new Error(error.message)
        }

    } catch(error){
        throw new Error(error)
    }


    
}


