"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "rdb.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize.authenticate().then(function(err) {
  console.log('Relational Database: Connection has been established successfully.');
}).catch(function (err) {
  console.log('Relational Database: Unable to connect to the database:', err);
});

/* Sincroniza as tabelas */
/*
sequelize.sync({
    force: false
});
*/

db.sequelize = sequelize;

module.exports = db;