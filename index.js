const express = require('express')
const app  =express()
const socket = require('socket.io')
const port = 5555;

// require('dotenv').config()
// const port = process.env.PORT
// console.log(port)

//attach socket.io to the server with CORS policy
const server = app.listen(port,()=>{
    console.log("server is running fine",`${port}`)
})
const io = socket(server,{
    cors:{
        origin:"*"
    }
})

//Event listerner for new socket connection
// .on - it listens new connections
io.on('connection',socketClient=>{
    console.log(socketClient.id,"Client id")

    //event listerner for 'MESSAGE' event from the client
    socketClient.on('MESSAGE', (clientData)=>{
        console.log(clientData,"client data is coming")
        socketClient.emit('Client',clientData)
    })

    socketClient.on('BROADCAST', (clientBroardcast)=>{
        console.log(clientBroardcast,"client data is coming")
        io.emit('sendtoall',clientBroardcast)
    })

    socketClient.on('EXCLUSIVEBROADCAST', (exclusiveBroardcast)=>{
        console.log(exclusiveBroardcast,"client data is coming")
        socketClient.broadcast.emit('exclusive',exclusiveBroardcast)
    })

    socketClient.on('JOINROOM', (clientRoom)=>{
        console.log(clientRoom)
        socketClient.join(clientRoom)
        io.to(clientRoom).emit('JoinRoom',"Joined successfully")
        
        socketClient.on('SENDTOROOM',(clientData)=>{
            console.log(clientData);
            io.to(clientRoom).emit('sendtoroomdata',clientData)
            
        })
    })

})

app.get('/',(req,res)=>{
    res.send("home page")
})