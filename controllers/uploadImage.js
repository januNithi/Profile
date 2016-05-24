
var express = require('express');

var router = express.Router();

var event = require('events');

var multer = require('multer');

// var mysql = require('mysql');

var personaldataManager = require('../config/DB/personaldataManager');

var EventEmitter = event.EventEmitter;

var emitter = new EventEmitter();

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads');
    },
    filename: function (req, file, cb) {
        // var datetimestamp = Date.now();
        console.log("req.body"+req.body.file);
        cb(null, file.fieldname + '-' + file.originalname);

		var data = {
			fileName : file.fieldname + '-' + file.originalname,
			id : req.session.data.id
		};

        emitter.emit('file-upload',data);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


router.post('/', function(req, res) {

	upload(req,res,function(err){
            if(err){
                 res.json({errorCode:1,errDesc:err});
                 return;
            }
             res.json({errorCode:0,errDesc:null});
        });

	 console.log("req--->"+req);	

});	


var fileUploaded = function(data){

	console.log("Within fileUploaded --->"+JSON.stringify(data));

    personaldataManager.getPersonalData(data.id).then(function(result){
        result[0].profile_pic = data.fileName;
        personaldataManager.updateImage(result[0]);
    });

};

emitter.on('file-upload',fileUploaded);



module.exports = router;