var errorUtil = require('../utils/errorUtils');
var emailUtils = require('../utils/emails');
var models = require('../models/rdb');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var nconf = require('nconf');


//Gerar Token de Autenticação
var generateToken = function(res, user) {
    var expiresIn = (24 * (60 * 60)); //Valido por um dia
    var currentDate = new Date();
    var expiresDate = new Date(currentDate.getTime() + expiresIn);
    var payload = {
        id: user.dataValues.ID,
        mail: user.dataValues.email,
        role: user.dataValues.role
    }

    //Retornar o token
    var token = jwt.sign(payload, nconf.get('secret'), { // Gerando um token baseado nos dados do usuário
        expiresIn: expiresIn // in seconds
    });
    delete user.dataValues["senha"];
    res.status(200).json({ success: true, expires: expiresDate, token: 'JWT ' + token, user: user.dataValues });
};

const auth = (req, res, next)=> {
    if (!req.body.email || !req.body.senha) {
        return res.status(400).json({ success: false, "message": "email.or.password.not.sent", "code": 66 });
    }
    var parameters = {
        attributes: ['ID', 'nome', 'email', 'senha', 'role', 'ativo'],
        where: {
            email: req.body.email
        }
    }
    models.gerente.get(parameters, function(user, error) {
        console.log(error);
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "unable.to.auth", 500));
           
        }
        if (user) {
            if (user.ativo == false) {
                return res.status(401).json({ success: false, title: "inactive.gerente", message: "inactive.gerente", "code": 160 });
            }
            if (user.validatePassword(req.body.senha)) {
                generateToken(res, user);
            } else {
                return res.status(401).json({ success: false, title: "unable.to.login", message: "incorrect.username.password", "code": 52 });
            }
        } else {
            return res.status(401).json({ success: false, title: "gerente.not.found", message: "gerente.not.found", "code": 50 });
        }
    })
};


const insertGerente = (req, res, next)=>{
    var parameters = {
        nome: req.body.nome,
        senha: req.body.senha,
        telefone : req.body.telefone,
        email: req.body.email,
        imagemUrl: '',
        cpf: req.body.cpf,
        ativo: true
    };
    models.gerente.insert(parameters, function (gerente, error) {
        if (error){
            console.log(error);
            return res.status(500).json(errorUtil.jsonFromError(error, "gerente.insert.gerente.error", 500));
        }
        delete gerente.senha;
        return res.status(200).json(gerente);
    });
};

const getGerentes = (req, res, next)=>{
    var offset = parseInt(req.query['offset']) ? parseInt(req.query['offset']) : 0;
    var limit = parseInt(req.query['limit']) ? parseInt(req.query['limit']) : 10;
    if (limit > 90) {
        return res.status(400).json({ success: false, "message": "limit.out.of.bounds", "code": 63 });
    }
    var params = {
        attributes: ['ID', 'nome', 'email', 'senha', 'cpf', 'telefone', 'role', 'ativo' ,'createdAt', 'updatedAt'],
        //offset: offset,
        //limit: limit
    };

    models.gerente.getAll(params, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "gerente.getAll.gerente.error", 500));
        }
        return res.status(200).json(data);
    })
};

const vincularDistribuidora = (req, res, next)=>{
    if (!req.params.idDistribuidora || !req.body.gerenteID) {
        return res.status(400).json({ success: false, "message": "idDistribuidora.or.gerenteID.was.not.sent", "code": 63 });
    }
    var updateFields = {};

    //Se o gerente foi informado
    if (req.body.gerenteID) {
        updateFields['gerenteID'] = req.body.gerenteID;
    }

    var whereParams = {
        idDistribuidora: req.params.idDistribuidora,
        ativo: true
    };
    models.distribuidora.updateData(whereParams, updateFields, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "update.distribuidora.error", 500));
        }
        delete data.senha;
        return res.status(200).json(data);
    })
};


const deletarGerente = (req, res, next)=>{
    
    if (!req.params.idGerente) {
        return res.status(400).json({ success: false, "message": "idCep.was.not.sent", "code": 63 });
    }

    const ID = req.params.idGerente;

    models.gerente.cancelAndDestroy(ID, function(err, data){
        if (!err) {
      console.log(err);
            return res.status(500).json(errorUtil.jsonFromError(err, "gerente.delete.error", 500));
        }

        return res.status(200).json(data);
    });
}

const getGerenteRevendas = (req, res, next) =>{
  
    if (!req.params.idGerente) {
        return res.status(400).json({ success: false, "message": "idCep.was.not.sent", "code": 63 });
    }
       
    var params = {
        attributes: [
            'idDistribuidora',
            'nome',
            'email',
            'cnpj',
            'role',
            'imagemUrl',
            'ativo',
            'createdAt',
            'deletedAt',
            'updatedAt',
            'valorProduto',
            'horarioInicio',
            'horarioFim',
            'domingoHorarioInicio',
            'domingoHorarioFim',
            'feriadoHorarioInicio',
            'feriadoHorarioFim',
            'anp',
            'codigoCadastro'
        ],
        where: {
          gerenteID : req.params.idGerente
        },
        include:[
            {
                model: models.novoEndereco,
                required: false,
                include: [{
                    attributes: ['ID', 'nome', 'novaCidadeID'],
                    model: models.novoBairro,
                    include: [{
                        model: models.novaCidade,
                        attributes: ['ID', 'nome', 'estadoID'],
                        include: [{
                            model: models.estado,
                            attributes: ['nome', 'acronimo']
                        }]
                    }]
                }]
            }, {
                model: models.telefone,
                required: false
            }, {
                attributes: ['ID', 'nome', 'email'],
                model: models.gerente,
                required: false
            }
        ]
    }
    models.distribuidora.getAll(params, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "admin.get.distribuidora.error", 500));
        }
        return res.status(200).json(data);
    })
}

