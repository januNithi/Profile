var express = require('./config/express');

var app = express();

// app.get('/multi_upload', function (req, res) {
//   if (req.session.user_mode == 'Admin')
//     res.sendFile(app.get('views') + 'upload_multiple.html');
//   else
//     res.redirect('/');
// })

// app.get('/adminDocumentation', function (req, res) {
//   res.sendfile('./public/views/layout.html');
// })

// app.get('/viewdocument', function (req, res) {
//   var id = req.query.id;
//   var type = req.query.type;

//   doc_service.incrViews(id, function (err) {
//     if (err) throw err;
//   })

//   res.json = {mode: req.session.user_mode}
//   res.sendFile(app.get('views') + 'view_document.html');
// })

// app.get('/nextDoc', function (req, res) {
//   var id = req.query.id;

//   doc_service.getNextDocument(id, function (err, data) {
//     console.log(data);
//     res.end(JSON.stringify(data));
//   })
// })

// app.get('/prevDoc', function (req, res) {
//   var id = req.query.id;

//   doc_service.getPrevDocument(id, function (err, data) {
//     console.log(data)
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/editdoc', function (req, res) {
//   res.sendFile(app.get('views') + 'upload_single.html')
// })

// app.post('/api/setStar', function (req, res) {
//   var send_Data = req.body
//   rate_service.setStar(send_Data, function (err, ins_id) {
//     if (err) throw err
//   // res.end(JSON.stringify(rows))
//   })
// })

// app.get('/api/getStar', function (req, res) {
//   var ID = req.query.DOC_ID
//   // console.log(req)

//   rate_service.getStar(ID, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/getLatestDoc', function (req, res) {
//   var id = req.query.id
//   doc_service.getLatestDoc(id, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/getRatingInfo', function (req, res) {
//   var id = req.query.id
//   rate_service.getStarInfo(id, function (err, rows) {
//     console.log(rows)
//     res.end(JSON.stringify(rows))
//   })
// })

// app.get('/getLatestVid', function (req, res) {
//   var id = req.query.id
//   doc_service.getLatestVid(id, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/getLatestImg', function (req, res) {
//   var id = req.query.id
//   doc_service.getLatestImg(id, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/getLatestArch', function (req, res) {
//   var id = req.query.id
//   doc_service.getLatestArchives(id, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// app.get('/documentList', function (req, res) {
//   res.sendfile('./public/views/layout.html')
// })

// app.post('/api/docs/delete', function (req, res) {
//   var data = req.body
//   console.log(data)
//   doc_service.deleteDoc(data, function () {
//     console.log('Deleted Record....' + data)
//     res.end()
//   })
// })

// app.get('/api/download', function (req, resp) {
//   console.log(req.body)
//   var id = req.query.id
//   console.log(id)
//   var ext = ''
//   var filename

//   doc_service.getDocById(id, function (err, data) {
//     filename = data[0].DOC_FILE
//     ext = filename.substring(filename.lastIndexOf('.') + 1)
//     doc_service.incrDown(id, function (err, res) {
//       if (err) throw err

//       fs.access(__dirname + 'public/uploads/' + id + '.' + ext, fs.F_OK, function (err) {
//         if (!err) {
//           resp.download(__dirname + 'public/uploads/' + id + '.' + ext)
//         } else {
//           resp.end('No file found')
//         }
//       })
//     })
//   })
// })

// app.post('/upload', function (req, res) {
//   var document = {}
//   var datetime = new Date()
//   var id = ''
//   console.log(req.path)

//   var formidable = require('formidable')
//   var form = new formidable.IncomingForm()
//   var util = require('util')

//   form.parse(req, function (err, fields, files) {
//     var ser_Document = require('./server/routes/ser_document')
//     var doc_service = new ser_Document(connection)

//     console.log(files.doc_file.name)
//     var ext = path.extname(files.doc_file.name)
//     document.doc_date = datetime
//     document.doc_caption = fields.doc_caption
//     document.doc_type = fields.doc_type
//     document.doc_dep = fields.doc_dep
//     document.doc_key = fields.doc_key
//     document.doc_desc = fields.doc_desc
//     document.doc_file = files.doc_file.name
//     var insert_id = null

//     if (fields.doc_id != '') {
//       doc_service.updateDoc(fields.doc_id, document, function (err, ins_id) {
//         insert_id = ins_id
//         fs.createReadStream(files.doc_file.path).pipe(fs.createWriteStream(__dirname + '/../public/uploads/' + files.doc_file.name))
//         fs.rename(__dirname + 'public/uploads/' + files.doc_file.name, __dirname + '/../public/uploads/' + insert_id + ext, function (err) {
//           if (err) throw err
//           console.log(err)
//         })
//       })
//     }
//     else
//       doc_service.insertDoc(document, function (err, ins_id) {
//         insert_id = ins_id
//         fs.createReadStream(files.doc_file.path).pipe(fs.createWriteStream(__dirname + '/../public/uploads/' + files.doc_file.name))
//         fs.rename(__dirname + 'public/uploads/' + files.doc_file.name, __dirname + '/../public/uploads/' + insert_id + ext, function (err) {
//           if (err) throw err
//           console.log(err)
//         })
//       })
//     res.redirect('/')
//   })
// })

