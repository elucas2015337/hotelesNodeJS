'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta_2015337'


exports.ensureAuthHotel = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la peticion no tiene la cabeza autenticacion'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        var payload = jwt.decode(token, secret)
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'el token ha expirarado'
            })
        }
    } catch (error) {
        return res.status(404).send({
            message: 'el token no es valido'
        })
    }

    req.hotel = payload
    next()
}


exports.ensureAuthUser = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la peticion no tiene la cabeza autenticacion'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '')

    try {
        var payload = jwt.decode(token, secret)
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                message: 'el token ha expirarado'
            })
        }
    } catch (error) {
        return res.status(404).send({
            message: 'el token no es valido'
        })
    }

    req.user = payload
    next()
}