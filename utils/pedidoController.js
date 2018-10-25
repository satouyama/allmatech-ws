"use strict";

/*Created by Neneds*/

var models = require('../models/rdb');
var bCashController = require('../utils/bCashTransactionCreator');
var errorUtil = require('../utils/errorUtils');
var fbaseUtil = require('../utils/firebaseUtils');
var emailUtils = require('../utils/emails');
//Constantes que seguram os valores de creditos
var kCreditValue = 10;
var KLimitCredit = 50;

//var moment = require('moment');

//Funcao que aplica as regras que negócio para Cadastrar pedido

var createPedido = function createPedido(req, res, promoCode, creditValue, callback) {
    var dataPedido = Date();
	//var dataPedido = moment().format();
    var pedidoStatus = 0;
    var valorDesconto = 0;
    var pagamentoStatus = 1;
    var valorPedido = parseFloat(req.body.valorProduto);
    var valorProduto = parseFloat(req.body.valorProduto);
    var valorFinal = 0;
    var tipoPagamento = parseInt(req.body.tipoPagamento);
    var quantidade = parseInt(req.body.quantidade);
    //Verificando se foi passado o idUsuario e o idEntregador
    if (!req.params.idUsuario) {
        return res
            .status(400)
            .json({success: false, "message": "idUsuario", "code": 63});
    }

    // if (!req.body.idEntregador) {
    //     return res
    //         .status(400)
    //         .json({success: false, "message": "missing parameter idEntregador", "code": 63});
    // }
    
    //Verificando o valor do pedido
    if (!valorPedido || valorPedido < 0) {
        return res
            .status(400)
            .json({success: false, "message": "missing parameter valorPedido or its value is invalid", "code": 63});
    }

    //Validando range das opcoes -- RETIRANDO O TIPO DE Pagamento VIA Dinheiro
    if (tipoPagamento <= 0 || tipoPagamento > 4) {
        return res
            .status(400)
            .json({success: false, "message": "invalid.value.for.tipoPagamento", "code": 63});
    }
    //Validando a quantidade
    if (quantidade < 1 || quantidade > 5) {
        return res
            .status(400)
            .json({success: false, "message": "invalid.value.for.quantidade", "code": 63});
    }

    //Multiplicando o valor do pedido pela quantidade
    valorPedido = valorProduto * quantidade;

    //Valor final por enquanto é o mesmo do valor do pedido
    valorFinal = valorPedido;

    var pedidoFields = {};
    //Se for Agendado
    if (req.body.agendamento == 'true') {
        if (!dataPedido) {
            return res
                .status(400)
                .json({success: false, "message": "missing parameter data for agendamento", "code": 63});
        } else {
            pedidoStatus = 1 //Agendado
            dataPedido = Date.parse(req.body.data);
        }

    } else {
        pedidoStatus = 2 //Pronto
    }

    //Se formos utilizar os créditos, vamos calcular o desconto
    if (req.body.usoCredito) {
        //Verificar se ele também tentou enviar o codigo de promocao
        if (req.body.promoCode) {
            return res
                .status(400)
                .json({success: false, "message": "cannot use promoCode and credito", "code": 63});
        }
        pedidoFields['usoCredito'] = true;
        // Vamos calcular o crédito usando o cupom valorDesconto =
        // models.promocao.calculateCredito(req.body.promoCode, valorPedido) Inserir
        // valor do desconto nos parametros
        valorDesconto = parseFloat(creditValue);
        pedidoFields['valorDesconto'] = valorDesconto;
        // Se o valor do desconto for menor do que o do pedido, vamos calcular o valor
        // final
        if (valorDesconto < valorPedido) {
            valorFinal = valorPedido - valorDesconto
        } else {
            return res
                .status(400)
                .json({success: false, "message": "valorDesconto is bigger than valorPedido", "code": 63});
        }
    }

    //Se por acaso tem o promoCode, vamos aplicar
    if (promoCode) {
        if (promoCode.valor){
            var descontoPromo = parseFloat(promoCode.valor);
            valorFinal = valorFinal - descontoPromo;
            pedidoFields['valorDesconto'] = descontoPromo;
        } else if (promoCode.percentual) {
            var percentual = parseFloat(promoCode.percentual);
            pedidoFields['valorDesconto'] = valorFinal * percentual / 100;
            valorFinal = valorFinal * ( (100 - percentual) / 100);
        } else {
            valorFinal = valorFinal;
        }
        pedidoFields['promoCode'] = promoCode.codigo;
    }

    //Inserir parametros do pedido
    pedidoFields['viewed'] = req.body.viewed;
    pedidoFields['accepted'] = req.body.accepted;
    pedidoFields['pesarGas'] = req.body.pesarGas;
    pedidoFields['instalarGas'] = req.body.instalarGas;
    pedidoFields['tipoPagamento'] = req.body.tipoPagamento;
    pedidoFields['orderSellId'] = req.body.orderSellId;
    pedidoFields['orderSellHash'] = req.body.orderSellHash;
    pedidoFields['quantidade'] = quantidade;

    /* Se o produto tem uma distribuidora vinculada */
    if(req.body.distribuidoraIdDistribuidora !== null){
        pedidoFields['distribuidoraIdDistribuidora'] = req.body.distribuidoraIdDistribuidora;
    }

    if (req.body.idNovoEndereco){
        pedidoFields['novoEnderecoIdEndereco'] = req.body.idNovoEndereco;
    } else {
        pedidoFields['enderecoIdEndereco'] = req.body.idEndereco;
    }

    pedidoFields['observacaoUsuario'] = req.body.observacaoUsuario;
    pedidoFields['usuarioIdUsuario'] = req.params.idUsuario;
    pedidoFields['entregadorIdEntregador'] = 116;
    pedidoFields['statusPagamento'] = pagamentoStatus;
    pedidoFields['statusPedidoUsuario'] = pedidoStatus;
    pedidoFields['statusPedidoEntregador'] = pedidoStatus;
    pedidoFields['valorPedido'] = valorPedido;
    pedidoFields['valorProduto'] = valorProduto;
    pedidoFields['data'] = dataPedido;
    pedidoFields['valorFinal'] = valorFinal;
    pedidoFields['ipAddress'] = req.client.remoteAddress || req.headers["x-forwarded-for"];

    if (req.body.idNovoEndereco){

        var enderecoParams = {
            where: {
                idEndereco: req.body.idNovoEndereco
            },
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
        }

        //Verificar se a cidade está disponível para pedido
        models.novoEndereco.get(enderecoParams, function (endereco, error) {
            if (error) {
                return res.status(500).json(errorUtil.jsonFromError(error, 'unable.to.get.endereco', 500));
            }
            if (!endereco) {
                return res.status(500).json(errorUtil.createError('', "enderco.not.found", 5200));
            }

            var cepParams = {
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
            }
            models.novoCep.getAll(cepParams, function (ceps, error) {
                if (error) {
                    return res.status(500).json(errorUtil.jsonFromError(error, 'unable.to.get.cep', 5210));
                }
                if (!ceps) {
                    return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5220));
                }

                var passed = false;

                try{
                    var cepV = parseInt(endereco.cep.replace("-", ""));
                    for(let cep of ceps){
                        var cepInicio = parseInt(cep.cepInicio.replace("-", ""));
                        var cepFim = parseInt(cep.cepFim.replace("-", ""));
                        if(cepV >= cepInicio && cepV <= cepFim){
                            passed = true;
                            break;
                        }
                    }
                    if(!passed){
                        return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5230));
                    }
                }catch(e){
                    return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5230));
                }

                //Agora vamos as particularidades para os tipos de Pagamento
                switch (parseInt(tipoPagamento)) {
                    case 1:
                        //Pagamento no Dinheiro
                        var valorPagamento = parseFloat(req.body.valorPagamento); //Valor em dinheiro que o usuário informou
                        if (!valorPagamento || valorPagamento < 0) {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter valorPagamento", "code": 63});
                        }
                        if (valorPagamento < valorFinal) {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter valorPagamento cannot be less than valorFinal", "code": 63});
                        }
                        var troco = valorPagamento - valorFinal;
                        if (troco > valorPagamento) {
                            return res
                                .status(400)
                                .json({success: false, "message": "troco is bigger than valorPagamento", "code": 63});
                        }
                        //Atualizando campos
                        pedidoFields['troco'] = troco.toFixed(2);
                        pedidoFields['valorPagamento'] = valorPagamento;
                        return callback(pedidoFields);
                    case 2:

                        //Pagamento via app, com o payU Metodo de pagamento
                        if (req.body.paymentMethod) {
                            pedidoFields['paymentMethod'] = req.body.paymentMethod
                        } else {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter paymentMethod", "code": 63});
                        }

                        // //Cartao de credito
                        // if (req.body.creditCard) {
                        //     var str = req.body.creditCard.replace('{','');
                        //     str = str.replace('}','');
                        //     var properties = str.split(',');
                        //     var obj = {};
                        //     properties.forEach(function(property) {
                        //         var tup = property.split(':');
                        //
                        //         console.log(tup);
                        //         obj[tup[0]] = tup[1];
                        //     });
                        //     pedidoFields['creditCard'] = obj;
                        // } else {
                        //     return res
                        //         .status(400)
                        //         .json({success: false, "message": "missing parameter creditCard", "code": 63});
                        // }

                        return callback(pedidoFields);
                    default:
                        return callback(pedidoFields)
                }

            })
        })

    } else {
        var enderecoParams = {
            where: {
                idEndereco: req.body.idEndereco
            },
            include: [{
                model: models.cidade,
                attributes: ['ID', 'nome', 'estadoID'],
                include: [{ model: models.estado, attributes: ['nome', 'acronimo'] }]
            }]
        }

        //Verificar se a cidade está disponível para pedido
        models.endereco.get(enderecoParams, function (endereco, error) {
            if (error) {
                return res.status(500).json(errorUtil.jsonFromError(error, 'unable.to.get.endereco', 500));
            }
            if (!endereco) {
                return res.status(500).json(errorUtil.createError('', "enderco.not.found", 5200));
            }

            var cepParams = {
                include: [{
                    model: models.cidade,
                    attributes: ['ID', 'nome', 'estadoID'],
                    include: [{ model: models.estado, attributes: ['nome', 'acronimo'] }]
                }]
            }
            models.cep.getAll(cepParams, function (ceps, error) {
                if (error) {
                    return res.status(500).json(errorUtil.jsonFromError(error, 'unable.to.get.cep', 5210));
                }
                if (!ceps) {
                    return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5220));
                }

                var passed = false;

                try{
                    var cepV = parseInt(endereco.cep.replace("-", ""));
                    for(let cep of ceps){
                        var cepInicio = parseInt(cep.cepInicio.replace("-", ""));
                        var cepFim = parseInt(cep.cepFim.replace("-", ""));
                        if(cepV >= cepInicio && cepV <= cepFim){
                            passed = true;

                            if (endereco.cidade.nome == "Gama"){
                                pedidoFields['distribuidoraIdDistribuidora'] = 3;
                            } else if (endereco.cidade.nome == "Santa Maria"){
                                pedidoFields['distribuidoraIdDistribuidora'] = 5;
                            } else if (endereco.cidade.nome == "Recanto das Emas") {
                                pedidoFields['distribuidoraIdDistribuidora'] = 6;
                            }

                            break;
                        }
                    }
                    if(!passed){
                        return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5230));
                    }
                }catch(e){
                    return res.status(500).json(errorUtil.createError('', "ceps.not.found", 5230));
                }

                //Agora vamos as particularidades para os tipos de Pagamento
                switch (parseInt(tipoPagamento)) {
                    case 1:
                        //Pagamento no Dinheiro
                        var valorPagamento = parseFloat(req.body.valorPagamento); //Valor em dinheiro que o usuário informou
                        if (!valorPagamento || valorPagamento < 0) {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter valorPagamento", "code": 63});
                        }
                        if (valorPagamento < valorFinal) {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter valorPagamento cannot be less than valorFinal", "code": 63});
                        }
                        var troco = valorPagamento - valorFinal;
                        if (troco > valorPagamento) {
                            return res
                                .status(400)
                                .json({success: false, "message": "troco is bigger than valorPagamento", "code": 63});
                        }
                        //Atualizando campos
                        pedidoFields['troco'] = troco.toFixed(2);
                        pedidoFields['valorPagamento'] = valorPagamento;
                        return callback(pedidoFields);
                    case 2:

                        //Pagamento via app, com o payU Metodo de pagamento
                        if (req.body.paymentMethod) {
                            pedidoFields['paymentMethod'] = req.body.paymentMethod
                        } else {
                            return res
                                .status(400)
                                .json({success: false, "message": "missing parameter paymentMethod", "code": 63});
                        }

                        // //Cartao de credito
                        // if (req.body.creditCard) {
                        //     var str = req.body.creditCard.replace('{','');
                        //     str = str.replace('}','');
                        //     var properties = str.split(',');
                        //     var obj = {};
                        //     properties.forEach(function(property) {
                        //         var tup = property.split(':');
                        //
                        //         console.log(tup);
                        //         obj[tup[0]] = tup[1];
                        //     });
                        //     pedidoFields['creditCard'] = obj;
                        // } else {
                        //     return res
                        //         .status(400)
                        //         .json({success: false, "message": "missing parameter creditCard", "code": 63});
                        // }

                        return callback(pedidoFields);
                    default:
                        return callback(pedidoFields)
                }

            })
        })
    }

}

