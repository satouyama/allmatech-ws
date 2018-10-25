"use strict";


//Created By Neneds - 2016

//Classe endereço


var AddressRequest = function AddressRequest (street1, city, state, country, postalCode,phone) {
        this.street1 = street1;   // String 150 Endereço do comprador. Ex.: Av. Tiradentes
        this.city = city,   //String 50 Cidade do comprador. Ex.: São Paulo     
        this.state = state,  // String 2 CEP do comprador. Ex.: 17500000
        this.country = country,  // String 2 País do endereço de envio do comprador na ISO 3166 formato de Alfa 2 código.
        this.postalCode = postalCode  // String 9 CEP do comprador. Para o Brasil utilize o formato XXXXX-XXX ou XXXXXXXX exemplo: 09210-710 ou 09210710 
        this.phone = phone;     //Obrigatório String 20  Para o Brasil utilize o formato ddd(2)+numero(7-9) exemplo: (11)756312633.
          
        return this;
}

module.exports = {
    AddressRequest : AddressRequest

}