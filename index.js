const express = require('express')
const cors = require('cors')
const app = express()
const routers = require('./routes/index')

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use('/api', routers)

app.get("/", (req,res)=>{
    res.json({
        message:"server running",
        serverTime: new Date()
    })
})

app.get('*', (req,res) => {
    res.status(404).send('not found')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})