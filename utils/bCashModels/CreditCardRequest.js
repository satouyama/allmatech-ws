"use strict";


/*
holder,number, securityCode, maturityMonth, maturityYear
*/

//Classe cartão de credito

var CreditCardRequest = function CreditCardRequest (holder, number, securityCode, maturityMonth, maturityYear) {
        this.holder = 'Comprador teste'; //Obrigatório Nome do titular do cartão de crédito. Ex.: JOAO D S SILVA
        this.number = number; //Obrigatório Número do cartão de crédito do cliente. Ex.: 4111111111111110
        this.securityCode = securityCode; //Obrigatório Código de segurança do cartão de crédito, geralmente encontra-se no verso do cartão.Ex.: 123
        this.maturityMonth = '12'; //Obrigatório Mês de vencimento do cartão de crédito. Ex.: 08
        this.maturityYear = '2018'; //Obrigatório Ano de vencimento do cartão de crédito. Ex.: 2017
          
        return this;
}

module.exports = {
    CreditCardRequest : CreditCardRequest
}
