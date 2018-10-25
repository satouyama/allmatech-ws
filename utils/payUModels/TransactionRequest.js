// "use strict";

// //Created By Neneds - 2016 Classe de transação

// class TransactionRequest {
//     constructor(order, creditCard, extraParameters, type, paymentMethod, paymentCountry, ipAddress, deviceSessionId) {
//         // Checar parametros
//         this.order = order; //Obrigatório  Objeto JSON Order. Os dados da ordem.
//         this.creditCard = creditCard; //  Objeto JSON creditCard Os dados do cartão de crédito.
//         this.extraParameters = extraParameters; // Objeto JSON Order. Os parâmetros ou dados adicionais associados a uma transação. Estes parâmetros podem variar de acordo com a forma de pagamento ou preferências do comércio.
//         this.type = type; //Obrigatório AUTHORIZATION OU AUTHORIZATIONANDCAPTURE
//         this.paymentMethod = paymentMethod; //Obrigatório String 32 O meio de pagamento.
//         this.paymentCountry = paymentCountry; //Obrigatório  String 2 Países de Pagamento. Veja os Países de Pagamento.
//         this.ipAddress = ipAddress; //Obrigatório String 39. O endereço IP do dispositivo de onde se realiza a transação.
//         this.deviceSessionId = deviceSessionId; //Obrigatório String 255. O identificador da sessão do dispositivo de onde se realiza a transação. Você poderá encontrar mais informação na página de considerações sobre as variáveis.
//     }

//     //Getters and setters

//     getOrder() {
//         return this.order;
//     }

//     setOrder(order) {
//         this.order = order;
//     }

//     getCreditCard() {
//         return this.creditCard;
//     }

//     setCreditCard(creditCard) {
//         this.creditCard = creditCard;
//     }

//     getExtraParameters() {
//         return this.buyer;
//     }

//     setExtraParameters(extraParameters) {
//         this.extraParameters = extraParameters;
//     }
//     getType() {
//         return this.type;
//     }

//     setType(type) {
//         this.type = type;
//     }

//     getPaymentMethod() {
//         return this.paymentMethod;
//     }
//     setPaymentMethod(paymentMethod) {
//         this.paymentMethod = paymentMethod;
//     }

//     getPaymentCountry() {
//         return this.paymentCountry;
//     }
//     setPaymentCountry(paymentCountry) {
//         this.paymentCountry = paymentCountry;
//     }

//     getIpAddress() {
//         return this.ipAddress;
//     }
//     setIpAddress(ipAddress) {
//         this.ipAddress = ipAddress;
//     }

//     getDeviceSessionId() {
//         return this.deviceSessionId;
//     }
//     setDeviceSessionId(deviceSessionId) {
//         this.deviceSessionId = deviceSessionId;
//     }
// }

// module.exports = TransactionRequest;


var TransactionRequest = function TransactionRequest (order, creditCard, extraParameters, type, paymentMethod, paymentCountry, ipAddress, deviceSessionId) {
        // Checar parametros
        this.order = order; //Obrigatório  Objeto JSON Order. Os dados da ordem.
        this.creditCard = creditCard; //  Objeto JSON creditCard Os dados do cartão de crédito.
        this.extraParameters = extraParameters; // Objeto JSON Order. Os parâmetros ou dados adicionais associados a uma transação. Estes parâmetros podem variar de acordo com a forma de pagamento ou preferências do comércio.
        this.type = type; //Obrigatório AUTHORIZATION OU AUTHORIZATIONANDCAPTURE
        this.paymentMethod = paymentMethod; //Obrigatório String 32 O meio de pagamento.
        this.paymentCountry = paymentCountry; //Obrigatório  String 2 Países de Pagamento. Veja os Países de Pagamento.
        this.ipAddress = ipAddress; //Obrigatório String 39. O endereço IP do dispositivo de onde se realiza a transação.
        this.deviceSessionId = deviceSessionId; //Obrigatório String 255. O identificador da sessão do dispositivo de onde se realiza a transação. Você poderá encontrar mais informação na página de considerações sobre as variáveis.
        return this;
}

module.exports = {
    TransactionRequest : TransactionRequest

}