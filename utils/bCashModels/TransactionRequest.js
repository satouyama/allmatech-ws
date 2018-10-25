"use strict";

//Classe para a transacao

/*
sellerMail, orderId, buyer (objeto JSON do tipo CustomerRequest), free, freight, freightType, discount, addition, paymentMethod (objeto JSON do tipo PaymentMethodRequest), urlReturn, urlNotification, products (lista de objetos JSON do tipo ProductRequest), dependentTransactions (lista de objetos JSON do tipo DependentTransactionRequest), installments, creditCard (objeto JSON do tipo CreditCardRequest), currency, acceptedContract, viewedContract, campaigned
*/


var TransactionRequest = function TransactionRequest (sellerMail, orderId, buyer, free, freight, freightType, discount,addition,paymentMethod,urlReturn,urlNotification,products,dependentTransactions,installments,creditCard,currency,acceptedContract,viewedContract,campaigned) {
        this.sellerMail = sellerMail; //Obrigatório  E-mail da loja cadastrada no Bcash. Ex.: empresa@provedor.com
        this.orderId = orderId;     //Código do pedido atribuído pela loja. Ex.: 123
        this.buyer = buyer;  //Obrigatório Objeto JSON do tipo CustomerRequest.
        this.free = free; //Campo de livre digitação. Pode ser utilizado para algum parâmetro adicional de identificação da venda.
        this.freight = freight;  //Valor do frete. Ex.: 10.25
        this.freightType = freightType; // Tipo do frete (SEDEX, PAC, ENCOMENDA, CARTA_REGISTRADA e E_SEDEX).Ex.: SEDEX
        this.discount = discount; //Valor total do desconto atribuído pela loja. Ex.: 2.25
        this.addition = addition; // Valor total do acréscimo feito pela loja. Ex.: 2.25
        this.paymentMethod = paymentMethod; //Obrigatório Valor do enum paymentMethod.
        this.urlReturn = urlReturn; //URL que direciona o usuário para a loja. Ex.: http://www.bcash.com.br/loja/retorno.php
        this.urlNotification = urlNotification; //URL que a loja irá receber as informações de alteração de status da transação.Ex.: http://www.bcash.com.br/loja/aviso.php
        this.products = products; //Obrigatório Lista de objetos JSON do tipo ProductRequest.
        this.dependentTransactions = dependentTransactions; //Obrigatório Lista de objetos JSON do tipo DependentTransactionRequest
        this.installments = installments; //Quantidade de parcelas que a compra será processada.Ex.: 5
        this.creditCard = creditCard; //Obrigatório Objeto JSON do tipo CreditCardRequest.
        this.currency = currency; //Moeda utilizada para a transação. Ex.: BRL(Real)
        this.acceptedContract = acceptedContract;//Obrigatório Parâmetro utilizado para informar se o comprador aceitou os termos do contrato (S – Sim ou N - Não).Ex.: S
        this.viewedContract = viewedContract;//Obrigatório Parâmetro utilizado para informar se o comprador visualizou os termos do contrato (S – Sim ou N - Não).Ex.: S
        this.campaigned = campaigned; //Identificador da campanha da loja no Bcash.

          
        return this;
}

module.exports = {
    TransactionRequest : TransactionRequest
}