// __________________________________ PAGAMENTO
// _____________________________________ Tratar pedidos
var handlePayURequest = function (pedidoParameters, callback) {
    bCashController
        .createPayUTransaction(pedidoParameters, function (payment, error) {
            if (error) {
                return callback(null, error);
            }
            //Mandar a request para o payU
            bCashController
                .sendPayURequest(payment, function (response, error) {
                    if (error) {
                        return callback(null, error);
                    }
                    //Tudo certo
                    return callback(response, null);
                })
        })
}

//Tratar pedidos do bCash
var handleBCashRequest = function (pedidoParameters, callback) {
    bCashController
        .createBCashTransaction(pedidoParameters, function (payment, error) {
            if (error) {
                console.log(error);
                return callback(null, error);
            }
            //Mandar a request para o bCash
            bCashController
                .sendBCashRequest(payment, function (response, error) {
                    if (error) {
                        return callback(response, error);
                    }
                    //Tudo certo
                    return callback(response, null);
                })
        })
}

// __________________________________ MENSAGEM - PUSH ___________________________
// Mandar mensagem de novo pedido para o entregador
var createMessageEntregador = function (pedido, callback) {
console.log('message', pedido.idEntregador);    
//Buscar informacoes para notificar o entregador
    models
        .FBaseCloud
        .getByEntregadorId(pedido.idEntregador, function (data, error) {
            if (error) {
                return callback(false, error);
            }
            var messageParams = {
                "message": 'Bilin App',
                "entregadorName": pedido.nomeEntregador
            }
            //Achamos o token do device, vamos preparar a mensagem
            var message = fbaseUtil.newPedidoToEntregador(messageParams, data[0].token);
            fbaseUtil.sendMessage(message, function (messageResponse, error) {
                console.log(error);
                if (error) {
                    return callback(false, error);
                }
                //Tudo certo, mensagem enviada
                return callback(true, null);
            })
        })
}

