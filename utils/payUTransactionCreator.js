/*Created by Neneds*/


var addressClass = require('../utils/payUModels/AddressRequest.js');
var buyerClass = require('../utils/payUModels/BuyerRequest.js');
var creditClass = require('../utils/payUModels/CreditCardRequest.js');
var orderClass = require('../utils/payUModels/OrderRequest.js');
var paymentClass = require('../utils/payUModels/PaymentRequest.js');
var transactionClass = require('../utils/payUModels/TransactionRequest.js');
var request = require('request');
var models = require('../models/rdb');

//Configurar variaveis para o payU
var payUAccountId = '512327'
var payUReferenceCode = 'payment_test_00000001';
var payUSignature = '31eba6f397a435409f57bc16b5df54c3';
var payUUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
//Chaves de acesso ao payU
var merchant = {
    merchant: {
        "apiKey": "4Vj8eK4rloUd272L48hsrarnUA",
        "apiLogin": "pRRXKOl8ikMmt9u"
    }
}

var createPayUTransaction = function (pedidoParameters, callback) {
    //Buscar dados do usuario
    var userQuery = {
        attributes: [
            'nome', 'telefone', 'email', 'genero'
        ],
        where: {
            idUsuario: pedidoParameters.usuarioIdUsuario
        },
        include: [
            {
                model: models.endereco,
                attributes: [
                    'endereco', 'numero', 'complemento', 'bairro', 'cep'
                ],
                where: {
                    idEndereco: pedidoParameters.enderecoIdEndereco
                },
                include: [
                    {
                        model: models.cidade,
                        attributes: [
                            'nome', 'estadoID'
                        ],
                        include: [
                            {
                                model: models.estado,
                                attributes: ['nome', 'acronimo']
                            }
                        ]
                    }
                ]
            }
        ]
    }
    models
        .usuario
        .get(userQuery, function (userData, error) {
            if (error) {
                return callback(null, error);
            }
            if (!userData) {
                return callback(null, null);
            }
        
            
            var addressRequest = fillAddressForm(userData.dataValues.enderecos[0], userData.telefone);
            // console.log('ADRRESS:'+JSON.stringify(addressRequest));
            //Comprador com endereco
            var buyerRequest = fillBuyerForm(userData, addressRequest);
            //console.log('BUYER:'+JSON.stringify(buyerRequest));
            //Valor do pedido
            var addtionalValue = {
                additionalValues: {
                    "TX_VALUE": {
                        "value": pedidoParameters.valorFinal,
                        "currency": "BRL"
                    }
                }
            }
            //console.log('ADDTIONAL VALUE:'+JSON.stringify(addtionalValue));
            //Ordem com comprador
            var order = createOrderObject('Compra de gás no app Billin', addtionalValue.additionalValues, buyerRequest);
            //console.log('order:'+JSON.stringify(order));

            // //Cartao de credito
            // var creditCard = createCreditCardObject(pedidoParameters.creditCard.name, pedidoParameters.creditCard.number, pedidoParameters.creditCard.securityCode, pedidoParameters.creditCard.expirationDate);
            // console.log('CREDIT CARD:'+JSON.stringify(creditCard));
            //Transacao com Ordem e Cartao de credito
            var transaction = createTransactionObject(order, JSON.parse(pedidoParameters.creditCard), {"INSTALLMENTS_NUMBER": 1} , pedidoParameters.paymentMethod, pedidoParameters.ipAddress, 'devicessession');
            //Finalmente pagamento com transacao
            var paymentRequest = createPaymentObject(true, transaction);
            console.log("PAYMENT REQUEST:" + JSON.stringify(paymentRequest));
            return callback(paymentRequest, null);
        })
}

// Privados Wrapper para comunicacao com a API do PayU Criar buyer no bcash a
// partir de um usuário do billin
var fillBuyerForm = function (usuario, endereco) {
    var buyer = buyerClass.BuyerRequest(usuario.email, usuario.nome, usuario.cpf, usuario.telefone);
    buyer.shippingAddress = endereco;
    return buyer;
}

//Criar endereco no bcash a partir de um endereco do billin
var fillAddressForm = function (endereco, phone) {
    var address = addressClass.AddressRequest(endereco.endereco + ' ' +  endereco.numero + ' ' +  endereco.complemento + ' ' + endereco.bairro,endereco.cidade.dataValues.nome, endereco.cidade.dataValues.estado.dataValues.nome, 'BR', endereco.cep,phone);
    return address;
}

//Criar Objeto da ordem
var createOrderObject = function (description, addValues, buyerRequest) {
    // accountId, referenceCode, description, language, signature, additionalValues,buyer
    var order = orderClass.OrderRequest(payUAccountId, payUReferenceCode, description, 'pt', payUSignature);
    order.additionalValues = addValues;
    order.buyer = buyerRequest;
    return order;
}

//Criar objeto para o cartao de credito
var createCreditCardObject = function (name, number, securityCode, expirationDate) {
    // name, number, securityCode, expirationDate
    var creditCard = creditClass.CreditCardRequest(name, number, securityCode, expirationDate);
    return creditCard;
}

//Criar Objeto da transação
var createTransactionObject = function (order, creditCard, extraParameters, paymentMethod, ipAddress, deviceSessionId) {
    // order, creditCard, extraParameters, type, paymentMethod, paymentCountry,
    // ipAddress, deviceSessionId
    var request = transactionClass.TransactionRequest(order, creditCard, extraParameters, 'AUTHORIZATION_AND_CAPTURE', paymentMethod, 'BR', ipAddress, deviceSessionId);
    return request
}

//Criar Objeto de pagamento
var createPaymentObject = function (isTest, transaction) {
    //language, command, isTest, merchant, transaction
    var request = paymentClass.PaymentRequest('pt', 'SUBMIT_TRANSACTION', true, merchant.merchant, transaction);
    return request
}


//Enviar de fato a request para o payU
var sendPayURequest = function(paymentObject,callback){
      request.post({url: payUUrl, json: paymentObject }, function (error, response, body) {
        if(!error){
            return callback(response.body, null);
        }else{
            return callback(null, error);
        }
    });
}

module.exports = {
    createPayUTransaction: createPayUTransaction,
    sendPayURequest : sendPayURequest

}
