
"use strict";

module.exports = function(sequelize, Sequelize) {
  
  var Logs =  sequelize.define('logs', {
    LogID: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    Message : {
      type : Sequelize.STRING
    }

  }, 

  {
    freezeTableName : true,
      timestamps: false,
      classMethods: {
           
        getAll: function (parameters, callback) {
        Logs.findAll(parameters)
              .then(function(data){
                  return callback(data,null);
              }).catch(function(error){
              return callback(null,error);
          });
      },
        insert: function (parameters, callback) {
        Logs
            .build(parameters)
            .save()
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        },

        get: function (parameters, callback) {
          Logs.findOne(parameters)
            .then(function (dataPromo) {
              return callback(dataPromo, null);
            }).catch(function (error) {
              return callback(null, error);
            });
        }
        
      },
    paranoid: true,
    schema : 'Log',
    tableName: "Log"
   });
  return Logs;
};
