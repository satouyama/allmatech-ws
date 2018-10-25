
/*Created by Neneds*/

var jsonFromError = function(error,title,code){
    var messageText = ''
    if(error.errors != null){
      messageText = error.errors[0].message;
    }else if(error.message != null){
       messageText = error.message
    }else{
      messageText = 'unknown.error'
    }
    return {"title" : title, "message" : messageText , "code" : code}
}


createError = function CustomError(name,message,code) {
  this.name = name;
  this.message = message;
  this.code = code;
  return {"title" : name, "message" : message , "code" : code}
};

module.exports = {
    jsonFromError : jsonFromError,
    createError : createError
}