var createMessageUsuario = function (status, idUsuario, callback) {
    //Buscar informacoes para notificar o entregador
    models
        .FBaseCloud
        .getByUserId(idUsuario, function (data, error) {
            if (error) {
                return callback(false, error);
            }
            console.log(data[0].token);
            //Achamos o token do device, vamos preparar a mensagem
            var message = fbaseUtil.pedidoStatusMessage(status, data[0].token);
            fbaseUtil.sendMessage(message, function (messageResponse, error) {
                if (error) {
                    return callback(false, error);
                }
                //Tudo certo, mensagem enviada
                return callback(true, null);
            })
        })
}


// __________________________________ MENSAGEM - EMAIL ___________________________

var sendEmailForPedidoStatusEntregador = function (idPedido, statusPedido, callback) {
    //Buscar dados do pedido
    if(statusPedido != 7){
        return callback(true,null);
    }
    completePedido(idPedido, function (data, error) {
        if (error) {
            return callback(false, error);
        }
        //Aqui deverá ser feito um switch para as outras opcoes
        emailUtils
            .sendUserRatingEmail(data.usuario.nome, data.usuario.email, data, function (result, error) {
                if (error) {
                    return callback(false, error);
                }
                return callback(true, null);
            })
    })
}


//________________________________ PEDIDO _________________________________

