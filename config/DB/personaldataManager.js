/**
 * Created by greg on 2015.10.11..
 */

var q = require('q');

var http = require('https');

var fs  = require('fs');

const fileType = require('file-type');

var connectionManager = require('./connectionManager');

function getUserDetails (userType) {
  var deffered = q.defer();
  connectionManager.getConnection()
    .then(function (connection) {
      connection.query("Select * from personaldata where status = 'active' and userType = '" + userType + "'",function (err, results) {
        if (err) {
          console.error(err);
          deffered.reject(err);
        }
        deffered.resolve(results);
      });
    });
  return deffered.promise;
}

function getPersonalData (id) {
  var deferred = q.defer();
  connectionManager.getConnection()
    .then(function (connection) {
      connection.query("SELECT * FROM personaldata where id =" + id + " and status = 'active'", function (error, results) {
        if (error) {
          console.error(error);
          deferred.reject(error);
        }
        deferred.resolve(results);
      });
    })
    .fail(function (err) {
      console.error(JSON.stringify(err));
      deferred.reject(err);
    });
  return deferred.promise;
}

function updatePersonalData(userData) {
  var deferred = q.defer();
  deletePersonalData(userData.id).then(function() {
    var currencyInsert = "Insert into personaldata(facebook_id,facebook_token,google_id,google_token,userid,password,";
    currencyInsert += "userType,fname,mname,lname,email,fb_fname,fb_mname,fb_lname,fb_email,";
    currencyInsert += "g_fname,g_mname,g_lname,g_email,contact,address,college,course,branch,year,project_fee,fees_paid,";
    currencyInsert += "fees_balance,createdDate,deletedDate,status,profile_pic,facebook_img,google_img)";
    currencyInsert += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),?,?,?,?,?)";
    console.log('Query template' + currencyInsert);
    connectionManager.getConnection()
      .then(function (connection) {
        var query = connectionManager.prepareQuery(currencyInsert, [userData.facebook_id,userData.facebook_token,
          userData.google_id, userData.google_token,userData.userid, userData.password,userData.userType,userData.fname,userData.mname,
          userData.lname,userData.email,userData.fb_fname,userData.fb_mname,userData.fb_lname,userData.fb_email,
          userData.g_fname,userData.g_mname,userData.g_lname,userData.g_email,userData.contact, userData.address, userData.college,userData.course,
          userData.branch, userData.year, userData.project_fee, userData.fees_paid, userData.fees_balance,
          userData.deletedDate, 'active', userData.profile_pic, userData.facebook_img, userData.google_img]);
        console.log('Query to execute:' + query);
        connection.query(query, function (error, result) {
          if (error) {
            console.error(error);
            deferred.reject(error);
          }
          getPersonalData(result.insertId).then(function(result){
            deferred.resolve(result);
          });
        });
      })
      .fail(function (err) {
        console.error(JSON.stringify(err));
        deferred.reject(err);
      });
    });
    return deferred.promise;
}

function deletePersonalData(id) {
  var deferred = q.defer();
  var currencyDelete = "Update personaldata set status = 'Move to trash',deletedDate = now() where id = ? and status = ?";
  connectionManager.getConnection()
    .then(function (connection) {
      var query = connectionManager.prepareQuery(currencyDelete, [id,'active']);
      console.log('Delete query:' + query);
      connection.query(query, function (error, result) {
        if (error) {
          console.error(error);
          deferred.reject(error);
        }
        deferred.resolve({affectedRows: result.affectedRows});
      })
    })
    .fail(function (err) {
      console.error(JSON.stringify(err));
      deferred.reject(err);
    })
  return deferred.promise;
}

function updateImage(data) {
  var deffered = q.defer();
  updatePersonalData(data).then(function (result) {
    deffered.resolve(result);
  })
  return deffered.promise;
}

function updateFacebookPersonalData(req,profile,accessToken) {
  var deferred = q.defer();
  var data = [];
  if(req && req.session && req.session.data){
    data = req.session.data;
    data.facebook_id = profile.id;
    data.facebook_token = accessToken;
    if(profile.name.givenName) {
      data.fb_fname = profile.name.givenName;
    }else if(profile.displayName) {
      data.fb_fname = profile.displayName;
    }
    if(profile.name.familyName) {
      data.fb_lname = profile.name.familyName;
    }
    if(profile.emails && profile.emails[0]) {
      data.fb_email = profile.emails[0].value;
    }
    updatePersonalData(data).then(function() {
      updateFacebookProfilePicture(profile).then(function(result) {
        deferred.resolve(result);
      });
    });
  }else {
    var fbDataUpdate = "select * from personaldata where facebook_id = ? and status = ?";
    connectionManager.getConnection()
      .then(function (connection) {
        var query = connectionManager.prepareQuery(fbDataUpdate, [profile.id,'active']);
          console.log('Select query:' + query);
          connection.query(query, function (error, result) {
            if (error) {
              console.error(error);
              deferred.reject(error);
            }
            if(result && result.length > 0) {
              data = result[0];
              data.facebook_id = profile.id;
              data.facebook_token = accessToken;
              if(profile.name.givenName){
                data.fb_fname = profile.name.givenName;
              }else if(profile.displayName){
                data.fb_fname = profile.displayName;
              }
              if(profile.name.familyName){
                data.fb_lname = profile.name.familyName;
              }
              if(profile.emails && profile.emails[0]){
                data.fb_email = profile.emails[0].value;
              }
              updatePersonalData(data).then(function() {
                updateFacebookProfilePicture(profile).then(function(result) {
                  deferred.resolve(result);
                });
              });
            }else{
              insertFacebookProfileData(profile,accessToken).then(function() {
                updateFacebookProfilePicture(profile).then(function(result) {
                  deferred.resolve(result);
                });
              });
            }
          });
      })
      .fail(function (err) {
        console.error(JSON.stringify(err));
        deferred.reject(err);
      })
    }
  return deferred.promise;
}

