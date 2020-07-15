var express = require("express")
var usuarioController = require("../controllers/usuarioController")
var md_auth = require('../middlewares/authenticated')

//RUTAS
var api = express.Router();
api.post('/registrarUsuario', usuarioController.registrarUsuario)
api.post('/loginUser', usuarioController.login)
api.put('/editarUsuario', md_auth.ensureAuthUser, usuarioController.editarUsuario)
api.delete('/eliminarUsuario', md_auth.ensureAuthUser, usuarioController.eliminarUsuario)

module.exports = api;