
/*Created by Neneds*/

var nconf = require('nconf');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = path.join(__dirname, 'config.json');
nconf.argv().env();
nconf.file({ file: config });

var api_key = "pubkey-8cab1585bfbf9953f9fef29f1b433620";
var domain = "sandbox195a5028efce4e57898e9e35317a2164.mailgun.org";
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

//Email para que o usuário avalie o pedido
var sendUserRatingEmail = function(name, email,pedidoData, callback){
    var data = getUserRatingEmailBody(name,email,pedidoData);
    mailgun.messages().send(data, function (error, body) {
        if (error) {
          return callback(false,error);
        }
        return callback(true,null);
      })
}

//Email para confirmar cadastro
var sendConfirmationEmail = function(token, email, host, route,user, callback){
    var data = getConfirmationEmailBody(email,host,route,user,token);
    mailgun.messages().send(data, function (error, body) {
        if (error) {
          return callback(false,error);
        }
        return callback(true,null);
      })
}


//Email para resetar a senha
var sendResetPassEmail = function(token, email, host, route, callback){
	
	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
		user: 'bilintecnologia@gmail.com',
		pass: 'Bilin123'
	  }
	});

	transporter.sendMail(getResetEmailBody(email,host,route,token), function(error, info){
	  if (error) {
		return callback(false,error);
	  } else {
		return callback(true,null);
	  }
	});
	
    /*
	var data = getResetEmailBody(email,host,route,token);
	mailgun.messages().send(data, function (error, body) {
        if (error) {
          return callback(false,error);
        }
        return callback(true,null);
      });
    */
}

//Email quando a senha foi resetada com sucesso
var sendResetSucessEmail = function(email, host,user,callback){
    var data = getResetSucessEmailBody(email,host,user);
    mailgun.messages().send(data, function (error, body) {
        if (error) {
          return callback(false,error);
        }
        return callback(true,null);
      })
}

//Email quando a conta do entregador foi ativada
var sendEntregadorActivatedSucessEmail = function(email,user,callback){
    var data = getActivatedEntregadorBody(email,user);
    mailgun.messages().send(data, function (error, body) {
        if (error) {
          return callback(false,error);
        }
        return callback(true,null);
      })
}

function getResetEmailBody(email,host,route,token) {
    var data = {
        from: 'Bilin App <bilin@bilin.com>',
        to: email,
        subject: 'App Bilin recadastramento de senha',
        text: 'Você está recebendo esse e-mail pois você (ou alguma outra pessoa), requisitou o recadastramento da senha da sua conta no Bilin.\n\n' +
        'Por favor clique no link abaixo, ele é válido por uma hora:\n\n' +
        'http://' + host + '/'+ route +'/reset/' + token + '\n\n' +
        'Se você não solicitou o recadastramento, por favor ignore esse e-mail. Nada será alterado na sua conta.\n'
    };
	console.log(data);
    return data;
}

function getResetSucessEmailBody(email,host,user) {
    var data = {
        from: 'Bilin App <dyvene.cloud@gmail.com>',
        to: email,
        subject: 'App Bilin Senha Alterada',
        text: user + '\nVocê está recebendo esse e-mail pois a senha da sua conta no Bilin, foi alterada com sucesso.\n\n' +
        'Você pode realizar o login pelo aplicativo.\n'
    };
    return data;
}

function getConfirmationEmailBody(email,host,route,user,token) {
    var data = {
        from: 'Bilin App <dyvene.cloud@gmail.com>',
        to: email,
        subject: 'App Bilin Confirmação de Cadastro',
        text: user + '\nVocê está recebendo esse e-mail pois você (ou alguma outra pessoa), criou um conta no Bilin.\n\n' +
        'Por favor clique no link abaixo para confirmar o cadastro, ele é válido por 24 Horas:\n\n' +
        'http://' + host + '/'+ route + token + '\n\n' +
        'Se você não se cadastrou, por favor ignore esse e-mail.\n'
    };
    return data;
}

function getActivatedEntregadorBody(email,user) {
    var data = {
        from: 'Bilin App <dyvene.cloud@gmail.com>',
        to: email,
        subject: 'App Bilin Aprovaçāo da conta',
        text: user + '\nVocê está recebendo esse e-mail pois você (ou alguma outra pessoa), criou um conta como entregador no Bilin.\n\n' +
        'Os seus dados foram confirmados .Você já pode realizar login pelo app\n\n'
    };
    return data;
}


function getUserRatingEmailBody(name,email,pedidoData) {
    var data = {
        from: 'Bilin App <dyvene.cloud@gmail.com>',
        to: email,
        subject: 'App Bilin Avalie o Pedido',
        text: name + '\nPor favor avalie o pedido feito no App Bilin\n\n'
    };
    return data;
}


module.exports = {
    sendResetPassEmail : sendResetPassEmail,
    sendResetSucessEmail : sendResetSucessEmail,
    sendConfirmationEmail : sendConfirmationEmail,
    sendEntregadorActivatedSucessEmail : sendEntregadorActivatedSucessEmail,
    sendUserRatingEmail  : sendUserRatingEmail 
}
