/*Created by Neneds*/

var http_build_query = require('qhttp');
var addressClass = require('../utils/bCashModels/AddressRequest.js');
var buyerClass = require('../utils/bCashModels/CustomerRequest.js');
var creditClass = require('../utils/bCashModels/CreditCardRequest.js');
var dependentTransactionClass = require('../utils/bCashModels/DependentTransactionRequest.js');
var productClass = require('../utils/bCashModels/ProductRequest.js');
var paymentClass = require('../utils/bCashModels/PaymentMethodEnum.js');
var md5 = require('md5');
var transactionClass = require('../utils/bCashModels/TransactionRequest.js');
var request = require('request');
var urlencode = require('urlencode');
var base64 = require('base64-coder-node')();
var models = require('../models/rdb');

//Configurar variaveis para o acesso ao bCash
var bCashURL = 'https://sandbox-api.bcash.com.br/service/createTransaction/json/';


var createBCashTransaction = function (pedidoParameters, callback) {
    //console.log('PEDIDO PARAMETERS:' + JSON.stringify(pedidoParameters));
    //Buscar dados do usuario
    var userQuery = {
        attributes: [
            'nome', 'telefone', 'email', 'genero','cpf'
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
            //console.log('ADRRESS:'+JSON.stringify(addressRequest));
            //Comprador com endereco
            var buyerRequest = fillBuyerForm(userData, addressRequest);
            //console.log('BUYER:'+JSON.stringify(buyerRequest));

            //Produto
            var product = createProductForm(pedidoParameters.valorProduto,pedidoParameters.quantidade);
            //console.log('PRODUTO:'+JSON.stringify(product));
            //Método de pagamento
            var method = createPaymentMethodForm(pedidoParameters.paymentMethod);

            //Array com as transações dependentes
            var arrDependentTransactions = [];

		var valueTotal = pedidoParameters.valorProduto - 6.00;
            //Transaç			csdasdasdão dependente para o entregador
            var dependentEntregador = {"email" : 'testeteste@gmail.com', "value" : 1.00};
            arrDependentTransactions.push(dependentEntregador);
		valueTotal = valueTotal - 6.30;
            //Transação dependente para o bilin
            var dependentBilin = {"email" : 'testeteste@gmail.com', "value" : 2.30};
             arrDependentTransactions.push(dependentBilin);

            //Transação dependente para a distribuidora
            if(pedidoParameters.emailDistribuidora){
              var dependentDistribuidora = {"email" : 'stylec@gmail.com', "value" : 1.00};
              arrDependentTransactions.push(dependentDistribuidora);
            }

            console.log('TRANSACOES DEPENDENTES'+JSON.stringify(arrDependentTransactions));

            //Criar objeto da transacao
           var transaction = createTransactionObject('stylec@gmail.com','001',buyerRequest,0,method,[product],arrDependentTransactions,1,pedidoParameters.creditCard,pedidoParameters.viewed,pedidoParameters.accepted);
	   transaction.creditCard.holder = 'Comprador Teste';
transaction.creditCard.maturityMonth= '12';
transaction.creditCard.maturityYear = '2018';            //Finalmente pagamento com transacao
transaction.acceptedContract = 'S';
transaction.viewedContract = 'S';
           console.log("TRANSACTION:" + JSON.stringify(transaction));
            return callback(transaction, null);
        })
}

// Wrapper para lidar com a montagem do JSON para o bCash, utilizando os dados do billin

// partir de um usuário do billin
var fillBuyerForm = function (usuario, endereco) {
    var buyer = buyerClass.CustomerRequest(usuario.email, usuario.nome, usuario.cpf, usuario.telefone,usuario.genero);
    buyer.address = endereco;
    return buyer;
}

//Criar endereco no bcash a partir de um endereco do billin
var fillAddressForm = function (endereco) {
    var address = addressClass.AddressRequest(endereco.endereco,endereco.numero, endereco.complemento,endereco.bairro, endereco.cidade.dataValues.nome, endereco.cidade.dataValues.estado.dataValues.acronimo,endereco.cep);
    return address;
}

//Criar produto no bCash a partir dos dados do pedido do billin
var createProductForm = function(value,amount){
   var product = productClass.ProductRequest('001',null,'Botijão do gás comprado pelo app Bilin',amount,value,'');
   return product
}

