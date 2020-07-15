'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    nombre: String,
    telefono: String,
    usuario: String,
    password: String
})

module.exports = mongoose.model('usuario', usuarioSchema);