// app.post('/uploadmulti', function (req, res) {
//   var document = {}
//   var datetime = new Date()
//   var id = ''
//   console.log(req.path)

//   var formidable = require('formidable')
//   // var form = new formidable.IncomingForm()
//   var util = require('util')
//   console.log(req.body)
//   var sync = false

//   var form = new formidable.IncomingForm(),
//     files = {},
//     fields = {}
//   form.on('field', function (field, value) {
//     fields[field] = value
//   })
//   form.on('file', function (field, file) {
//     console.log(file.name)
//     files[field] = file
//   })
//   form.on('end', function () {
//     console.log('done')
//     console.log(fields)
//     console.log(files)

//     console.log(Object.keys(files).length)
//     for (var i = 1;i <= Object.keys(files).length;i++) {
//       sync = false
//       var ext = path.extname(files['doc_file' + i].name)
//       console.log(fields['doc_caption' + i])
//       document.doc_date = datetime
//       document.doc_caption = fields['doc_caption' + i]
//       document.doc_type = fields['doc_type' + i]
//       document.doc_dep = fields['doc_dep' + i]
//       document.doc_key = fields['doc_key' + i]
//       document.doc_desc = fields['doc_desc' + i]
//       document.doc_file = files['doc_file' + i].name
//       var insert_id = null

//       console.log(document)

//       doc_service.insertDoc(document, function (err, ins_id) {
//         insert_id = ins_id
//         console.log('i: ' + i)
//         fs.createReadStream(files['doc_file' + i].path).pipe(fs.createWriteStream(__dirname + '/../public/uploads/' + files['doc_file' + i].name))
//         fs.rename(__dirname + 'public/uploads/' + files['doc_file' + i].name, __dirname + '/../public/uploads/' + insert_id + ext, function (err) {
//           if (err) throw err
//           console.log(err)

//           sync = true
//         })
//       })
//       while(!sync) {require('deasync').sleep(1000);}
//     }
//   })
//   form.parse(req)
//   res.redirect('/multi_upload')
// })

// app.get('/api/search', function (req, resp) {
//   var ser_Document = require('./public/routes/ser_document')
//   var doc_service = new ser_Document(connection)

//   var type = req.query.doc_type
//   var dep = req.query.dep
//   var ser_str = req.query.ser_str
//   var result
//   console.log(req.session.user_mode)
//   resp.writeHead(200, {'Content-Type': 'application/json'})

//   // resp.json({mode:req.session.user_mode})

//   // var page=req.query.page

//   console.log('type:' + type + 'dep=' + dep)

//   if (type == -1 && dep == -1) {
//     doc_service.getAllDoc(ser_str, function (err, data) {
//       result = data
//       console.log(data)
//       resp.end(JSON.stringify(result))
//     })
//   }
//   else if (type == -1)
//     doc_service.getDocByDep(ser_str, dep, function (err, data) {
//       result = data
//       resp.end(JSON.stringify(result))
//     })
//   else if (dep == -1)
//     doc_service.getDocByType(ser_str, type, function (err, data) {
//       result = data
//       resp.end(JSON.stringify(result))
//     })
//   else
//     doc_service.getDocByType_Dep(ser_str, type, dep, function (err, data) {
//       result = data
//       resp.end(JSON.stringify(result))
//     })
// })

// app.get('/search', function (req, resp) {
//   resp.sendFile(app.get('views') + 'search.html')
// })

// app.get('/api/docs/edit', function (req, resp) {
//   var id = req.query.id
//   doc_service.getDocById(id, function (err, data) {
//     if (err) throw err
//     resp.end(JSON.stringify(data))
//   })
// })

// app.get('/api/dep', function (req, resp) {
//   dep_service.getAllDep(function (err, data) {
//     if (err) throw err
//     resp.end(JSON.stringify(data))
//   })
// })

// app.get('/readzip', function (req, res) {
//   var id = req.query.id
//   console.log(id)
//   var data = unzip_file(id)
//   console.log('inside')
//   console.log(data)

//   res.end(JSON.stringify(data))
// })

// app.get('/getKeyMatchDocuments', function (req, res) {
//   var key = req.query.key
//   doc_service.getDocByKey(key, function (err, data) {
//     if (err) throw err
//     res.end(JSON.stringify(data))
//   })
// })

// var unzip_file = function (id) {
//   var sync = false
//   var files = []

//   doc_service.getDocById(id, function (err, data) {
//     filename = data[0].DOC_FILE
//     ext = filename.substring(filename.lastIndexOf('.') + 1)
//     var zip = new AdmZip(__dirname + 'public/uploads/' + id + '.' + ext)
//     var zipEntries = zip.getEntries()

//     zipEntries.forEach(function (zipEntry) {
//       // console.log(zipEntry.entryName)
//       files.push({file: zipEntry.entryName})
//       console.log(files)
//     })
//     sync = true
//   })
//   while(!sync) {
//     require('deasync').sleep(1000)
//     return files
//   }
// }

app.listen(3000, function () {
  console.log('App is listening to port 3000!!!');
})

module.exports = app;
