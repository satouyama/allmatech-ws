
"use strict";

module.exports = function(sequelize, Sequelize) {
  
  var Usuario =  sequelize.define('usuario', {
    Codigo: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    Login: {
      type: Sequelize.STRING,
      
    },
    Senha : {
      type : Sequelize.STRING
    },

    Bloqueado : {
      type: Sequelize.BOOLEAN,
      defaultValue : true
    },

    CodigoPessoa : {
      type: Sequelize.BIGINT,
      
    }


   

  }, 

  {
    freezeTableName : true,
      timestamps: false,
      classMethods: {
        associate: function (models) {
          Usuario.hasOne(models.imobiliarias,{foreignKey: "CodigoGrupo"});
         
        },
        getAll: function (parameters, callback) {
          Usuario.findAll(parameters)
              .then(function(data){
                  return callback(data,null);
              }).catch(function(error){
              return callback(null,error);
          });
      },
        insert: function (parameters, callback) {
          Usuario
            .build(parameters)
            .save()
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        },

        get: function (parameters, callback) {
         Usuario.findOne(parameters)
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        }
        
      },
    paranoid: true,
    schema : 'acesso',
    tableName: "usuario"
   });
  return Usuario;
};
