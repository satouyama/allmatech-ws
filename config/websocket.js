var models = require('../models/rdb');

module.exports = function (io) {
// connect socket.io
    io.on('connect', (socket) => {

        console.log('user as been connected');

        socket.on('disconnect', (motive)=>{

            let rooms = socket.rooms;
            //io.to('entregador location').emit('debug', rooms);

            let data = {
                address: socket.handshake.address,
                createdAt: socket.handshake.time,
                issued: socket.handshake.issued,
                disconnection_motive: motive,
                idUser: socket.handshake.userId,
                userRole: socket.handshake.userRole,
                userName: socket.handshake.userName
            };
            io.to('entregador location').emit('userDisconnected', data);
            io.to('entregador location').emit('userDisconnectedFromRoom', data);
        });

        socket.on('saveInfo', (data)=>{

            socket.handshake["userId"] = data.id;
            socket.handshake["userName"] = data.nome;
            if (data.role !== null) {
                socket.handshake["userRole"] = data.role;
            } else {
                socket.handshake["userRole"] = 'entregador';
            }

            let dataUser = {
                address: socket.handshake.address,
                createdAt: socket.handshake.time,
                issued: socket.handshake.issued,
                idUser: socket.handshake.userId,
                userRole: socket.handshake.userRole,
                userName: socket.handshake.userName
            };

            io.to('entregador location').emit('userJoined', dataUser);
        });

        socket.on('join-location-room', (data) => {
            socket.handshake["userId"] = data.id;
            socket.handshake["userName"] = data.nome;
            if (data.role !== null) {
                socket.handshake["userRole"] = data.role;
            } else {
                socket.handshake["userRole"] = 'entregador';
            }

            socket.join('entregador location', () => {

                let dataUser = {
                    address: socket.handshake.address,
                    createdAt: socket.handshake.time,
                    issued: socket.handshake.issued,
                    idUser: socket.handshake.userId,
                    userRole: socket.handshake.userRole,
                    userName: socket.handshake.userName
                };
                io.to('entregador location').emit('userJoined', dataUser);
            });

        });

        socket.on('exit-location-room', (data)=>{

            socket.leave('entregador location', () => {

                let dataUser = {
                    address: socket.handshake.address,
                    createdAt: socket.handshake.time,
                    issued: socket.handshake.issued,
                    idUser: data.id,
                    userRole: data.role,
                    userName: data.nome
                };
                io.to('entregador location').emit('userDisconnectedFromRoom', dataUser);
            });
        });

        socket.on('sendLocation', (data) => {
            io.to('entregador location').emit('location', data);
        });

        socket.on("rotacionarParaRevenda", (data) => {

            var queryPedido = {
                where: {
                    usuarioIdUsuario: data.idUsuario,
                    idPedido: data.idPedido
                },include: [
                    {
                        model: models.distribuidora,
                        attributes: ['idDistribuidora', 'nome'],
                        required: false,
                    }
                ]
            };

            models.pedido.get(queryPedido, function (dataPedido, error) {
                //Verificando condicoes para realizar update
                if (error) {
                    console.log(error);
                }

                //Update
                var whereParams = {
                    usuarioIdUsuario: data.idUsuario,
                    idPedido: data.idPedido
                }
                var updateFields = {};
                updateFields['statusPedidoUsuario'] = 11;
                updateFields['statusPedidoEntregador'] = 11;

                models.pedido.updateData(whereParams, updateFields, function (data, error) {
                    if (error) {
                        console.log(error);
                    } else {
                        /* Manda um emit para a distribuidora que este pedido está vinculado */
                        io.emit(dataPedido.distribuidora.idDistribuidora + '/pedidoPendente', {message : 'Novo Pedido Pendente'});

                        /* Manda um emit para o admin */
                        io.emit('pedidoPendente', {message : 'Novo Pedido Pendente'});
                    }
                })
            })

        });

        socket.on("rotacionarEntregador", (data) => {

            console.log("DEBUG > rotacionarEntregador inicio");

            let idUsuario = data.idUsuario;
            let idPedido = data.idPedido;
            let lat = data.lat;
            let long = data.long;

            var parameters = {
                where: {
                    usuarioIdUsuario: idUsuario,
                    idPedido: idPedido
                },include: [
                    {
                        model: models.endereco,
                        required: false,
                        attributes: [
                            'endereco', 'numero', 'bairro', 'cep', 'referencia'
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
                        attributes: ['nome', 'imagemUrl']
                    },{
                        model: models.usuario,
                        attributes: ['nome', 'telefone']
                    },   {
                        model: models.novoEndereco,
                        required: false,
                        attributes: [
                            'titulo','endereco', 'numero', 'cep', 'referencia'
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
            };

            models
                .pedido
                .get(parameters, function (data, error) {
                    if (error) {
                        console.log(error);
                    }

                    var updateFields = {};

                    var entregadorIdEntregadorListaTentativas = "";

                    /* Atualiza a lista de tentativas do pedido com o id do entregador atual */
                    if (data.entregadorIdEntregadorListaTentativas == null || data.entregadorIdEntregadorListaTentativas.length == 0) {
                        if (data.entregadorIdEntregador != null) {
                            entregadorIdEntregadorListaTentativas = data.entregadorIdEntregador;
                        }
                    } else {
                        entregadorIdEntregadorListaTentativas = data.entregadorIdEntregadorListaTentativas;
                        if (data.entregadorIdEntregador != null) {
                            entregadorIdEntregadorListaTentativas += "," + data.entregadorIdEntregador;
                            io.emit( data.entregadorIdEntregador + "/pedido/pedidoRotacionado", { idPedido: idPedido });
                        }
                    }
                    updateFields['entregadorIdEntregadorListaTentativas'] = entregadorIdEntregadorListaTentativas;

                    console.log("DEBUG > rotacionarEntregador list tentativas atualizada > " + entregadorIdEntregadorListaTentativas);

                    /* Busca um novo entregador baseado na geolocalização do endereço do pedido e
                     * caso encontre um entregador no raio de procura, atualiza o pedido com o id
                     * do primeiro resultado retornado
                     */
                    models.entregadorData.getAroundNotIn(lat, long, null, entregadorIdEntregadorListaTentativas, function (result, error) {

                        if (error) {
                            console.log(error);
                        } else {

                            /* Se a consulta retornou um entregador */
                            if (result.length > 0) {
                                updateFields['entregadorIdEntregador'] = result[0].entregadorIdEntregador;
                                console.log("DEBUG > rotacionarEntregador entregador encontrado > " + result[0].entregadorIdEntregador);
                            } else {
                                updateFields['entregadorIdEntregador'] = null;
                                console.log("DEBUG > rotacionarEntregador nenhum entregador encontrado");
                            }

                            //Update
                            var whereParams = { idPedido: idPedido } ;
                            models.pedido.updateData(whereParams, updateFields, function (updateData, error) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    if (result.length > 0) {

                                        /* Envia a mensagem para o entregador informando que existe um novo pedido */
                                        io.emit(result[0].entregadorIdEntregador + "/entregador/newOrder", data);

                                        console.log("DEBUG > rotacionarEntregador entregador avisado > " + result[0].entregadorIdEntregador + "/entregador/newOrder");
                                    }
                                }
                            });
                        }

                    })

                });
        })

        /* Escuta a resposta do entregador acerca do pedido enviado */
        socket.on('entregador/aceitarPedido', (deliverymanObject) => {

            console.log("DEBUG > Entregador aceitou pedido > " + JSON.stringify(deliverymanObject));

            if(deliverymanObject.idUsuario){

                var entregadorQuery = {
                    attributes: [
                        'idEntregador', 'distribuidoraIdDistribuidora'
                    ],
                    where: {
                        idEntregador: deliverymanObject.idEntregador,
                    }
                }

                models.entregador.get(entregadorQuery, function (data, error) {
                    if (error) {
                        console.log(error);
                    }
                    if (data) {
                        //Update
                        var whereParams = {
                            idPedido: deliverymanObject.idPedido
                        }
                        var updateFields = {};
                        updateFields['statusPedidoEntregador'] = 3;
                        updateFields['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                        models.pedido.updateData(whereParams, updateFields, function (resp, error) {
                            if (error) {
                                console.log(error);
                            }

                            /* Envia uma mensagem para o usuario informando que o pedido foi aceito */
                            io.emit(deliverymanObject.idUsuario + '/usuario/orderStatus', {
                                idPedido: deliverymanObject.idPedido,
                                idUsuario: deliverymanObject.idUsuario,
                                idEntregador: deliverymanObject.idEntregador,
                                deliverymanResponse: deliverymanObject.accepted
                            });
                            console.log("DEBUG > Usuario recebeu resposta");
                        })
                    } else { }
                })
            }
        })

        /* Escuta a resposta do entregador acerca do pedido enviado */
        socket.on('entregador/recusarPedido', (deliverymanObject) => {

            console.log("DEBUG > Entregador recusou pedido > " + JSON.stringify(deliverymanObject));

            if(deliverymanObject.idUsuario){

                /* Envia uma mensagem para o usuario informando que o pedido foi recusado */
                io.emit(deliverymanObject.idUsuario + '/usuario/orderStatus', {
                    idPedido: deliverymanObject.idPedido,
                    idUsuario: deliverymanObject.idUsuario,
                    idEntregador: deliverymanObject.idEntregador,
                    deliverymanResponse: deliverymanObject.accepted
                });
                console.log("DEBUG > Usuario recebeu resposta");
            }
        })

        /* Escuta a resposta do entregador acerca do andamento do pedido */
        socket.on('entregador/pedidoEntregue', (deliverymanObject) => {

            console.log("DEBUG > Entregador entregou pedido > " + JSON.stringify(deliverymanObject));

            if(deliverymanObject.idUsuario){

                var entregadorQuery = {
                    attributes: [
                        'idEntregador', 'distribuidoraIdDistribuidora'
                    ],
                    where: {
                        idEntregador: deliverymanObject.idEntregador,
                    }
                }

                models.entregador.get(entregadorQuery, function (data, error) {
                    if (error) {
                        console.log(error);
                    }
                    if (data) {
                        //Update
                        var whereParams = {
                            idPedido: deliverymanObject.idPedido
                        }
                        var updateFields = {};
                        updateFields['statusPedidoEntregador'] = 7;
                        updateFields['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                        models.pedido.updateData(whereParams, updateFields, function (resp, error) {
                            if (error) {
                                console.log(error);
                            }

                            /* Envia uma mensagem para o usuario informando que o pedido foi aceito */
                            io.emit(deliverymanObject.idUsuario + '/usuario/orderStatus/andamento', {
                                idPedido: deliverymanObject.idPedido,
                                idUsuario: deliverymanObject.idUsuario,
                                idEntregador: deliverymanObject.idEntregador,
                                orderDelivered: deliverymanObject.orderDelivered
                            });
                            console.log("DEBUG > Usuario recebeu resposta");
                        })
                    } else { }
                })
            }
        })

        /* Escuta a resposta do entregador acerca do andamento do pedido */
        socket.on('entregador/pedidoNaoEntregue', (deliverymanObject) => {

            console.log("DEBUG > Entregador não achou endereço pedido > " + JSON.stringify(deliverymanObject));

            if(deliverymanObject.idUsuario){

                var entregadorQuery = {
                    attributes: [
                        'idEntregador', 'distribuidoraIdDistribuidora'
                    ],
                    where: {
                        idEntregador: deliverymanObject.idEntregador,
                    }
                }

                models.entregador.get(entregadorQuery, function (data, error) {
                    if (error) {
                        console.log(error);
                    }
                    if (data) {
                        //Update
                        var whereParams = {
                            idPedido: deliverymanObject.idPedido
                        }
                        var updateFields = {};
                        updateFields['statusPedidoEntregador'] = 8;
                        updateFields['distribuidoraIdDistribuidora'] = data.distribuidoraIdDistribuidora;
                        models.pedido.updateData(whereParams, updateFields, function (resp, error) {
                            if (error) {
                                console.log(error);
                            }

                            /* Envia uma mensagem para o usuario informando que o pedido não foi aceito */
                            io.emit(deliverymanObject.idUsuario + '/usuario/orderStatus/andamento', {
                                idPedido: deliverymanObject.idPedido,
                                idUsuario: deliverymanObject.idUsuario,
                                idEntregador: deliverymanObject.idEntregador,
                                orderDelivered: deliverymanObject.orderDelivered
                            });
                            console.log("DEBUG > Usuario recebeu resposta");
                        })
                    } else { }
                })
            }
        })

        /* Escuta a resposta do usuario acerca do pedido em andamento */
        socket.on('usuario/pedidoCancelado', (userObject) => {

            console.log("DEBUG > Usuário cancelou o pedido > " + JSON.stringify(userObject));

            var whereParams = {
                idPedido: userObject.idPedido
            }
            var updateFields = {};
            updateFields['statusPedidoUsuario'] = 9;
            updateFields['statusPedidoEntregador'] = 9;
            models.pedido.updateData(whereParams, updateFields, function (resp, error) {
                if (error) {
                    console.log(error);
                }

                if (userObject.idEntregador) {

                    /* Envia uma mensagem para o entregador informando que o pedido foi cancelado */
                    io.emit(userObject.idEntregador + '/entregador/orderStatus', {
                        idPedido: userObject.idPedido,
                        idUsuario: userObject.idUsuario,
                        idEntregador: userObject.idEntregador,
                        orderCanceled: userObject.orderCanceled
                    });
                } else {
                    var parameters = {
                        where: { idPedido: userObject.idPedido }
                    };
                    models.pedido.get(parameters, function (data, error) {
                        if (error) { console.log(error); }
                        io.emit( data.entregadorIdEntregador + "/pedido/pedidoRotacionado", { idPedido: userObject.idPedido });
                    });
                }
            })

        })

    });

};