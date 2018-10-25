
"use strict";

module.exports = function(sequelize, Sequelize) {
  
  var ContaAcesso =  sequelize.define('imovel', {
    Codigo: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    CodigoPesquisa: {
       
        type : Sequelize.STRING,
           
    },
    DescricaoTecnica :  {
        type : Sequelize.STRING,     
}, 
 
    Quartos : {
        type : Sequelize.STRING,
    },
    Suites : {
        type : Sequelize.STRING,
    },

    AreaPrivativa : {
      type : Sequelize.STRING,
    }

  }, 

  {
    freezeTableName : true,
      timestamps: false,
      classMethods: {
          
        getAll: function (parameters, callback) {
          ContaAcesso.findAll(parameters)
              .then(function(data){
                  return callback(data,null);
              }).catch(function(error){
              return callback(null,error);
          });
      },
        insert: function (parameters, callback) {
         ContaAcesso
            .build(parameters)
            .save()
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        },

        get: function (parameters, callback) {
          ContaAcesso.findOne(parameters)
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        }
        
      },
    paranoid: true,
    schema : 'dbo',
    tableName: "Imovel"
   });
  return ContaAcesso;
};
