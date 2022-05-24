//报废


const express = require('express')

const router = express.Router()

router.post('/access',(req,res)=>{
    // console.log('accsee');
    const {username} = req.auth

    res.send({
        status:200,
        msg:'accessable',
        data:{
            username
        }
    })
})

module.exports = router