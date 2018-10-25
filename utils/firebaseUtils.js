/*Created by Neneds*/
"use strict";

var nconf = require('nconf');
var path = require("path");
var config = path.join(__dirname, 'config.json');
var env = process.env.NODE_ENV || "development";
nconf.argv().env();
nconf.file({ file: config });

//setar o ambiente de teste
var isTest = process.env.NODE_ENV ? false : true

var FCM = require('fcm-push');

var serverKey = 'AIzaSyDhoaZYmjQqUH2lOr-Od4vd5S5m_9ZmvTA';
var fcm = new FCM(serverKey);
//Novo pedido para o entregador

var newPedidoToEntregador = function(data,token){

    serverKey = 'AIzaSyDhoaZYmjQqUH2lOr-Od4vd5S5m_9ZmvTA';
    fcm = new FCM(serverKey);
    var message = {
        to: token, //Token do dispositivo individual, ou do grupo
        priority: 'high',
        notification: {
            title: 'Novo Pedido',
            body: data.entregadorName + ' ' + 'Você tem um novo pedido!'
        }
     }

 return message;
}

//Mudanca no status do pedido

var pedidoStatusMessage = function(statusValue, token){

    serverKey = 'AIzaSyAQ189LYtgZ54fhZWECqnxWdqrzMHaRPqw';
    fcm = new FCM(serverKey);
    var messageBody = ''
    switch(statusValue){
      case 2:
        messageBody = 'Pedido realizado, aguardando o entregador';
        break
      case 3:
        messageBody = 'Pedido aceito pelo entregador';
        break
      case 4:
        messageBody = 'O pedido nāo foi aceito pelo entregador';
        break
      case 5:
        messageBody = 'O pedido foi cancelado pelo entregador';
        break
      case 6:
        messageBody = 'O pedido está em trânsito';
        break
      case 7:
        messageBody = 'O pedido foi entregue. Avalie o entregador.';
        break
    }
    var message = {
        to: token, //Token do dispositivo individual, ou do grupo
        priority: 'high',
        notification: {
            title: 'Seu pedido no Bilin',
            body: messageBody
        }
    };

 return message;
}

//Enviar de fato a mensagem
var sendMessage = function(message,callback){

//promise style
fcm.send(message)
    .then(function(response){
        callback(response,null);
    })
    .catch(function(error){
        callback(null,error);
    })
}

module.exports = {
    sendMessage : sendMessage,
    pedidoStatusMessage : pedidoStatusMessage,
    newPedidoToEntregador : newPedidoToEntregador
}
