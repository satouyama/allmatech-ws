const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var nconf = require('nconf');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = path.join(__dirname, 'config.json');
var models = require('../models/rdb');
var errorUtil = require('../utils/errorUtils');

nconf.argv().env();
nconf.file({ file: config });

module.exports = function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: nconf.get('secret')
  };
  passport.use(new JwtStrategy(opts, function (payload, done) {
    console.log(payload);
    if (payload.role == "usuario") {
      var queryUser = {
        attributes: ['idUsuario', 'role', 'senha'],
        where: {
          idUsuario: payload.id
        }
      }
      models.usuario.get(queryUser, function (user, error) {
        if (error) {
          return done(error, null);
        }
        if (user) {
          if(user.ativo == false){
            var userError  = errorUtil.createError("inactive.user",150);
            return done(userError, null);
          }
          return done(null, user);
        } else {
          return done(null, null);
        }
      })

    } else if (payload.role == "entregador") {
      var queryEntregador = {
        attributes: ['idEntregador', 'role', 'senha'],
        where: {
          idEntregador: payload.id
        }
      }
      models.entregador.get(queryEntregador, function (user, error) {
        if (error) {
          return done(error, null);
        }
        if (user) {
          if(user.ativo == false){
            var userError  = errorUtil.createError("inactive.user",150);
            return done(userError, null);
          }
          return done(null, user);
        } else {
          return done(null, null);
        }
      })
    } else if (payload.role == "dist") {
      var queryDistribuidora = {
        attributes: ['idDistribuidora', 'role', 'senha'],
        where: {
          idDistribuidora: payload.id
        }
      }
      models.distribuidora.get(queryDistribuidora, function (user, error) {
        if (error) {
          return done(error, null);
        }
        if (user) {
          if(user.ativo == false){
            var userError  = errorUtil.createError("inactive.distribuidora",151);
            return done(userError, null);
          }
          return done(null, user);
        } else {
          return done(null, null);
        }
      })
    } else if (payload.role == "admin") {
     
      var queryAdmin = {
        attributes: ['Codigo', 'Login', 'Senha'],
        where: {
          Codigo: payload.id
        }
      }
      models.usuario.get(queryAdmin, function (user, error) {
        console.log(error);
        if (error) {
          return done(error, null);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, null);
        }
      })
    } else if (payload.role == "gerente") {
        var queryDistribuidora = {
            attributes: ['ID', 'role', 'senha'],
            where: {
                ID: payload.id
            }
        }
        models.gerente.get(queryDistribuidora, function (user, error) {
            if (error) {
                return done(error, null);
            }
            if (user) {
                if(user.ativo == false){
                    var userError  = errorUtil.createError("inactive.gerente",151);
                    return done(userError, null);
                }
                return done(null, user);
            } else {
                return done(null, null);
            }
        })
    } else {
      return done(error, null);
    }
  }));
};
