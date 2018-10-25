"use strict";

/*
mail, name, cpf, phone, cellPhone, address (objeto JSON do tipo AddressRequest), gender, birthDate, rg, issueRgDate, organConsignorRg, stateConsignorRg, companyName, cnpj, searchToken
*/

//Classe para o usuário

var CustomerRequest = function CustomerRequest (mail, name, cpf, phone, cellphone, address, gender, birthdate, rg, issueRgDate, organConsignorRg, stateConsignorRg, companyName, cnpj, searchToken) {
        this.mail = mail;  //Obrigatório E-mail do comprador.Ex.: cliente@provedor.com
        this.name = name;  //Obrigatório  Nome do comprador. Ex.: Antonio Junior
        this.cpf = 12345678909;    //Obrigatório CPF do comprador. Ex.: 99999999999
        this.phone = phone;  //Obrigatório somente se não foi informado o cellphone Telefone do comprador: DDD + número telefônico
        this.cellphone = cellphone; //Obrigatório  somente se não foi informado o phone Telefone do comprador: DDD + número telefônico
        this.address = address;  //Obrigatório  objeto JSON tipo AddressRequest
        this.gender = gender;   //Obrigatório Sexo do comprador. Ex.: M
        this.birthdate = birthdate;  //Data de nascimento do comprador. No formato dd/MM/aaaa. Ex.: 26/12/1985
        this.rg = rg;                // RG do comprador. Ex.: 99999999
        this.issueRgDate = issueRgDate; //Data da emissão do RG do comprador. No formato dd/MM/aaaa. Ex.: 15/08/1998
        this.organConsignorRg = organConsignorRg; //Órgão emissor do RG do comprador. Ex.: SSP
        this.stateConsignorRg = stateConsignorRg;  //Estado emissor do RG do comprador. Ex.: MG
        this.companyName = companyName; // Razão social do comprador. Enviado somente quando a conta do cliente for conta Jurídica. Ex.: Razão Social da minha empresa
        this.cnpj = cnpj;  //CNPJ do comprador. Enviado somente quando a conta do cliente for conta Jurídica. Ex.: 99999999999999
        this.searchToken = searchToken; //Token gerado a partir do serviço de consulta de conta. Ex.: P2Z/G54BkrkM7gs+TIkdIQ==
          
        return this;
}

module.exports = {
    CustomerRequest : CustomerRequest
}
