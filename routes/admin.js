"use strict";

var express = require('express');
var router = express.Router();
var models = require('../models/rdb');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var roles = require('../utils/roles');
var emailUtils = require('../utils/emails');
var errorUtil = require('../utils/errorUtils');
var nconf = require('nconf');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = path.join(__dirname, 'config.json');
nconf.argv().env();
nconf.file({
    file: config
});
const produtosController = require('../controllers/addProduto');
const produtosRefatoradosController = require('../controllers/produtosRefatorados');
const Sequelize = require('sequelize');
const axios = require('axios');

//Gerar Token de Autenticação
var generateToken = function(res, user) {
    var expiresIn = 15778476000; //6 Meses
    var currentDate = new Date();
    var expiresDate = new Date(currentDate.getTime() + expiresIn);
    var payload = {
        id: user.dataValues.Codigo,
        email: user.dataValues.Login,
        role: 'admin'
    }

    //Retornar o token
    var token = jwt.sign(payload, nconf.get('secret'), { // Gerando um token baseado nos dados do usuário
        expiresIn: expiresIn // in seconds
    });
    delete user.dataValues['Senha'];
    res.status(200).json({
        success: true,
        expires: expiresDate,
        token: 'JWT ' + token,
        user: user.dataValues
    });
}


/**
 * @swagger
 * definitions:
 *   Administrador:
 *     properties:
 *       idAdmin:
 *         type: integer
 *       nome:
 *         type: string
 *       email:
 *         type: string
 *       senha:
 *         type: string
 *       provider:
 *         type: string
 *       ativo:
 *         type: boolean
 */



//____________________________________ ADMINISTRADOR _____________________________________________________

/**
 * @swagger
 * /admin/auth:
 *   post:
 *     tags:
 *       - Administrador
 *     description: Autenticar Administrador
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         type: string
 *         description: Email obrigatório
 *         in: formData
 *         required: true
 *       - name: senha
 *         type: string
 *         description: Senha obrigatório
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Dados do Administrador, token JWT
 *       401:
 *         description: Usuário ou senha incorretas
 *       403:
 *         description: Nível de acesso insuficiente, ou acesso a dados de usuário diferente
 *       500:
 *         description: Erro interno do servidor
 *         schema:
 *           $ref: '#/definitions/Administrador'
 */



//pegar todos os códigos promocionais