const getPedidosGerente = (req, res, next) =>{

        var offset = parseInt(req.query['offset']) ? parseInt(req.query['offset']) : 0;
        var limit = parseInt(req.query['limit']) ? parseInt(req.query['limit']) : 10;
        if (limit > 90) {
            return res.status(400).json({ success: false, "message": "limit.out.of.bounds", "code": 63 });
        }
        var params = {
            where: {
              gerenteID : req.params.idGerente
            },
            include: [
                {
                    model: models.pedido,
                    required: false,
                    include: [
                        {
                            model: models.endereco,
                            required: false,
                            attributes: [
                                'endereco','numero', 'bairro', 'cep', 'referencia'
                            ],
                            include: [
                                {
                                    model: models.cidade,
                                    attributes: [
                                        'nome', 'estadoID'
                                    ],
                                    required: false,
                                    include: [
                                        {
                                            model: models.estado,
                                            attributes: [
                                                'nome', 'acronimo'
                                            ],
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        }, {
                            model: models.entregador,
                            attributes: ['idEntregador', 'nome', 'imagemUrl', 'email'],
                            include: [{
                                model: models.entregadorData,
                                attributes: ['point'],
                                required: false
                            }]
                        }, {
                            model: models.usuario,
                            attributes: ['nome', 'idUsuario', 'email', 'telefone', 'imagemUrl'],
                            required: false
                        }, {
                            model: models.novoEndereco,
                            required: false,
                            attributes: [
                                'idEndereco', 'titulo','endereco', 'numero', 'cep', 'referencia'
                            ],
                            include: [
                                {
                                    model: models.novoBairro,
                                    attributes: [
                                        'nome', 'novaCidadeID'
                                    ],
                                    required: false,
                                    include: [
                                        {
                                            model: models.novaCidade,
                                            attributes: [
                                                'nome', 'estadoID'
                                            ],
                                            required: false,
                                            include: [
                                                {
                                                    model: models.estado,
                                                    attributes: [
                                                        'nome', 'acronimo'
                                                    ],
                                                    required: false,
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        };

        models.distribuidora.getAll(params, function (data, error) {
            if (error) {
                return res.status(500).json(errorUtil.jsonFromError(error, "admin.getAll.distribuidora.error", 500));
            }
            return res.status(200).json(data);
        })

};

const getPedidosPendentesGerente = (req, res, next) =>{

    var offset = parseInt(req.query['offset']) ? parseInt(req.query['offset']) : 0;
    var limit = parseInt(req.query['limit']) ? parseInt(req.query['limit']) : 10;
    if (limit > 90) {
        return res.status(400).json({ success: false, "message": "limit.out.of.bounds", "code": 63 });
    }
    var params = {
        where: {
            gerenteID : req.params.idGerente
        },
        include: [
            {
                model: models.pedido,
                required: false,
                where: {
                    statusPedidoUsuario :  11,
                    statusPedidoEntregador : 11
                },
                include: [
                    {
                        model: models.endereco,
                        required: false,
                        attributes: [
                            'endereco','numero', 'bairro', 'cep', 'referencia'
                        ],
                        include: [
                            {
                                model: models.cidade,
                                attributes: [
                                    'nome', 'estadoID'
                                ],
                                required: false,
                                include: [
                                    {
                                        model: models.estado,
                                        attributes: [
                                            'nome', 'acronimo'
                                        ],
                                        required: false
                                    }
                                ]
                            }
                        ]
                    }, {
                        model: models.entregador,
                        attributes: ['idEntregador', 'nome', 'imagemUrl', 'email'],
                        include: [{
                            model: models.entregadorData,
                            attributes: ['point'],
                            required: false
                        }]
                    }, {
                        model: models.usuario,
                        attributes: ['nome', 'idUsuario', 'email', 'telefone', 'imagemUrl'],
                        required: false
                    }, {
                        model: models.novoEndereco,
                        required: false,
                        attributes: [
                            'idEndereco', 'titulo','endereco', 'numero', 'cep', 'referencia'
                        ],
                        include: [
                            {
                                model: models.novoBairro,
                                attributes: [
                                    'nome', 'novaCidadeID'
                                ],
                                required: false,
                                include: [
                                    {
                                        model: models.novaCidade,
                                        attributes: [
                                            'nome', 'estadoID'
                                        ],
                                        required: false,
                                        include: [
                                            {
                                                model: models.estado,
                                                attributes: [
                                                    'nome', 'acronimo'
                                                ],
                                                required: false,
                                            }
                                        ]
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    };

    models.distribuidora.getAll(params, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "admin.getAll.distribuidora.error", 500));
        }
        return res.status(200).json(data);
    })

};

getEntregadores = (req, res, next) =>{
    var params = {
        where: {
            gerenteID : req.params.idGerente
          },
        include: [{
            model: models.entregador,
            attributes: ['idEntregador', 'nome', 'email', 'veiculoMarca', 'veiculoNome', 'veiculoPlaca', 'cpf', 'imagemUrl', 'imgCpf', 'imgRg', 'imgCnh', 'imgCrv', 'createdAt', 'updatedAt','ativo' ],
            required: false,
            include: [{
                model: models.entregadorData,
                required: false
            }]
        }],
    }
    
    models.distribuidora.getAll(params, function (user, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "admin.get.entregadores.error", 500));
        }
        return res.status(200).json(user);
    })
};

module.exports = {
    auth,
    insertGerente,
    getGerentes,
    vincularDistribuidora,
    deletarGerente,
    getGerenteRevendas,
    getPedidosGerente,
    getPedidosPendentesGerente,
    getEntregadores
};