//Pedido sem desconto e nem código promocional
var handlePedidoNormal = function (req, res, callback) {
    createPedido(req, res, null, 0, function (pedidoParameters) {
        //Verificar se tem distribuidora vinculada ao distribuidora
        getEntregadorDistribuidoraData(pedidoParameters.entregadorIdEntregador, function (status, data) {

            if (status) {
                //pedidoParameters['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                pedidoParameters['emailDistribuidora'] = data.distribuidora.email;
                pedidoParameters['emailEntregador'] = data.email;
                pedidoParameters['nomeEntregador'] = data.nome;
            }

            //Gravar pedido de fato
            models
                .pedido
                .insert(pedidoParameters, function (pedido, error) {

                    if (error) {
                        return callback(null, null, error);
                    }

                    // Agora iremos ver o tipo de pagamento do pedido, se foi via app iremos
                    if (pedido.tipoPagamento == 2) {
                        //Processar pedido
                        // handleBCashRequest(pedidoParameters, function (payment, error) {
			             //    if (error) {
                        //         models
                        //             .pedido
                        //             .cancelAndDestroy(pedido.idPedido, function (deleteData, error) {
                        //                 return callback(null, payment, error);
                        //             })
                        //     } else {

                        pedido.idEntregador = pedido.entregadorIdEntregador;
                        pedido.nomeEntregador = pedidoParameters['nomeEntregador'];
						//Tudo certo, vamos avisar o entregador que chegou pedido
                        // createMessageEntregador(pedido, function (status, error) {
                        //     if (error) {
                        //         console.log("AQUI2");
                        //         console.log('==================')
                        //         console.log(error)
                        //         console.log('==================')


                        return callback(pedido, null, null);
                            // }
                            // return callback(pedido, payment, null);
                        // });
                        //     }
                        // })
                    } else {
                        //Mandar mensagem para o entregador
                        createMessageEntregador(pedidoParameters, function (status, error) {
                            if (error) {
                                return callback(pedido, null, null);
                            }
                            return callback(pedido, null, null);
                        })
                    }

                })
        })
    })
}

