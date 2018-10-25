var models = require('../models/rdb');
var pedidoController = require('../utils/pedidoController');
var errorUtil = require('../utils/errorUtils');

const agendamento = (req, res , next) =>{
      console.log(req.body);
                  
       const pedidoParameters = {
           statusPagamento  : 1,
           tipoPagamento: 1,
           valorPedido : req.body.valorPedido,
           quantidade : req.body.quantidade,
           statusPedidoEntregador  : 1,
           statusPedidoUsuario : 1,
           novoEnderecoIdEndereco : req.body.idNovoEndereco,
           valorProduto : req.body.valorProduto,
           data : new Date(),
           valorFinal : req.body.valorFinal,
           usuarioIdUsuario: req.params.idUsuario,
           valorPagamento: req.body.valorFinal,
           troco: 0,
           entregadorIdEntregador: 116 //entregador default
       }

      models
      .pedido
      .insert(pedidoParameters, function (pedido, error) { 
            
           if(error){
               console.log(error);
               return res.status(500).json(errorUtil.jsonFromError(error, "pedido.insert.error", 120));
           } else {
               res.status(200).json(pedido);
           }

      })
}

module.exports = {
    agendamento
}