router.get('/carga/wimoveis/:CodigoGrupo', (req, res) => {
    var params = {
        where: {
            Title: {
                like: "%Wimoveis%"
            },
            Message: {
                like: '%Proc 201809111255 - Grupo ' + req.params.CodigoGrupo + '- Erro%'
            }
        }
    }

    axios.get('http://villarobot.allmatech.com.br/PublicadorWimoveisIWService.svc/PublicarCargaEmergencial?codigoGrupo=' + req.params.CodigoGrupo)
        .then(function(response) {
            models.logs.getAll(params, (data, error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
                if (data.length == '0') {
                    return res.status(200).json(data);
                } else {
                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });


})

router.get('/carga/vivareal/:CodigoGrupo', (req, res) => {
    var params = {
        where: {
            Title: {
                like: "%vivareal%"
            },
            Message: {
                like: '%Proc 201809111255 - Grupo ' + req.params.CodigoGrupo + '- Erro%'
            }
        }
    }

    axios.get('http:///villarobot.allmatech.com.br/PublicadorVivarealService.svc/PublicarCargaEmergencial?codigoGrupo=' + req.params.CodigoGrupo)
        .then(function(response) {
            models.logs.getAll(params, (data, error) => {
                if (error) {

                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
                if (data.length == '0') {
                    return res.status(200).json(data);
                } else {
                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });


})

router.get('/carga/LugarCerto/:CodigoGrupo', (req, res) => {
    var params = {
        where: {
            Title: {
                like: "%vivareal%"
            },
            Message: {
                like: '%Proc 201809111255 - Grupo ' + req.params.CodigoGrupo + '- Erro%'
            }
        }
    }

    axios.get('http://villarobot.allmatech.com.br/PublicadorLugarcertoService.svc/PublicarCargaEmergencial?codigoGrupo=' + req.params.CodigoGrupo)
        .then(function(response) {
            models.logs.getAll(params, (data, error) => {
                if (error) {

                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
                if (data.length == '0') {
                    return res.status(200).json(data);
                } else {
                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });


})


router.get('/carga/UbiPlaces/:CodigoGrupo', (req, res) => {
    var params = {
        where: {
            Title: {
                like: "%UbePlaces%"
            },
            Message: {
                like: '%Proc 201809111255 - Grupo ' + req.params.CodigoGrupo + '- Erro%'
            }
        }
    }

    axios.get('http://villarobot.allmatech.com.br/PublicadorUbiPlacesService.svc/PublicarCargaEmergencial?codigoGrupo=' + req.params.CodigoGrupo)
        .then(function(response) {
            models.logs.getAll(params, (data, error) => {
                if (error) {

                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
                if (data.length == '0') {
                    return res.status(200).json(data);
                } else {
                    return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));
                }
            })
        })
        .catch(function(error) {
            console.log(error);
        });


})


router.get('/usuarios/list', (req, res) => {

    var params = {

        attributes: ['Codigo', 'Login', 'Senha', 'CodigoPessoa', 'Bloqueado'],
        include: [{
            model: models.imobiliarias,
            attributes: ['CodigoGrupo'],
        }]
    }
    models.usuario.getAll(params, (data, error) => {
        if (error) {
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));

        }
        return res.status(200).json(data);
    })
})


router.get('/contaAcesso/:idImobiliaria', (req, res) => {
    var params = {
        where: {
            CodigoPessoaContratante: req.params.idImobiliara
        },
        include: [{
            model: models.usuario,
            attributes: ['Codigo', 'CodigoPessoa', 'Login', 'Senha', 'Bloqueado'],
        }]
    }

    models.ContaAcesso.getAll(params, (data, error) => {
        if (error) {
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));

        }
        return res.status(200).json(data);
    })

})

router.get('/imovel/:CodigoImobiliaria', (req, res) => {

    var params = {
        where: {
            CodigoImobiliaria: 76,
        }
    }

    models.imovel.getAll(params, (data, error) => {
        if (error) {
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));

        }
        return res.status(200).json(data);
    })

})

router.get('/codigo/', (req, res) => {
    var params = {

    }

    models.imobiliarias.getAll(params, (data, error) => {
        if (error) {
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));

        }
        return res.status(200).json(data);
    })

})

router.get('/imobiliaria/', (req, res) => {
    var params = {

    }

    models.imobiliaria.getAll(params, (data, error) => {
        if (error) {
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "usuarios.getAll.error", 500));

        }
        return res.status(200).json(data);
    })

})

router.put('/imobiliaria/:Codigo', (req, res) => {

    var ativo = req.body.ativo;
    var Codigo = req.params.Codigo;

    console.log(ativo,Codigo);
    var params = {
        Ativo: ativo
    }

    var whereParams = {
        Codigo : Codigo
    }

    models.imobiliaria.updateData(whereParams, params, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "admin.update.usuario.error", 500));
        }
        return res.status(200).json(data);
    })

})

router.post('/auth', function(req, res) {
    console.log(req.body)

    var parameters = {
        attributes: ['Codigo', 'Login', 'Senha', 'CodigoPessoa', 'Bloqueado'],
        include: [{
            model: models.imobiliarias,
            attributes: ['CodigoGrupo'],
        }],
        where: {
            Login: req.body.Login,
            Senha: req.body.Senha
        }

    }
    models.usuario.get(parameters, function(user, error) {


        if (error) {
            console.log(error)
            return res.status(500).json(errorUtil.jsonFromError(error, 'unable.to.auth', 500));
        }

        if (user) {

            if (user) {
                generateToken(res, user);
            } else {
                return res.status(401).json({
                    success: false,
                    title: 'unable.to.login',
                    message: 'incorrect.username.password',
                    'code': 52
                });
            }

        } else {
            res
                .status(401)
                .json({
                    success: false,
                    title: "usuario.not.found",
                    message: "usuario.not.found",
                    "code": 50
                });
        }

    });

});



module.exports = router;