function updateFacebookProfilePicture(profile) {
  var deferred = q.defer();
  connectionManager.getConnection()
    .then(function (connection) {
      connection.query("SELECT * FROM personaldata where facebook_id =" + profile.id + " and status = 'active'", function (error, results) {
        if (error) {
          console.error(error);
          deferred.reject(error);
        }
        http.get(profile.photos[0].value, function (res) {
          var buffers = [];
          var length = 0;
          res.on("data", function(chunk) {
            // store each block of data
            length += chunk.length;
            buffers.push(chunk);
          })
          res.on("end", function() {
            // combine the binary data into single buffer
            var image = Buffer.concat(buffers);
            var filePath = 'public/images/uploadImages/file-' + profile.id + '.' + fileType(image).ext;
            fs.writeFile(filePath, image, function(err) {
              if(err) {
                console.log("Error---->" + err);
              }else {
                var data = results[0];
                data.facebook_img = "file-" + profile.id + '.' + fileType(image).ext;
                updateImage(data).then(function(result){
                  deferred.resolve(result);
                });
              }
            });
          });
        });
      });
    })
    .fail(function (err) {
      console.error(JSON.stringify(err));
      deferred.reject(err);
    });
  return deferred.promise;
}

function deleteFacebookProfileData(profile) {
  var deferred = q.defer();
  var qry = "Update personaldata set status = 'Move to trash',deletedDate = now() where facebook_id = ? and status = ?";
  connectionManager.getConnection()
    .then(function (connection) {
      var query = connectionManager.prepareQuery(qry, [profile.id,'active']);
      console.log('Delete query:' + query);
      connection.query(query, function (error, result) {
        if (error) {
          console.error(error);
          deferred.reject(error);
        }
        deferred.resolve({affectedRows: result.affectedRows});
      })
  })
  .fail(function (err) {
    console.error(JSON.stringify(err));
    deferred.reject(err);
  })
  return deferred.promise;
}

function insertFacebookProfileData(profile, accessToken) {
  var deferred = q.defer();
  var qry = "Insert into personaldata(facebook_id,facebook_token";
  if(profile.name.givenName){
    qry += ",fb_fname";
  }else if(profile.displayName){
    qry += ",fb_fname";
  }
  if(profile.name.familyName){
    qry += ",fb_lname";
  }
  if(profile.emails && profile.emails[0]){
    qry += ",fb_email";
  }
  qry += ",createdDate,status,userType) values (" + profile.id + ",'"+accessToken+"'";

    if(profile.name.givenName){
        qry += ",'"+profile.name.givenName+"'";
    }else if(profile.displayName){
        qry += ",'"+profile.displayName+"'";
    }

    if(profile.name.familyName){
        qry += ",'"+profile.name.familyName+"'";
    }

    if(profile.emails && profile.emails[0]) {
        qry += ",'" + profile.emails[0].value +"'";
    }

    qry += ",now(),'active','user')";

    connectionManager.getConnection()
        .then(function (connection) {
            console.log('Insert query:' + qry);
            connection.query(qry, function (error, result) {
                if (error) {
                    console.error(error);
                    deferred.reject(error);
                }
                deferred.resolve({affectedRows: result.affectedRows});
            });
        })
        .fail(function (err) {
            console.error(JSON.stringify(err));
            deferred.reject(err);
        });

        return deferred.promise;
}


