//Requires
var express = require('express');
var bcrypt  = require('bcryptjs');
var jwt     = require('jsonwebtoken');

//Inicializar variables
var app = express();

var SEED = require('../config/config').SEED;

var Usuario = require("../models/usuario");

app.post('/', (req, res) =>{

    var body = req.body;

    Usuario.findOne({ email : body.email }, (err, usuarioBd) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar Usuarios",
              errors: err
            });
        }

        if(!usuarioBd){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - email",
                errors: err
            });
        }

        if(!bcrypt.compareSync( body.password, usuarioBd.password)){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectas - password",
                errors: err
            });
        }

        //crear token
        usuarioBd.password = ':)';
        var token = jwt.sign({ usuario : usuarioBd }, SEED, { expiresIn : 14400 });

        res.status(200).json({
            ok: true,
            usuario : usuarioBd,
            token : token,
            id : usuarioBd._id
        });

    });

});



module.exports = app;