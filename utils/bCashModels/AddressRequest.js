"use strict";

//Classe endereço

/*
address, number, complement, neighborhood, city, state, zipCode
*/


var AddressRequest = function AddressRequest (address, number, complement, neighborhood, city, state, zipCode) {
        this.address = address;  //Obrigatório Endereço do comprador. Ex.: Av. Tiradentes
        this.number = number;   //Obrigatório Número do endereço do comprador. Ex.: 1254
        this.complement = complement;  //  Complemento do endereço do comprador. Ex.: Apartamento 10
        this.neighborhood = neighborhood;  //Obrigatório  Bairro do comprador. Ex.: Centro
        this.city = city;    //Obrigatório Cidade do comprador. Ex.: São Paulo
        this.state = state;  //Obrigatório Estado do comprador. Ex.: MG
        this.zipCode = zipCode; //Obrigatório CEP do comprador. Ex.: 17500000
          
        return this;
}

module.exports = {
    AddressRequest : AddressRequest
}