//Pedido com codigo promocional
var handlePedidoPromoCode = function (req, res, callback) {
    //if(req.body.indicacao){
        applyPromoCode(req.body.promoCode, req.params.idUsuario, function (status, dataPromo, error) {
            if (error) {
                return callback(null, null, error);
            }
            if (status) {
                //O codigo foi aplicado com sucesso
                createPedido(req, res, dataPromo, 0, function (pedidoParameters) {
                    getEntregadorDistribuidoraData(pedidoParameters.entregadorIdEntregador, function (status, data) {
                        if (status) {
                            //pedidoParameters['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                            pedidoParameters['emailDistribuidora'] = data.distribuidora.email;
                            pedidoParameters['emailEntregador'] = data.email;
                            pedidoParameters['nomeEntregador'] = data.nome;
                        }
                        //Gravar o pedido de fato
                        models
                            .pedido
                            .insert(pedidoParameters, function (pedido, error) {
                                if (error) {
                                    return callback(null, null, error);
                                }

                                if(dataPromo.idReferral){

                                    //Aplicar o Credito para quem cedeu o Codigo
                                    applyCredit(dataPromo.idReferral, KLimitCredit, kCreditValue, function (status, error) {
                                        if (error) {
                                            return callback(null, null, error);
                                        }
                                        // Agora iremos ver o tipo de pagamento do pedido, se foi via app iremos pagar
                                        if (pedido.tipoPagamento == 2) {
                                            //Processar pedido
                                            //handleBCashRequest(pedidoParameters, function (payment, error) {
                                            //if (error) {
                                            //Erro ao processar pedido, devemos cancelar
                                            //models
                                            //.pedido
                                            //.cancelAndDestroy(pedido.idPedido, function (deleteData, error) {
                                            //    return callback(null, payment, error);
                                            //})
                                            //}
                                            //Tudo certo, vamos avisar o entregador que chegou pedido
                                            //createMessageEntregador(pedido, function (status, error) {
                                            // if (error) {
                                            // return callback(pedido, payment, null);
                                            // }
                                            pedido.idEntregador = pedido.entregadorIdEntregador;
                                            pedido.nomeEntregador = pedidoParameters['nomeEntregador'];
                                            return callback(pedido, null, null);
                                            //return callback(pedido, payment, null);
                                            // })
                                            //})
                                        } else {
                                            // Caso o pagamento não seja pelo app, apenas retornaremos o pedido Mandar
                                            // mensagem para o entregador
                                            createMessageEntregador(pedidoParameters, function (status, error) {
                                                if (error) {
                                                    return callback(pedido, null, null);
                                                }
                                                return callback(pedido, null, null);
                                            })
                                        }
                                    })
                                } else {

                                    // Agora iremos ver o tipo de pagamento do pedido, se foi via app iremos pagar
                                    if (pedido.tipoPagamento == 2) {
                                        //Processar pedido
                                        //handleBCashRequest(pedidoParameters, function (payment, error) {
                                        //if (error) {
                                        //Erro ao processar pedido, devemos cancelar
                                        //models
                                        //.pedido
                                        //.cancelAndDestroy(pedido.idPedido, function (deleteData, error) {
                                        //    return callback(null, payment, error);
                                        //})
                                        //}
                                        //Tudo certo, vamos avisar o entregador que chegou pedido
                                        //createMessageEntregador(pedido, function (status, error) {
                                        // if (error) {
                                        // return callback(pedido, payment, null);
                                        // }
                                        pedido.idEntregador = pedido.entregadorIdEntregador;
                                        pedido.nomeEntregador = pedidoParameters['nomeEntregador'];
                                        return callback(pedido, null, null);
                                        //return callback(pedido, payment, null);
                                        // })
                                        //})
                                    } else {
                                        // Caso o pagamento não seja pelo app, apenas retornaremos o pedido Mandar
                                        // mensagem para o entregador
                                        createMessageEntregador(pedidoParameters, function (status, error) {
                                            if (error) {
                                                return callback(pedido, null, null);
                                            }
                                            return callback(pedido, null, null);
                                        })
                                    }
                                }
                            })

                    })
                })
            } else {
                return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 1121));
            }
        })
    /*} else if (req.body.promocao) {
        applyPromo(req.body.promoCode, function (status, dataPromo, error) {
            if (error) {
                return callback(null, null, error);
            }
            if (status) {
                //O codigo foi aplicado com sucesso
                createPedido(req, res, dataPromo, 0, function (pedidoParameters) {
                    getEntregadorDistribuidoraData(pedidoParameters.entregadorIdEntregador, function (status, data) {
                        if (status) {
                            pedidoParameters['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                            pedidoParameters['emailDistribuidora'] = data.distribuidora.email;
                            pedidoParameters['emailEntregador'] = data.email;
                            pedidoParameters['nomeEntregador'] = data.nome;
                        }
                        //Gravar o pedido de fato
                        models
                            .pedido
                            .insert(pedidoParameters, function (pedido, error) {
                                if (error) {
                                    return callback(null, null, error);
                                }

                                // Agora iremos ver o tipo de pagamento do pedido, se foi via app iremos pagar
                                if (pedido.tipoPagamento == 2) {
                                    //Processar pedido
                                    //handleBCashRequest(pedidoParameters, function (payment, error) {
                                    //if (error) {
                                    //Erro ao processar pedido, devemos cancelar
                                    //models
                                    //.pedido
                                    //.cancelAndDestroy(pedido.idPedido, function (deleteData, error) {
                                    //    return callback(null, payment, error);
                                    //})
                                    //}
                                    //Tudo certo, vamos avisar o entregador que chegou pedido
                                    //createMessageEntregador(pedido, function (status, error) {
                                    // if (error) {
                                    // return callback(pedido, payment, null);
                                    // }
                                    pedido.idEntregador = pedido.entregadorIdEntregador;
                                    pedido.nomeEntregador = pedidoParameters['nomeEntregador'];
                                    return callback(pedido, null, null);
                                    //return callback(pedido, payment, null);
                                    // })
                                    //})
                                } else {
                                    // Caso o pagamento não seja pelo app, apenas retornaremos o pedido Mandar
                                    // mensagem para o entregador
                                    createMessageEntregador(pedidoParameters, function (status, error) {
                                        if (error) {
                                            return callback(pedido, null, null);
                                        }
                                        return callback(pedido, null, null);
                                    })
                                }
                            })

                    })
                })
            } else {
                return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 1220));
            }
        })
    }*/
}

