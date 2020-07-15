'use strict'

//IMPORTS
var bcrypt = require('bcrypt-nodejs')
var Hotel =  require('../models/hotel')
var jwt  = require("../services/jwt")


function registrarHotel(req, res){
    var hotel = new Hotel();
    var params = req.body

    if(params.nombreHotel && params.password && params.usuario){
        hotel.nombreHotel = params.nombreHotel
        hotel.numeroTelefono = params.numeroTelefono
        hotel.direccion = params.direccion
        hotel.usuario = params.usuario
        hotel.password = params.password
        hotel.valoracion = params.valoracion
        hotel.fecha = params.fecha
        hotel.precio    = params.precio


        Hotel.find({ $or: [
            {usuario: hotel.usuario},
            {nombreHotel: hotel.nombreHotel}
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({message}).send({message: 'Error en la peticion de hoteles'})
            if(users && users.length >= 1){
                return res.status(500).send({message: 'el usuario de hotel ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    hotel.password = hash;

                    hotel.save((err, hotelGuardado) => {
                        if(err) return res.status(500).send({message: 'error al guardar la hotel'})
                        if(hotelGuardado){
                            res.status(200).send({hotel: hotelGuardado})
                        }else{
                            res.status(404).send({message: 'no se ha podido registrar la hotel'})
                        }
                        
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        })
    }
}


function login(req, res){
    var params = req.body
    

    Hotel.findOne({ usuario: params.usuario }, (err, hotel)=>{
        
    if(hotel){
        bcrypt.compare(params.password, hotel.password, (err, check)=>{
            if(check){
                if(params.gettoken){
                        Hotel.findOne({usuario: params.usuario}, {nombreHotel: 1, _id: 0} ,(err, hotelEncontrado)=>{
                            var nombreHotel = hotelEncontrado;
                            return res.status(200).send({ token: jwt.createTokenHotel(hotel), nombreHotel})
                        })
                        
                }else{
                    hotel.password = undefined;
                    return res.status(200).send({ user: hotel })
                }

            }else{
                return res.status(404).send({ message: 'El usuario no se ha podido identificar' })
            }
        })
    }else{
        return res.status(404).send({ message: 'El usuario no se ha podido logear' })
    }
    })
}

function editarHotel(req, res){
    var params = req.body
    delete params.password

    Hotel.findByIdAndUpdate(req.hotel.sub, params, {new: true}, (err, hotelActualualizado) =>{
        if(err) return res.status(500).send({ message: 'error en la peticion' })
        if(!hotelActualualizado) return res.status(404).send({ message: 'no se ha podido modificar el hotel' })
       return res.status(200).send({ hotel: hotelActualualizado })
    })
}



function eliminarHotel(req, res){

    Hotel.findByIdAndDelete(req.hotel.sub, (err, hotelEliminado) =>{
        if(err) return res.status(500).send({ message: 'error en la peticion' })
        if(!hotelEliminado) return res.status(404).send({ message: 'no se ha podido eliminar el hotel' })
        //Empleado.deleteMany({"ubicacion.hotel": empresaId}).exec();
       // Sucursal.deleteMany({hotel: empresaId}).exec();
        return res.status(200).send({ message: 'hotelEliminado' })
    })
}


function buscarHotelMayorMenor(req, res) {
    
    var descendente  = req.body.descendente;
    var alfabetico = req.body.alfabetico;
    
        if(descendente == 1 && alfabetico == 1){
            return res.status(500).send({message: 'escoga solo una manera'})
        }else if (alfabetico == 1) {
            Hotel.find({}).sort({nombreHotel: 1}).exec( (err, hotelesEncontrados)=>{
                  if(err) return res.status(500).send({ message: 'Error en la peticion de Hoteles' })
                 if(!hotelesEncontrados) return res.status(404).send({ message: 'No se han podido listar los hote;es' })
                 return res.status(200).send({ Hoteles: hotelesEncontrados })
             })
        }else if(descendente == 1){
            Hotel.find({}).sort({precio: -1}).exec( (err, hotelesEncontrados)=>{
                if(err) return res.status(500).send({ message: 'Error en la peticion de Hoteles' })
                if(!hotelesEncontrados) return res.status(404).send({ message: 'No se han podido listar los hote;es' })
                return res.status(200).send({ Hoteles: hotelesEncontrados })
            })
        }else{
            Hotel.find({}).sort({nombre:1}).exec( (err, hotelesEncontrados)=>{
                 if(err) return res.status(500).send({ message: 'Error en la peticion de Hoteles' })
                 if(!hotelesEncontrados) return res.status(404).send({ message: 'No se han podido listar los hote;es' })
                 return res.status(200).send({ Hoteles: hotelesEncontrados })
             })
        }
}

function buscarHotelFecha(req, res) {
    var params = req.body
    var fechaInicio = params.fechaInicio
    var fechaFinal = params.fechaFinal
    
    Hotel.find({fecha:{$lte: fechaFinal}, fecha:{$gt: fechaInicio}}, (err, hotelesEncontrados)=>{
        if(err) return res.status(500).send({ message: 'error en la peticion de hoteles' })
        if(!hotelesEncontrados) return res.status(404).send({ hoteles:hotelesEncontradosoli})

        return res.status(200).send({ hoteles: hotelesEncontrados })
    })
}


function buscarHotelesCali(req, res) {
    var params = req.body;

    Hotel.find({valoracion : params.valoracion}, (err, hotelesEncontrados)=>{
        if(err) return res.status(500).send({ message: 'error en la peticion de hoteles' })
        if(!hotelesEncontrados) return res.status(404).send({ message: 'Error al listar los hoteles' })

        return res.status(200).send({ Hoteles: hotelesEncontrados })
    })
}






module.exports = {
    registrarHotel,
    editarHotel,
    eliminarHotel,
    login,
    buscarHotelMayorMenor,
    buscarHotelFecha,
    buscarHotelesCali
}