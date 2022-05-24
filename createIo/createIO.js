const fs = require('fs')

// fs.readFile('./readFile/res/sayori.mp4',(err,res) =>{
//     if(err){
//         return console.log(err);
//     }
//     console.log(res);
// })

function createNamespace(io, theIO) {
    console.log('creating namespace');

    theIO.on('connection', (socket) => {
        // console.log(theIO);
        // console.log(io);
        // console.log(socket.nsp);
        // const parentNameSpace = theIO
        const namespace = socket.nsp

        const { username } = socket.decoded
        let { room } = socket.decoded

        socket.join(`room${room}`)
        socket.emit('fir_connect', room)

        console.log(`${username} connected in ${namespace.name} room${room}`);

        fs.readFile('./readFile/res/sayori.mp4',(err,res) =>{
            if(err){
                return console.log(err);
            }
            console.log(res);
            socket.emit('mp4IO', res)
        })

        //室内广播 所有人
        // namespace.to(`room${room}`).emit('display', `${username} Join ${socket.nsp.name} room${room}`);
        //室内广播，except self
        socket.to(`room${room}`).emit('display', `${username} Join ${namespace.name} room${room}`);
        //给自己显示
        socket.emit('display', `You Join ${namespace.name} room${room}`)

        socket.on('disconnecting', () => {
            socket.rooms.delete(socket.id)
            console.log(Array.from(socket.rooms)[0]);//room1
        })

        socket.on('disconnect', () => {
            console.log(`${username} disconnected`);
            //室内广播，except self
            socket.to(`room${room}`).emit('display', `${username} Off Line`)
        })

        socket.on('chat message', (message) => {
            const msg = `${username}: ${message}`
            console.log(msg);
            //室内广播 所有人
            namespace.to(`room${room}`).emit('display', msg)
            // socket.to(`room${room}`).emit('display', msg)
            // socket.emit('display', msg)
        })

        socket.on('change room', (message, callback) => {

            //室内广播，except self
            socket.to(`room${room}`).emit('display', `${username} Leave ${socket.nsp.name} room${room}`)
            socket.leave(`room${room}`)
            room = message
            socket.join(`room${room}`)
            //室内广播，except self
            socket.to(`room${room}`).emit('display', `${username} Join ${socket.nsp.name} room${room}`)
            //给自己显示 -- client会把这条给自己看的清除
            // socket.emit('display', `You Join ${socket.nsp.name} room${room}`)
            callback({
                status: 200,
                data: {
                    room: room,
                    namespace: socket.nsp.name
                }
            })
        })

        socket.on("error", (err) => {
            console.log(err);
        });

        io.engine.on("connection_error", (err) => {
            console.log('connection_error');
        });

    })

}

module.exports.createNamespace = createNamespace