/**
 * Created by greg on 2015.10.11..
 */

var q = require('q');
var connectionManager = require('./connectionManager');

function getUserValidity (userid, password) {
  var deferred = q.defer();
  connectionManager.getConnection()
    .then(function (connection) {
      connection.query("SELECT id FROM personaldata where userid = '" + userid + "' and password = '" + password + "' and status = 'active'", function (error, results) {
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

module.exports = {
  getUserValidity: getUserValidity
};
