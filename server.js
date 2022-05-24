const express = require('express');

const http = require('http');
const { secretKey } = require('./secret/secretKey.js')

const cors = require('cors')

const api = require('./api/api.js')

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api', api)

app.use((err, req, res, next) => {
    console.log(err);
    res.send(err)
})

const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: true
    // cors:{
    //     origin:'http://10.1.83.123:3000/'
    // }
})

const jwt = require('jsonwebtoken')

const namespace = io.of(/^\/[A-Za-z0-9]+$/)

namespace.use((socket, next) => {
    if (socket.handshake.headers.authorization) {
        
        jwt.verify(socket.handshake.headers.authorization, secretKey, (err, decoded) => {
            if (err) {
                next(err)
            }
            else {
                socket.decoded = decoded;
                return next()
            }
        })
    }
})

const { createNamespace } = require('./createIO/createIO.js')
createNamespace(io,namespace)

server.listen(3000, () => {
    console.log('http://127.0.0.1:3000');
});