'use strict'

//IMPORTS
var bcrypt = require('bcrypt-nodejs')
var Usuario = require('../models/usuario')
var jwt  = require("../services/jwt")

function registrarUsuario(req, res){
    var usuario = new Usuario();
    var params = req.body

    if(params.usuario && params.password){
        usuario.nombre = params.nombre
        usuario.telefono = params.telefono
        usuario.usuario = params.usuario
        usuario.password = params.password


        Usuario.find({ $or: [
            {usuario: usuario.usuario},
            {telefono: usuario.telefono}
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({message}).send({message: 'Error en la peticion de usuarios'})
            if(users && users.length >= 1){
                return res.status(500).send({message: 'el usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    usuario.password = hash;

                    usuario.save((err, usuarioGuardado) => {
                        if(err) return res.status(500).send({message: 'error al guardar la hotel'})
                        if(usuarioGuardado){
                            res.status(200).send({usuario: usuarioGuardado})
                        }else{
                            res.status(404).send({message: 'no se ha podido registrar el usuario'})
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
    

    Usuario.findOne({ usuario: params.usuario }, (err, usuario)=>{
        
    if(usuario){
        bcrypt.compare(params.password, usuario.password, (err, check)=>{
            if(check){
                if(params.gettoken){
                        Usuario.findOne({usuario: params.usuario}, {nombre: 1, _id: 0} ,(err, usuarioEncontrado)=>{
                            var nombreUsuario = usuarioEncontrado;
                            return res.status(200).send({ token: jwt.createTokenHotel(usuario), nombreUsuario})
                        })
                        
                }else{
                    usuario.password = undefined;
                    return res.status(200).send({ user: usuario })
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


function editarUsuario(req, res){
    var params = req.body

    delete params.password
        

            Usuario.findByIdAndUpdate(req.user.sub, params, {new: true}, (err, usuarioActualizado) =>{
                if(err) return res.status(500).send({ message: 'error en la peticion' })
                if(!usuarioActualizado) return res.status(404).send({ message: 'no se ha podido modificar el usuario' })
                return res.status(200).send({ usuario: usuarioActualizado})
            })
}

function eliminarUsuario(req, res){
                 Usuario.findByIdAndDelete(req.user.sub, (err, usuarioEliminado) =>{
                        if(err) return res.status(500).send({ message: 'error en la peticion' })
                        if(!usuarioEliminado) return res.status(404).send({ message: 'no se ha podido eliminar el usuario' })
                        return res.status(200).send({ message: 'usuario eliminado' })
                 })
}


module.exports = {
    registrarUsuario,
    login,
    editarUsuario,
    eliminarUsuario
}