//Pedido com uso de creditos
var handlePedidoCreditos = function (req, res, callback) {
    useCredit(req.params.idUsuario, req.body.creditValue, function (status, error) {
        if (error) {
            return callback(null, null, error);
        }
        if (status) {
            createPedido(req, res, null, req.body.creditValue, function (pedidoParameters) {
                //Verificar se tem distribuidora vinculada ao entregador
                getEntregadorDistribuidoraData(pedidoParameters.entregadorIdEntregador, function (status, data) {
                    if (status) {
                        //pedidoParameters['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                        pedidoParameters['emailDistribuidora'] = data.distribuidora.email;
                        pedidoParameters['emailEntregador'] = data.email;
                        pedidoParameters['nomeEntregador'] = data.nome;
                    }
                    console.log(pedidoParameters);
                    //Salvar pedido
                    models
                        .pedido
                        .insert(pedidoParameters, function (pedido, error) {
                            if (error) {
                                return callback(null, null, error);
                            }
                            // Agora iremos ver o tipo de pagamento do pedido, se foi via app iremos
                            // processar o pagamento
                            // if (pedido.tipoPagamento == 2) {
                            //     //Processar pedido
                            //     handleBCashRequest(pedidoParameters, function (payment, error) {
                            //         if (error) {
                            //             //Erro ao processar pedido, devemos cancelar
                            //             models
                            //                 .pedido
                            //                 .cancelAndDestroy(pedido.idPedido, function (deleteData, error) {
                            //                     return callback(null, payment, error);
                            //                 })
                            //         }
                            //         //Tudo certo, vamos avisar o entregador que chegou pedido
                            //         createMessageEntregador(pedido, function (status, error) {
                            //             if (error) {
                            //                 return callback(pedido, payment, null);
                            //             }
                            //             return callback(pedido, payment, null);
                            //         })
                            //     })
                            // } else {
                                //Mandar mensagem para o entregador
                                createMessageEntregador(pedidoParameters, function (status, error) {
                                    if (error) {
                                        return callback(pedido, null, null);
                                    }
                                    return callback(pedido, null, null);
                                })
                            //}
                        })
                })
            })
        } else {
            return callback(null, null, errorUtil.createError('', "error.useCredit.unknown.error", 120));
        }
    })
}

//Cancelar pedido
var handlePedidoCancelByError = function (pedido, callback) {
    models
        .pedido
        .cancelAndDestroy(pedido.idPedido, function (data, error) {
            return callback(data, error);
        })

}

