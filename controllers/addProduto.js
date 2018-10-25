var models = require('../models/rdb');
var pedidoController = require('../utils/pedidoController');
var errorUtil = require('../utils/errorUtils');

const produtosInsert = (req, res , next) =>{

    const produtosParameters = {
        nome : req.body.nome,
        descricao : req.body.descricao,
        valor : req.body.valor,
        marca : req.body.marca,
        cidadeID : req.body.idCidade,
        distribuidoraIdDistribuidora : req.body.distribuidoraIdDistribuidora
    }

    models
        .produto
        .insert(produtosParameters, function (produto, error) {

            if(error){
                console.log(error);
                return res.status(500).json(errorUtil.jsonFromError(error, "produto.insert.error", 120));
            } else {
                res.status(200).json(produto);
            }

        })

}

const produtosDelete = (req, res , next) =>{
    console.log(req.params.idProduto);
    const idProduto = req.params.idProduto;

    models
        .produto
        .delete(idProduto, function (response, error) {

            if(error){
                console.log(error);
                return res.status(500).json(errorUtil.jsonFromError(error, "produto.delete.error", 120));
            } else {
                res.status(200).json(response);
            }

        })

}


const updateProduto = (req, res , next) => {

    var updateFields = {};

    //Se o nome foi informado
    if (req.body.nome) {
        updateFields['nome'] = req.body.nome;
    }
    //Se a descricao foi passada
    if (req.body.descricao) {
        updateFields['descricao'] = req.body.descricao;
    }
    //Se a marca foi passada
    if (req.body.marca) {
        updateFields['marca'] = req.body.marca;
    }
    //Se o valor foi passado
    if (req.body.valor) {
        updateFields['valor'] = parseFloat(req.body.valor);
    }

    //Se o valor foi passado
    if (req.body.idCidade) {
        updateFields['cidadeID'] = req.body.idCidade;
    }

    //Se a revenda foi passada
    if (req.body.distribuidoraIdDistribuidora) {
        updateFields['distribuidoraIdDistribuidora'] = req.body.distribuidoraIdDistribuidora;
    }

    var whereParams = {
        idProduto: req.params.idProduto,
        ativo: true
    }
    models.produto.updateData(whereParams, updateFields, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "update.produto.error", 500));
        }
        return res.status(200).json(data);
    })

}

const produtosRefatoradoInsert = (req, res , next) =>{
    const produtosParameters = {
        nome : req.body.nome,
        descricao : req.body.descricao,
        valor : req.body.valor,
        marca : req.body.marca,
        novoBairroID : req.body.idNovoBairro,
        distribuidoraIdDistribuidora : req.body.distribuidoraIdDistribuidora
    }

    models
        .novoProduto
        .insert(produtosParameters, function (produto, error) {

            if(error){
                console.log(error);
                return res.status(500).json(errorUtil.jsonFromError(error, "produto.insert.error", 120));
            } else {
                res.status(200).json(produto);
            }

        })
}

const produtosRefatoradoDelete = (req, res , next) =>{
    const idProduto = req.params.idProduto;
    models
        .novoProduto
        .delete(idProduto, function (response, error) {

            if(error){
                console.log(error);
                return res.status(500).json(errorUtil.jsonFromError(error, "produto.delete.error", 120));
            } else {
                res.status(200).json(response);
            }

        })

}


const updateProdutoRefatorado = (req, res , next) => {

    var updateFields = {};

    //Se o nome foi informado
    if (req.body.nome) {
        updateFields['nome'] = req.body.nome;
    }
    //Se a descricao foi passada
    if (req.body.descricao) {
        updateFields['descricao'] = req.body.descricao;
    }
    //Se a marca foi passada
    if (req.body.marca) {
        updateFields['marca'] = req.body.marca;
    }
    //Se o valor foi passado
    if (req.body.valor) {
        updateFields['valor'] = parseFloat(req.body.valor);
    }

    //Se o valor foi passado
    if (req.body.idNovoBairro) {
        updateFields['novoBairroID'] = req.body.idNovoBairro;
    }

    //Se a revenda foi passada
    if (req.body.distribuidoraIdDistribuidora) {
        updateFields['distribuidoraIdDistribuidora'] = req.body.distribuidoraIdDistribuidora;
    }

    var whereParams = {
        idProduto: req.params.idProduto,
        ativo: true
    }
    models.novoProduto.updateData(whereParams, updateFields, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "update.produto.error", 500));
        }
        return res.status(200).json(data);
    })

}


module.exports = {
    produtosInsert,
    produtosDelete,
    updateProduto,
    produtosRefatoradoInsert,
    produtosRefatoradoDelete,
    updateProdutoRefatorado
}