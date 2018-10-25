
/*Created by Neneds*/

var request = require('request');
var nconf = require('nconf');
var path = require("path");
var env = process.env.NODE_ENV || "development";
var config = path.join(__dirname, 'config.json');

//Setup do nconf
nconf.argv().env();
nconf.file({ file: config });

//curl -i -X GET \
 "https://graph.facebook.com/v2.8/me?fields=id%2Cname&access_token=EAACEdEose0cBAF08NZCW0htucIf3kNclMUgy3xq3hXtbmPNqQDFzgPZB1V8sXf2XBXhrTa6aGFoEVZBRSBieHcu9EGAasHdRo69fPSMvvGmsSSvBE4i0lphEYbja6rybNMm4qFNBhG8iAkRNvyYARLaMZBFqztwIWigwuT6RwAZDZD"

var apiBase = "https://graph.facebook.com/v2.7";

var getAccessToken = function (code, callback){
    
    var params = { 
        code:              code, 
        client_id:         nconf.get('facebookClientID'),
        client_secret:     nconf.get('facebookClientSecret'),
        redirect_uri:      nconf.get('facebookRedirectURI'),
    };

    request({url: apiBase + '/oauth/access_token', qs: params }, function (error, response, body) {
        if(!error){
            var json = JSON.parse(response.body)
            if(json.access_token){
                return callback(json, null);
            }else{
                //console.log(json)
                return callback(null, {success: false, error: "fb.login.failed", message: "fb.login.failed"})
            }
        }else{
            return callback(null, error);
        }
    });

}

var facebookMeRequest = function(oauthToken, callback){ 
    
    var params = { 
        fields:            "id,name,email,picture", 
        access_token:      oauthToken
    };

    request({url: apiBase + '/me', qs: params}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(response.body),null);
        }else{
            callback(null,error);
        }
    });
    
}

module.exports = {
    facebookMeRequest : facebookMeRequest,
    getAccessToken : getAccessToken
}
