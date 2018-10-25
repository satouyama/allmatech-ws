// "use strict";

// //Created By Neneds - 2016 

// //Classe order

// class OrderRequest {
//     constructor(accountId, referenceCode, description, language, signature, additionalValues, buyer) {
//         // Checar parametros
//         this.accountId = accountId; // Obrigatório String 15  O identificador da conta.
//         this.referenceCode = referenceCode; //Obrigatório String 255  O código de referência da ordem. Representa o identificador da transação no sistema do comércio.
//         this.description = description, //Obrigatório String 50 A descrição da ordem.
//         this.language = language, // Obrigatório String 2  O idioma usado nos e-mails enviados ao comprador e vendedor.
//         this.signature = signature, //Obrigatório 255 String A assinatura associada à ordem. Para saber mais visite considerações sobre as variáveis.
//         this.addtionalValues = addtionalValues // String 9 CEP do comprador. Para o Brasil utilize o formato XXXXX-XXX ou XXXXXXXX exemplo: 09210-710 ou 09210710
//         this.buyer = buyer //Obrigatório objeto JSON do tipo buyer
//     }

//     //Getters and setters

//     getReferenceCode() {
//         return this.referenceCode;
//     }

//     setReferenceCode(referenceCode) {
//         this.referenceCode = referenceCode
//     }

//     getAccountId() {
//         return this.accountId;
//     }

//     setAccountId(accountId) {
//         this.accountId = accountId
//     }
//     getDescription() {
//         return this.description;
//     }

//     setDescription(description) {
//         this.description = description
//     }
//     getLanguage() {
//         return this.language;
//     }

//     setLanguage() {
//         this.language = language
//     }
//     getAddtionalValues() {
//         return this.addtionalValues;
//     }

//     setAddtionalValues(addtionalValues) {
//         this.addtionalValues = addtionalValues
//     }

// }

// module.exports = OrderRequest;

var OrderRequest = function OrderRequest (accountId, referenceCode, description, language, signature, additionalValues, buyer) {
        // Checar parametros
        this.accountId = accountId; // Obrigatório String 15  O identificador da conta.
        this.referenceCode = referenceCode; //Obrigatório String 255  O código de referência da ordem. Representa o identificador da transação no sistema do comércio.
        this.description = description, //Obrigatório String 50 A descrição da ordem.
        this.language = language, // Obrigatório String 2  O idioma usado nos e-mails enviados ao comprador e vendedor.
        this.signature = signature, //Obrigatório 255 String A assinatura associada à ordem. Para saber mais visite considerações sobre as variáveis.
        this.additionalValues = additionalValues //Obrigatório  Objeto JSON com o valor do pagamento
        this.buyer = buyer //Obrigatório objeto JSON do tipo buyer
        return this;
}

module.exports = {
    OrderRequest : OrderRequest

}