//Criar metodo de pagamento no bCash a partir dos dados do pedido do billin
var createPaymentMethodForm = function(codeValue){
    var code = 1;
    if (codeValue == "VISA") {
        code = 1;
    }
    if (codeValue == "MASTERCARD") {
        code = 2;
    }
    if (codeValue == "AMERICAN_EXPRESS") {
        code = 32;
    }
    if (codeValue == "AURA") {
        code = 45;
    }
    if (codeValue == "DINERS") {
        code = 55;
    }
    if (codeValue == "HIPERCARD") {
        code = 56;
    }
    if (codeValue == "ELO") {
        code = 63;
    }
   var paymentMethod = {code : code}
   return paymentMethod
}

//Criar transação dependente no bCash a partir dos dados do pedido do billin
var createDependentTransactionForm = function(value,email){
   var dependent = dependentTransactionClass.DependentTransactionRequest(email,value);
   return dependent
}



//Criar Objeto da transação
var createTransactionObject = function (sellerMail, pedidoId,buyer,discountValue, paymentMethod, products, dependentTransactions,installments,CreditCardRequest,viewed,accepted) {
    var request = transactionClass.TransactionRequest(sellerMail,pedidoId,buyer,'',0,'',discountValue,0,paymentMethod,'','',products,dependentTransactions,1,CreditCardRequest,'BRL',accepted,viewed,'');
    return request
}


//Enviar de fato a request para o bCash
var sendBCashRequest = function(paymentObject,callback){
    var realm = "https://sandbox-api.bcash.com.br/service/createTransaction/json/";
    var oauth_consumer_key = "ed70909190cce67f34c5853f133be46608b7ae8e";
    var oauth_nounce = md5(Math.floor(Date.now() / 1000));
    var oauth_signature_method = "PLAINTEXT";
    var oauth_timestamp = Math.floor(Date.now() / 1000);
    var oauth_version = "1.0";

    var oauth_signature =
    "oauth_consumer_key="+urlencode(oauth_consumer_key)
    +"&oauth_nonce="+urlencode(oauth_nounce)
    +"&oauth_signature_method="+urlencode(oauth_signature_method)
        +"&oauth_timestamp="+urlencode(oauth_timestamp)
        +"&oauth_version="+urlencode(oauth_version);

    oauth_signature = base64.encode(oauth_signature);

    var headerValue ="OAuth "+
        "realm="+realm+","+
        "oauth_consumer_key="+oauth_consumer_key+","+
        "oauth_nonce="+oauth_nounce+"," +
        "oauth_signature="+oauth_signature+","+
        "oauth_signature_method="+oauth_signature_method+","+
        "oauth_timestamp="+oauth_timestamp+","+
        "oauth_version="+oauth_version;

console.log("payment-----------------",headerValue);

    console.log("payment success-----------------","OAuth realm=https://sandbox-api.bcash.com.br/service/createTransaction/json/,oauth_consumer_key=437f7c3021a87ebf1cefb17be66e3fb72fa8dd51,oauth_nonce=9e50a7ca2f0aa629922c23ac402a8e06,oauth_signature=b2F1dGhfY29uc3VtZXJfa2V5PTQzN2Y3YzMwMjFhODdlYmYxY2VmYjE3YmU2NmUzZmI3MmZhOGRkNTEmb2F1dGhfbm9uY2U9OWU1MGE3Y2EyZjBhYTYyOTkyMmMyM2FjNDAyYThlMDYmb2F1dGhfc2lnbmF0dXJlX21ldGhvZD1QTEFJTlRFWFQmb2F1dGhfdGltZXN0YW1wPTE0OTAyOTU4ODIwMDAmb2F1dGhfdmVyc2lvbj0xLjA=,oauth_signature_method=PLAINTEXT,oauth_timestamp=1490295882000,oauth_version=1.0");
request({
	url: bCashURL,
        method: 'POST',
        headers: {
            'Authorization': headerValue
        }
        ,form: {
            data: JSON.stringify(paymentObject),
            version: '1.0',
            encode: 'iso-8859-1'
        }
    }
 ,function (error, response, body) {
          console.log('--------------------ERROR', error);
          console.log('--------------------RESPONSE', response);
          console.log('--------------------BODY', body);
/*         if(!error){
              if(response.body.code != null){
                  return callback(body, new Error('bCash transaction error'));
              }else{
                return callback(body, null);
              }
             return callback(body, null);
         }else{
            return callback(null, error);
        }*/
        return callback(null,null);
    });
}

module.exports = {
    createBCashTransaction: createBCashTransaction,
    sendBCashRequest : sendBCashRequest

}


/*

`{
    "holder" : "FAUSTO SILVA"
    "number" : "4983440965807473"
    "securityCode" : 563
    "maturityMonth" : 10
    "maturityYear" :  2017
}`
*/
