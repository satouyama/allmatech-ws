// "use strict";

// //Created By Neneds - 2016

// //Classe de pagamento 



// class PaymentRequest {
//     constructor(language, command, isTest, merchant, transaction) {
//         // Checar parametros
//         this.language = language; //Obrigatório 2 String  A linguagem usada no pedido. Usando para as mensagens de erro do sistema. Ver lenguajes admitidos.
//         this.command = command; // Obrigatório 32 String Usar SUBMITTRANSACTION. 
//         this.isTest= isTest; // Obrigatório True se tratando de um pedido de teste, false em caso contrário. 
//         this.merchant = merchant; //Obrigatório Objeto JSON Contém os dados de autenticação.
//         this.transaction = transaction; //Obrigatório Objeto JSON com os dados da transação.
//     }

//     //Getters and setters

//     getLanguage() {
//         return this.language;
//     }

//     setLanguage(language) {
//         this.language = language;
//     }

//     getCommand() {
//         return this.command;
//     }

//     setCommand(command) {
//         this.command = command;
//     }

//     getIsTest() {
//         return this.buyer;
//     }

//     setIsTest(isTest) {
//         this.isTest = isTest;
//     }
//     getMerchant() {
//         return this.merchant;
//     }

//     setMerchant(merchant) {
//         this.merchant = merchant;
//     }

//     getTransaction() {
//         return this.transaction;
//     }
//     setTransaction(transaction) {
//         this.transaction = transaction;
//     }
// }

// module.exports = PaymentRequest;

var PaymentRequest = function PaymentRequest (language, command, isTest, merchant, transaction) {
        // Checar parametros
        this.language = language; //Obrigatório 2 String  A linguagem usada no pedido. Usando para as mensagens de erro do sistema. Ver lenguajes admitidos.
        this.command = command; // Obrigatório 32 String Usar SUBMIT_TRANSACTION. 
        this.test= isTest; // Obrigatório True se tratando de um pedido de teste, false em caso contrário. 
        this.merchant = merchant; //Obrigatório Objeto JSON Contém os dados de autenticação.
        this.transaction = transaction; //Obrigatório Objeto JSON com os dados da transação.
        return this;
}

module.exports = {
    PaymentRequest : PaymentRequest
}