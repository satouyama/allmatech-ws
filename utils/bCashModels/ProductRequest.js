"use strict";

//Classe ProductRequest


/*
code, description, amount, value, extraDescription
*/
var ProductRequest = function ProductRequest (code,extendedWarranty,description, amount, value, extraDescription) {
        this.code = code; //Obrigatório Código que identifica o produto em sua loja Ex.: 446   
        this.extendedWarranty = extendedWarranty; //objeto JSON do tipo ExtendedWarrantyRequest
        this.description = description; //Obrigatório Descrição do(s) produto(s) comprado(s). Será visualizada pelo cliente no Bcash.Ex.: Camiseta da seleção brasileira
        this.amount = amount; //Obrigatório Quantidade comprada do(s) produto(s). Ex.: 2
        this.value = value; //Obrigatório Valor unitário do produto. Ex.: 10.95
        this.extraDescription = extraDescription;  //Descrição adicional do produto. Ex.: Tamanho P 
          
        return this;
}

module.exports = {
    ProductRequest : ProductRequest
}