//Estimar valor do pedido, com dados do código promocional
var estimateCodeValue = function (code, idUsuarioCode, callback) {
    var findPromoParams = {
        attributes: [
            'codigo', 'usuarioIdUsuario'
        ],
        where: {
            codigo: code,
            usuarioIdUsuario: idUsuarioCode
        }
    }
    //Verificar se o usuario já usou esse código
    models
        .usuario
        .get({
            attributes: [
                'tokenPromo', 'idUsuario'
            ],
            where: {
                tokenPromo: code
            }
        }, function (data, error) {
            if (error) {
                return callback(false, null, error);
            }
            if (data) {
                if (data.idUsuario == idUsuarioCode) {
                    var userError = errorUtil.createError('', 'cannot.apply.code.to.self', 123);
                    return callback(false, null, userError);
                }
                //Verificar se já usou o codigo
                models
                    .userPromo
                    .findOne(findPromoParams)
                    .then(function (dataPromo) {
                        if (dataPromo.count > 0) {
                            //usuário já usou o código
                            return callback(false, null, null);
                        } else {
                            return callback(true, dataPromo, null);
                        }
                    })
                    .catch(function (error) {
                        return callback(false, null, error);
                    })
            }
        })
}

//Aplicar codigo de desconto de indicação
var applyPromoCode = function (code, idUsuarioCode, callback) {

    //Verificar se o usuario já usou esse código
    models
        .usuario
        .get({
            attributes: [
                'tokenPromo', 'idUsuario'
            ],
            where: {
                tokenPromo: code
            }
        }, function (data, error) {
            if (error) {
                return callback(false, null, error);
            }
            if (data) {
                if (data.idUsuario == idUsuarioCode) {
                    var userError = errorUtil.createError('', 'cannot.apply.code.to.self', 1120);
                    return callback(false, null, userError);
                }
				
				var findPromoParams = {
					attributes: [
						'codigo', 'usuarioIdUsuario'
					],
                    where: {
                        usuarioIdUsuario: idUsuarioCode
                    }
				}
				
                //Verificar e Aplicar o codigo
                models.userPromo.get(findPromoParams, function(dataPromo, error){
					if(error){
						return callback(false, null, error);
					}

                    if (!isEmpty(dataPromo)) {
                        //usuário já usou o código
						return callback(false, null, null);
					} else {

                        //Buscar promo de indicação
                        var findDefaultPromo = {
                            where: {
                                idPromocao: 1
                            }
                        }
                        models.promocao.get(findDefaultPromo, function (promoDefault, error) {
                            if(error){
                                return callback(false, null, error);
                            }
                            //cadastrar o codigo no user
                            var insertParams = {
                                idReferral: data.idUsuario,
                                codigo: code,
                                usuarioIdUsuario: idUsuarioCode,
                                count: 1,
                                valor: promoDefault.valor
                            }

                            models.userPromo.insert(insertParams, function (dataUserPromo, error) {
                                if(error){
                                    return callback(false, null, error);
                                }
                                return callback(true, dataUserPromo, null);
                            })

                        })
                   }
				});
            } else {
                applyPromo(code, callback);
                //return callback(false, null, null);
            }
        })
}

//Aplicar crédito a um usuario
var applyCredit = function (idReferral, limit, value, callback) {
    var params = {
        attributes: [
            'idUsuario', 'creditos'
        ],
        where: {
            idUsuario: idReferral
        }
    }
    models
        .usuario
        .get(params, function (user, error) {
            if (error) {
                return callback(false, error);
            }
            if (user) {
                //Se o limite de credito foi atingido
                if (user.creditos >= limit) {
                    return callback(true, null);
                } else {
                    var credit = user.creditos + value
                    var updateParams = {
                        creditos: credit
                    }
                    var whereParams = {
                        idUsuario: user.idUsuario
                    }
                    models
                        .usuario
                        .updateData(whereParams, updateParams, function (data, error) {
                            if (error) {
                                return callback(false, error);
                            }
                            return callback(true, null);
                        })
                }
            } else {
                return callback(false, null);
            }
        })
}

//Aplicar código de promoção
var applyPromo = function (code, callback) {

    var findPromoParams = {
        where: {
            codigo: code.toUpperCase()
        }
    }

    models.promocao.get(findPromoParams, function(dataPromo, error){
        if(error){
            return callback(false, null, error);
        }
        if (isEmpty(dataPromo)) {
            return callback(false, null, null);
        } else {
            if(dataPromo.idPromocao == 1){
                return callback(false, null, null);
            }
            return callback(true, dataPromo, null);
        }
    });

}

