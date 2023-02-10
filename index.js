const express = require('express')
const cors = require('cors')
const app = express()
const userRouter = require('./routers/usersRouter')

app.use(cors(
    {origin : '*'}
))
app.use(express.json())



app.use( '/' , userRouter )




app.listen(3000 , () => {
    console.log('listening on 3000')
})