"use strict";

//Classe para transacao dependente

/*
email,value
*/

var DependentTransactionRequest = function DependentTransactionRequest  (email, value) {
        this.email = email;  //Email da conta dependente. Ex.: empresa@provedor.com
        this.value = value;  //Valor monetário da transação dependente. Ex.: 10.95
}

module.exports = {
    DependentTransactionRequest  : DependentTransactionRequest 
}