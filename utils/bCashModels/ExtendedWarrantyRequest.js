"use strict";

//Classe para a garantia extendida



var ExtendedWarrantyRequest = function ExtendedWarrantyRequest  (monthWarranty,amount,token) {
        this.monthWarranty = monthWarranty;  //Obrigatório Endereço do comprador. Ex.: Av. Tiradentes
        this.amount = amount;   //Obrigatório Número do endereço do comprador. Ex.: 1254
        this.token = token;  //  Token retornado no serviço de consulta de garantia estendida, disponibilizado pelo Bcash no endereço: https://api.bcash.com.br/service/searchValue Warranty/xml/ O token deve ser enviado para cada tipo de produto que tenha garantia.x.:wPCVaT8v3Q3wyIAV6OGpBD7eN7LZBnvj4F 1M/626+ Y2c1BJP4EG4IalwZP8LmYJJ49ieIxidxFY+m BdKVgbCBg==
        return this;
}

module.exports = {
   ExtendedWarrantyRequest  : ExtendedWarrantyRequest 
}