module.exports = function (con) {
  this.getStarInfo = function (id, cb) {
    var myErr = null;
    var result = null;
    con.query('select a.*,b.fname,b.lname from tbl_doc_stars a LEFT OUTER JOIN personaldata b ON a.USER_ID=b.id where a.doc_id=' + id + ' ORDER BY a.ID', function (err, rows) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = rows;
        cb(myErr, result);
      }
    });
  };

  this.setStar = function (data, cb) {
    var myErr = null;
    var insertId = null;
    var qry = 'INSERT INTO TBL_DOC_STARS SET ?';

    console.log(data);
    var objectConstructor = {}.constructor;
    if (data.constructor !== objectConstructor) {
      cb('not an object', insertId);
      return;
    }
    con.query(qry, data, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, insertId);
      } else {
        insertId = res.insertId;
        cb(myErr, res.insertId);
      }
    });
  };

  this.getStar = function (id, cb) {
    var myErr = null;
    var stardata = null;
    var qry = 'SELECT FLOOR(AVG(STARS)) AS STR FROM TBL_DOC_STARS WHERE DOC_ID=' + id;
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, stardata);
      } else {
        stardata = res;
        cb(myErr, stardata);
      }
    });
  };
};
