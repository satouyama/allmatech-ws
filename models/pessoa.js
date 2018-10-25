
"use strict";

module.exports = function(sequelize, Sequelize) {
  
  var ContaAcesso =  sequelize.define('imobiliaria', {
    Codigo: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    Nome: {
       
        type : Sequelize.STRING,
           
    },
    NomeReduzido :  {
        type : Sequelize.STRING,     
}, 
 
    Ativo : {
      type: Sequelize.BOOLEAN,
    },

   CodigoImobiliaria : {
      type: Sequelize.BIGINT,
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
        },

        updateData: function (whereParameter, parameters, callback) {
          ContaAcesso.update(parameters, { where: whereParameter }).then(function (updatedUser) {
            return callback(updatedUser, null);
          }).catch(function (error) {
            return callback(null, error);
          });
        },
        
      },
    paranoid: true,
    schema : 'dbo',
    tableName: "Pessoa"
   });
  return ContaAcesso;
};
