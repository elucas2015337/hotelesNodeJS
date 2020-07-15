'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    nombreHotel: String,
    numeroTelefono: String,
    direccion: String,
    fecha: Date,
    valoracion: Number,
    usuario: String,
    password: String,
    precio: Number
})

module.exports = mongoose.model('hotel', hotelSchema);