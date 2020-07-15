var express = require("express")
var hotelController = require("../controllers/hotelController")
var md_auth = require('../middlewares/authenticated')

//RUTAS
var api = express.Router();
api.post('/registrarHotel',hotelController.registrarHotel)
api.post('/login', hotelController.login)
api.put('/editarHotel', md_auth.ensureAuthHotel, hotelController.editarHotel)
api.delete('/eliminarHotel', md_auth.ensureAuthHotel, hotelController.eliminarHotel)
api.get('/buscarHotelMayorMenor', hotelController.buscarHotelMayorMenor)
api.get('/buscarHotelFecha', hotelController.buscarHotelFecha)
api.get('/buscarHotelCalificacion', hotelController.buscarHotelesCali)


module.exports = api;