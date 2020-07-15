'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta_2015337';

exports.createTokenHotel = function (hotel){
    var payload = {
        sub: hotel._id,
        nombreHotel: hotel.nombreHotel,
        numeroTelefono: hotel.numeroTelefono,
        direccion: hotel.direccion,
        usuario: hotel.usuario,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix() 
     }
     return jwt.encode(payload, secret)

}

exports.createTokenUsuario = function (user){
    var payload = {
        sub: user._id,
        nombre: user,
        telefono: user.telefono,
        usuario: user.usuario,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix() 
     }
     return jwt.encode(payload, secret)

}