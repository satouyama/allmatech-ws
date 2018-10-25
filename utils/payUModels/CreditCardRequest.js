// "use strict";

// //Classe cartão de credito



// class CreditCardRequest {
//     constructor(name, number, securityCode, expirationDate) {
//         this.name = name; //Obrigatório String 255 O nome que aparece no cartão de crédito.
//         this.number = number;  //Obrigatório String Mín: 13 Máx: 20 O número do cartão de crédito.
//         this.securityCode = securityCode; //Obrigatório String Mín: 1 Máx: 4 O código de segurança da cartão de crédito (CVC2, CVV2, CID).
//         this.expirationDate = expirationDate;  //Obrigatório String 7 A data de expiração do cartão de crédito, vide nos exemplos a disponibilidade por forma de pagamento. Formato YYYY/MM.
//     }

//     //Getters and setters

//     getName() {
//         return this.name;
//     }

//     setName(name) {
//         this.name = name;
//     }

//     getNumber() {
//         return this.number;
//     }

//     setNumber(number) {
//         this.number = number;
//     }
//     getSecurityCode() {
//         return this.securityCode;
//     }

//     setSecurityCode(securityCode) {
//         this.securityCode = securityCode;
//     }
//     getExpirationDate() {
//         return this.expirationDate;
//     }

//     setExpirationDate(expirationDate) {
//         this.expirationDate = expirationDate;
//     }

// }

// module.exports = CreditCardRequest;


var CreditCardRequest = function CreditCardRequest (name, number, securityCode, expirationDate) {
        // Checar parametros
       this.name = name; //Obrigatório String 255 O nome que aparece no cartão de crédito.
       this.number = number;  //Obrigatório String Mín: 13 Máx: 20 O número do cartão de crédito.
       this.securityCode = securityCode; //Obrigatório String Mín: 1 Máx: 4 O código de segurança da cartão de crédito (CVC2, CVV2, CID).
       this.expirationDate = expirationDate;  //Obrigatório String 7 A data de expiração do cartão de crédito, vide nos exemplos a disponibilidade por forma de pagamento. Formato YYYY/MM.
        return this;
}

module.exports = {
    CreditCardRequest : CreditCardRequest

}