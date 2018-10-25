var models = require('../models/rdb');
var pedidoController = require('../utils/pedidoController');
var errorUtil = require('../utils/errorUtils');



const refatorados = (req, res , next)=> {


    var params = {
        attributes: ['idProduto', 'nome', 'descricao', 'marca', 'valor','novoBairroID'],
        include: [
            {
                model: models.novoBairro,
                required: false,
                include: [
                    {
                        model: models.novaCidade,
                        required: false
                    }
                ],
            },
            {
                model: models.distribuidora,
                attributes: ['idDistribuidora', 'nome'],
                required: false,
            }
        ],
        order: [
            [['idProduto', 'ASC'],]
        ],
        //limit : limit,
        //offset : offset
    }
    models.novoProduto.getAll(params, function (data, error) {
        if (error) {
            return res.status(500).json(errorUtil.jsonFromError(error, "produto.refatorado.list.error", 500));
        }
        return res.status(200).json(data);
    });


}


module.exports = {
    refatorados
}