function updateGooglePersonalData(req,profile,accessToken){


    var deferred = q.defer();

    var data = [];

    if(req && req.session && req.session.data){

        data = req.session.data;

        data.google_id = profile.id;
        data.google_token = accessToken;
        if(profile.name.givenName){
            data.g_fname = profile.name.givenName;
        }else if(profile.displayName){
            data.g_fname = profile.displayName;
        }

        if(profile.name.familyName){
            data.g_lname = profile.name.familyName;
        }

        if(profile.email){

            data.g_email = profile.email;
        }
    
        updatePersonalData(data).then(function(result){
            updateGoogleProfilePicture(profile).then(function(result){
                deferred.resolve(result);
            });
        });

    }else{

        var fbDataUpdate = "select * from personaldata where google_id = ? and status = ?";

        connectionManager.getConnection()
            .then(function (connection) {
                var query = connectionManager.prepareQuery(fbDataUpdate, [profile.id,'active']);
                console.log('Select query:' + query);
                connection.query(query, function (error, result) {
                    if (error) {
                        console.error(error);
                        deferred.reject(error);
                    }
                    if(result){

                        data = result[0];

                        data.google_id = profile.id;
                        data.google_token = accessToken;
                        if(profile.name.givenName){
                            data.g_fname = profile.name.givenName;
                        }else if(profile.displayName){
                            data.g_fname = profile.displayName;
                        }

                        if(profile.name.familyName){
                            data.g_lname = profile.name.familyName;
                        }

                        if(profile.email){

                            data.g_email = profile.email;
                        }
                    
                        updatePersonalData(data).then(function(result){
                            updateGoogleProfilePicture(profile).then(function(result){
                                deferred.resolve(result);
                            });
                        });

                    }else{

                        insertGoogleProfileData(profile,accessToken).then(function(){

                            updateGoogleProfilePicture(profile).then(function(results){
                                deferred.resolve(results);
                            });

                        });

                    }

                });

            })
            .fail(function (err) {
                console.error(JSON.stringify(err));
                deferred.reject(err);
            });


    }    
    return deferred.promise;
}

function updateGoogleProfilePicture(profile){

    var deferred = q.defer();

    connectionManager.getConnection()
        .then(function (connection) {
            connection.query("SELECT * FROM personaldata where google_id ="+profile.id+" and status = 'active'", function (error, results) {
                if (error) {
                    console.error(error);
                    deferred.reject(error);
                }

                http.get(profile.photos[0].value,function (res) {

                    var buffers = [];

                    var length = 0;

                    res.on("data", function(chunk) {

                      // store each block of data
                        length += chunk.length;

                        buffers.push(chunk);

                    });

                    res.on("end", function() {

                      // combine the binary data into single buffer
                        var image = Buffer.concat(buffers);

                        var filePath = 'public/images/uploadImages/file-'+profile.id+'.'+fileType(image).ext;

                        fs.writeFile(filePath,image,function(err){

                            if(err){
                                console.log("Error---->"+err);
                            }else{

                                var data = results[0];

                                data.google_img = "file-"+profile.id+'.'+fileType(image).ext;

                                updateImage(data).then(function(result){
                                    deferred.resolve(result);
                                });


                            }

                        });

                    });

                });
            });
        })
        .fail(function (err) {
            console.error(JSON.stringify(err));
            deferred.reject(err);
        });

    return deferred.promise;

}

function deleteGoogleProfileData(profile) {

    var deferred = q.defer();

    var qry = "Update personaldata set status = 'Move to trash',deletedDate = now() where google_id = ? and status = ?";

    connectionManager.getConnection()
        .then(function (connection) {
            var query = connectionManager.prepareQuery(qry, [profile.id,'active']);
            console.log('Delete query:' + query);
            connection.query(query, function (error, result) {
                if (error) {
                    console.error(error);
                    deferred.reject(error);
                }
                deferred.resolve({affectedRows: result.affectedRows});
            });
        })
        .fail(function (err) {
            console.error(JSON.stringify(err));
            deferred.reject(err);
        });

        return deferred.promise;

}

function insertGoogleProfileData(profile,accessToken){

    var deferred = q.defer();

    qry = "Insert into personaldata(google_id,google_token";

            if(profile.name.givenName){
                qry += ",g_fname";
            }else if(profile.displayName){
                qry += ",g_fname";
            }

            if(profile.name.familyName){
                qry += ",g_lname";
            }

            if(profile.email){

                qry += ",g_email";
            }

            qry += ",createdDate,status,userType) values ('"+profile.id+"','"+accessToken+"'";

            if(profile.name.givenName){
                qry += ",'"+profile.name.givenName+"'";
            }else if(profile.displayName){
                qry += ",'"+profile.displayName+"'";
            }

            if(profile.name.familyName){
                qry += ",'"+profile.name.familyName+"'";
            }

            if(profile.email) {
                qry += ",'" + profile.email +"'";
            }

            qry += ",now(),'active','user')";

    connectionManager.getConnection()
        .then(function (connection) {
            console.log('Insert query:' + qry);
            connection.query(qry, function (error, result) {
                if (error) {
                    console.error(error);
                    deferred.reject(error);
                }
                deferred.resolve({affectedRows: result.affectedRows});
            });
        })
        .fail(function (err) {
            console.error(JSON.stringify(err));
            deferred.reject(err);
        });

        return deferred.promise;
}


module.exports = {
    getPersonalData: getPersonalData,
    updatePersonalData: updatePersonalData,
    deletePersonalData: deletePersonalData,
    updateFacebookPersonalData : updateFacebookPersonalData,
    deleteFacebookProfileData : deleteFacebookProfileData,
    insertFacebookProfileData : insertFacebookProfileData,
    updateImage : updateImage,
    updateFacebookProfilePicture : updateFacebookProfilePicture,
    updateGooglePersonalData : updateGooglePersonalData,
    deleteGoogleProfileData : deleteGoogleProfileData,
    insertGoogleProfileData : insertGoogleProfileData,
    updateGoogleProfilePicture : updateGoogleProfilePicture,
    getUserDetails : getUserDetails
};