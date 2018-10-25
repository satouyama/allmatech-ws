var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require("path");
var errorUtil = require('../utils/errorUtils');
var env = process.env.NODE_ENV || "development";
var parentPath = path.join(__dirname, '/..');
var uploadPath = env == "development" ? parentPath + "/uploads/" : process.env.OPENSHIFT_DATA_DIR;

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-west-2';

/**
 * Envia a imagem para o servidor S3 na amazon
 * Variáveis de ambiente de configuração da instância S3:
 * 		AWS_ACCESS_KEY_ID
 *		AWS_SECRET_ACCESS_KEY
 *		S3_BUCKET
 **/
uploadToS3 = function (req, res) {
	var result;
    var msg;
	var tmp_path = req.files[0].path;
	var target_path = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.files[0].originalname;
	var fileName = req.files[0].originalname;
	var fileType = 'image/jpeg';
	try{
		var src = fs.createReadStream(tmp_path);
		src.on('error', function(err) {
			console.log('finish error');
			result = false;
			msg = "0";
		});
		src.on('open', function () {
			var s3 = new aws.S3();
			s3.putObject({
				Bucket: S3_BUCKET,
				Key: fileName,
				Body: src,
				ContentType: fileType,
				ACL: 'public-read'
			}, function (err) {
				if (err) { 
					console.log('finish error');
					result = false;
					msg = "0";
				}
			});
		    fs.unlink(tmp_path, function(){});
			console.log('finish ok');
			result = true;
			msg = "1";
		});
		console.log('before loop');
		while(result === undefined){
			require('deasync').runLoopOnce();
		};
		console.log('after loop');
		return res.status(200).json({msg:msg,url:target_path});
	}catch(e){
		console.trace(e);
		return res
        .status(401)
        .json({msg:'error'});
	}
}

//Tratar upload de arquivo base64
handleBase64ImageUpload = function (req, res, pathUrl) {

    if (!req.body.fileString || !req.files == null || req.files.length == 0 || req.files[0].fieldname !== 'fileString' || !req.body.imageName ) {
        return res
            .status(400)
            .json({success: false, "message": "fileString.or.imagename.was.not.sent", "code": 63});
    }
    var dataString = String(req.body.fileString);
    //var ext = dataString.split(';')[0].match(/jpeg|png|gif/)[0];
    var data = dataString.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var newPath = uploadPath + req.body.imageName + '.jpg';// +'.'+ ext;
    var fileUrl = pathUrl + req.body.imageName + '.jpg';// +'.'+ ext;
	console.log('newPath: '+newPath);
	console.log('fileUrl: '+fileUrl);
    fs.writeFile(newPath, buf, function (error) {
        if (error) {
            return res
                .status(500)
                .json(errorUtil.jsonFromError(error, "entregador.image.upload.base64.error", 500));
        }
        return res
            .status(200)
            .json({success: true, "message": "image.uploaded", "code": 171, "url": fileUrl});
    });
}


//Tratar upload de arquivo
handleUpload = function (req, res, pathUrl) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
            return res
                .status(500)
                .json({success: false, "message": "image.upload.parse.error", "code": 170});
        }
        //ler o file
        fs
            .readFile(files.file.path, function (err, data) {
                //Ver dados do file
                fs
                    .stat(files.file.path, function (err, stats) {
                        // Ver o tamanho da imagem
                        var fileSizeBytes = stats["size"];
                        var fileSizeInMegabytes = fileSizeBytes / 1000000.0;
                        if (fileSizeInMegabytes > 2) {
                            return res
                                .status(400)
                                .json({success: false, "message": "image.upload.input.error.max.img.size", "code": 170});
                        }
                        //Se tudo certo, vamos armazenar a imagem
                        var imageName = files.file.name
                        var ext = path
                            .extname(imageName)
                            .substring(1);
                        if (ext != 'jpg') {
                            return res
                                .status(400)
                                .json({success: false, "message": "image.upload.input.error.invalid.extension", "code": 170});
                        }
                        if (!imageName) {
                            return res
                                .status(400)
                                .json({success: false, "message": "image.upload.input.error", "code": 170});
                        } else {
                            var newPath = uploadPath + imageName;
                            var fileUrl = pathUrl + imageName;
                            fs.writeFile(newPath, data, function (error) {
                                if (error) {
                                    return res
                                        .status(500)
                                        .json(errorUtil.jsonFromError(error, "entregador.image.upload.error", 500));
                                }
                                return res
                                    .status(200)
                                    .json({success: true, "message": "image.uploaded", "code": 171, "url": fileUrl});
                            });
                        }
                    })

            });
    });
}

getFile = function (req, res, filename) {
    var imgPath = uploadPath + filename;
    fs.readFile(imgPath, function (err, data) {
        if (err) {
            return res
                .status(500)
                .json({success: false, "message": "image.download.error", "code": 170});
        }
        if (data) {
            res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': Buffer.byteLength(data),
                'Accept-Ranges': "bytes"
            });
            res.end(data, 'binary');
        } else {
            res
                .status(404)
                .json({success: false, "message": "image.dont.exist", "code": 170})
        }

    });
}

module.exports = {
    handleUpload: handleUpload,
    handleBase64ImageUpload: handleBase64ImageUpload,
	uploadToS3: uploadToS3,
    getFile: getFile
}