//Utilizar créditos
var useCredit = function (idCreditUser, value, callback) {
    var params = {
        attributes: [
            'idUsuario', 'creditos'
        ],
        where: {
            idUsuario: idCreditUser
        }
    }
    models
        .usuario
        .get(params, function (user, error) {
            if (error) {
                return callback(false, error);
            }
            if (user.creditos >= value) {
                //Calcular credito
                var credit = (parseFloat(user.creditos) - parseFloat(value));
                var updateParams = {
                    creditos: credit
                }
                models
                    .usuario
                    .updateData({
                        idUsuario: user.idUsuario
                    }, updateParams, function (data, error) {
                        if (error) {
                            return callback(false, error);
                        }
                        return callback(true, null);
                    })
            } else {
                return callback(false, null);
            }
        })
}

//Completar pedido para que ele seja enviado ao usuário, informando dados completos

var completePedido = function (idPedido, callback) {
    var parameters = {
        where: {
            idPedido: idPedido
        },
        include: [
            {
                model: models.endereco,
                required: false,
                attributes: [
                    'endereco', 'bairro', 'cep', 'referencia'
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
                attributes: [
                    'nome', 'imagemUrl'
                ],
                include: [
                    {
                        model: models.entregadorData,
                        attributes: ['point'],
                        required: false
                    }
                ]
            },
            {
                model : models.usuario,
                attributes : ['nome','email']
            }
        ]
    }

    models
        .pedido
        .get(parameters, function (data, error) {
            if (error) {
                return callback(null, error);
            }
            return callback(data, null);
        })
}

//Buscar id Da distribuidora e os dados do entregador
var getEntregadorDistribuidoraData = function (idEntregadorValue, callback) {
    var parameters = {
        attributes: [
            'idEntregador', 'distribuidoraIdDistribuidora', 'email', 'nome'
        ],
        where: {
            idEntregador: idEntregadorValue
        },
        include: [
            {
                model: models.distribuidora,
                attributes: ['email']
            }
        ]
    }
    models
        .entregador
        .get(parameters, function (data, error) {
            if (error) {
                return callback(false, null);
            }
            if (data) {
                return callback(true, data);
            } else {
                return callback(false, null);
            }
        })
}

var validatePromoToken = function (req, res, callback) {

        //Verificar se o usuario já usou esse código
        models
            .usuario
            .get({
                attributes: [
                    'tokenPromo', 'idUsuario'
                ],
                where: {
                    tokenPromo: req.body.promoCode
                }
            }, function (data, error) {
                if (error) {
                    return callback(null, null, error);
                }
                if (data) {
                    if (data.idUsuario == req.params.idUsuario) {
                        var userError = errorUtil.createError('', 'cannot.apply.code.to.self', 2120);
                        return callback(null, null, userError);
                    }

                    var findPromoParams = {
                        attributes: [
                            'codigo', 'usuarioIdUsuario'
                        ],
                        where: {
                            usuarioIdUsuario: req.params.idUsuario
                        }
                    }

                    //Verificar o codigo
                    models.userPromo.get(findPromoParams, function(dataPromo, error){
                        if(error){
                            return callback(null, null, error);
                        }

                        if (!isEmpty(dataPromo)) {
                            //usuário já usou o código
                            return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 2122));
                        } else {

                            //Buscar promo de indicação
                            var findDefaultPromo = {
                                where: {
                                    idPromocao: 1
                                }
                            }
                            models.promocao.get(findDefaultPromo, function (promoDefault, error) {
                                if(error){
                                    return callback(null, null, error);
                                }
                                return callback(true, promoDefault, null);
                            })
                        }
                    });
                } else {

                    var findPromoParams = {
                        where: {
                            codigo: req.body.promoCode.toUpperCase()
                        }
                    }

                    models.promocao.get(findPromoParams, function(dataPromo, error){
                        if(error){
                            return callback(null, null, error);
                        }
                        if (isEmpty(dataPromo)) {
                            return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 2220));
                        } else {
                            if(dataPromo.idPromocao == 1){
                                return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 2220));
                            }
                            return callback(true, dataPromo, null);
                        }
                    });

                    //return callback(null, null, errorUtil.createError('', "error.usePromoCode.unknown.error", 1123));
                }
            })

};

var isEmpty = function(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) return false;
    }
    return true;
}

module.exports = {
    completePedido: completePedido,
    estimateCodeValue: estimateCodeValue,
    handlePedidoNormal: handlePedidoNormal,
    handlePedidoCreditos: handlePedidoCreditos,
    handlePedidoPromoCode: handlePedidoPromoCode,
    sendEmailForPedidoStatusEntregador : sendEmailForPedidoStatusEntregador,
    createMessageUsuario: createMessageUsuario,
    validatePromoToken: validatePromoToken
}
