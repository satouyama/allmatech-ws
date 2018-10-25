"use strict";


//Model para o BuyerRequest



// class BuyerRequest {
//     constructor(emailAddress, fullName, dniNumber, contactPhone, cellcontactPhone, shippingAddress) {
//         // Checar parametros
//         this.emailAddress = emailAddress;    //Obrigatório String 255 E-email Address do comprador. Ex.: cliente@provedor.com
//         this.fullName = fullName;    //Obrigatório String 80 Nome do comprador. Ex.: Antonio Junior
//         this.dniNumber = dniNumber;      //Obrigatório String 17 CPF do comprador. formato XXX.XXX.XXX-XX exemplo: 811.807.405-64. 
//         this.contactPhone = contactPhone;  //Obrigatório String 20  Para o Brasil utilize o formato ddd(2)+numero(7-9) exemplo: (11)756312633.
//         this.shippingAddress = shippingAddress   //Obrigatório, Objeto JSON do tipo AddressRequest.
   
//     }

//     //Getters and setters

//     getEmailAddress() {
//         return this.emailAddress;
//     }

//     setEmailAddress(emailAddress) {
//         this.emailAddress = emailAddress;
//     }

//     getFullName() {
//         return this.fullName;
//     }

//     setFullName(fullName) {
//         this.fullName = fullName;
//     }

//     getdniNumber() {
//         return this.dniNumber;
//     }

//     setdniNumber(dniNumber) {
//         this.dniNumber = dniNumber;
//     }

//     getContactPhone() {
//         return this.cellcontactPhone;
//     }

//     setContactPhone(cellcontactPhone) {
//         this.contactPhone = contactPhone;
//     }
//     getShippingAddress() {
//         return this.shippingAddress;
//     }

//     setAddress(shippingAddress) {
//         this.shippingAddress = shippingAddress;
//     }
   
// }

// module.exports = BuyerRequest;


var BuyerRequest = function BuyerRequest (emailAddress, fullName, dniNumber, contactPhone, cellcontactPhone, shippingAddress) {
        this.emailAddress = emailAddress;    //Obrigatório String 255 E-email Address do comprador. Ex.: cliente@provedor.com
        this.fullName = fullName;    //Obrigatório String 80 Nome do comprador. Ex.: Antonio Junior
        this.dniNumber = dniNumber;      //Obrigatório String 17 CPF do comprador. formato XXX.XXX.XXX-XX exemplo: 811.807.405-64. 
        this.contactPhone = contactPhone;  //Obrigatório String 20  Para o Brasil utilize o formato ddd(2)+numero(7-9) exemplo: (11)756312633.
        this.shippingAddress = shippingAddress   //Obrigatório, Objeto JSON do tipo AddressRequest.
        return this;
}

module.exports = {
    BuyerRequest : BuyerRequest

}