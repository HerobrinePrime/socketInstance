const express = require('express')
const jwt = require('jsonwebtoken')

const { secretKey } = require('../secret/secretKey.js')
const router = express.Router()

router.post('/login', (req, res) => {
    // throw new Error('safads')
    // console.log(req.body);
    if (
        req.body.name == 'Zireael' && req.body.password == 'herobrine' || 
        req.body.name == 'Seydlitz' && req.body.password == 'sms' || 
        req.body.name == 'Sankarea' && req.body.password == 'sankarea' || 
        req.body.name == 'Jeanne' && req.body.password == 'arc'
        ) {
        const { name, room } = req.body
        const token = jwt.sign({
            username: name,
            room,
        }, secretKey, {
            expiresIn: '5y', algorithm: 'HS256'
        })
        res.send({
            status: 200,
            msg: 'succeeded',
            data: {
                token
            }
        })
    } else {
        res.send({
            status: 500,
            msg: 'failed'
        })
    }

})

// router.post('/namespace',(req,res)=>{
//     res.send({
//         status:200
//     })
// })
// router.use((err, req, res, next) => {
//     console.log(err);
//     res.send(err)
// })

module.exports = router