
"use strict";

module.exports = function(sequelize, Sequelize) {
  
  var ContaAcesso =  sequelize.define('ContaAcesso', {
    Codigo: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    CodigoUsuarioProprietario: {
       
            type: Sequelize.BIGINT,
           
    },
    CodigoPessoaContratante :  {
        type: Sequelize.BIGINT,       
},

  }, 

  {
    freezeTableName : true,
      timestamps: false,
      classMethods: {
      
        associate: function (models) {
            ContaAcesso.hasMany(models.usuario,{foreignKey: "Codigo"});
           
          },
          
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
    schema : 'acesso',
    tableName: "ContaAcesso"
   });
  return ContaAcesso;
};
