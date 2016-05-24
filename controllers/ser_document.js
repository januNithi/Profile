module.exports = function (con) {

  // var techDocument = require('../model/document');

  // var myErr = null;

  this.insertDoc = function (data, cb) {
    // var myDocument = new techDocument(data)
    var myErr = null;
    var insertId = null;
    var qry = 'INSERT INTO TBL_DOCUMENTS SET ? ';
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

  this.getAllDoc = function (ser, cb) {
    var myErr = null;
    var data = null;
    var qry = "SELECT A.*,B.*,COALESCE(FLOOR(AVG(C.STARS)),0) as star FROM TBL_DOCUMENTS A LEFT OUTER join TBL_DEPARTMENT B on (A.DOC_DEP=B.DEP_ID) LEFT OUTER JOIN  TBL_DOC_STARS C  on  A.ID=C.DOC_ID WHERE A.DOC_CAPTION LIKE '" + ser + "%' GROUP BY A.id";

    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;

        cb(myErr, data);
      }
    });
  };

  this.updateDoc = function (id, uData, cb) {
    var myErr = null;
    var data = null;
    var qry = 'UPDATE TBL_DOCUMENTS SET ? WHERE ID=' + id;
    con.query(qry, uData, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.deleteDoc = function (id, cb) {
    var myErr = null;
    var data = null;
    // console.log(id)
    var objectConstructor = {}.constructor;
    if (id.constructor !== objectConstructor) {
      cb('not an object', data);
      return;
    }
    var qry = 'DELETE  FROM TBL_DOCUMENTS WHERE ?';
    con.query(qry, id, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.getDocById = function (id, cb) {
    var myErr = null;
    var data = null;
    // var content = []
    var qry = 'SELECT  * FROM TBL_DOCUMENTS WHERE ID=' + id;
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.getDocByDep = function (ser, depId, cb) {
    var myErr = null;
    var data = null;
    var qry = 'SELECT A.*,B.*,COALESCE(FLOOR(AVG(C.STARS)),0) as star FROM TBL_DOCUMENTS A LEFT OUTER join TBL_DEPARTMENT B on (A.DOC_DEP=B.DEP_ID) LEFT OUTER JOIN  TBL_DOC_STARS C  on  A.ID=C.DOC_ID WHERE A.DOC_DEP=' + depId + " AND A.DOC_CAPTION LIKE '" + ser + "%' GROUP BY C.doc_id,A.ID";
    con.query(qry, depId, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.getDocByType = function (ser, typeId, cb) {
    var myErr = null;
    var data = null;
    var qry = 'SELECT A.*,B.*,COALESCE(FLOOR(AVG(C.STARS)),0) as star FROM TBL_DOCUMENTS A LEFT OUTER join TBL_DEPARTMENT B on (A.DOC_DEP=B.DEP_ID) LEFT OUTER JOIN  TBL_DOC_STARS C  on  A.ID=C.DOC_ID WHERE A.DOC_TYPE=' + typeId + " AND A.DOC_CAPTION LIKE '" + ser + "%' GROUP BY C.doc_id,A.ID";
    con.query(qry, typeId, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.getDocByType_Dep = function (ser, typeId, depId, cb) {
    var myErr = null;
    var data = null;
    var qry = 'SELECT A.*,B.*,COALESCE(FLOOR(AVG(C.STARS)),0) as star FROM TBL_DOCUMENTS A LEFT OUTER join TBL_DEPARTMENT B on (A.DOC_DEP=B.DEP_ID) LEFT OUTER JOIN  TBL_DOC_STARS C  on  A.ID=C.DOC_ID WHERE A.DOC_TYPE=' + typeId + ' AND A.DOC_DEP=' + depId + " AND A.DOC_CAPTION LIKE '" + ser + "%' GROUP BY C.doc_id,A.ID";
    con.query(qry, typeId, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, data);
      } else {
        data = res;
        cb(myErr, data);
      }
    });
  };

  this.incrViews = function (id, cb) {
    // var myErr = null
    var qry = 'UPDATE TBL_DOCUMENTS SET DOC_NO_VIEWS = DOC_NO_VIEWS + 1 WHERE id =' + id;
    con.query(qry, function (err, res) {
      cb(err, JSON.stringify(res));
    });
  };

  this.incrDown = function (id, cb) {
    // var myErr = null
    var qry = 'UPDATE TBL_DOCUMENTS SET DOC_NO_DOWN = DOC_NO_DOWN + 1 WHERE id =' + id;
    con.query(qry, function (err, res) {
      cb(err, JSON.stringify(res));
    });
  };

  this.getLatestDoc = function (depId, cb) {
    var myErr = null;
    var result = null;
    var qry = 'select * from tbl_documents where doc_dep=' + depId + ' ORDER BY ID  DESC LIMIT 5';
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getLatestVid = function (id, cb) {
    var myErr = null;
    var result = null;
    var qry = 'select * from tbl_documents where doc_type=' + id + ' ORDER BY ID  DESC LIMIT 2';
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getLatestImg = function (id, cb) {
    var myErr = null;
    var result = null;
    var qry = 'select a.*,b.*,substring_index(a.doc_file,".",-1) as type from tbl_documents a inner join tbl_department b on a.doc_dep=b.dep_id where doc_type=' + id + ' ORDER BY ID  DESC LIMIT 4';
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getLatestArchives = function (id, cb) {
    var myErr = null;
    var result = null;
    var qry = 'select a.*,b.*,substring_index(a.doc_file,".",-1) as type from tbl_documents a inner join tbl_department b on a.doc_dep=b.dep_id where doc_type=' + id + ' ORDER BY ID  DESC LIMIT 4';
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getNextDocument = function (id, cb) {
    var myErr = null;
    var result = null;

    var qry = 'select * from TBL_DOCUMENTS where id = (select min(id) from TBL_DOCUMENTS where id > ' + id + ' )';
    // con.query(qry, function (err, res) {})
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getPrevDocument = function (id, cb) {
    var myErr = null;
    var result = null;

    var qry = 'select * from TBL_DOCUMENTS where id = (select max(id) from TBL_DOCUMENTS where id < ' + id + ' )';
    // con.query(qry, function (err, res) {})
    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        cb(myErr, result);
      }
    });
  };

  this.getDocByKey = function (key, cb) {
    var myErr = null;
    var result = null;

    var qry = "Select * from tbl_documents where DOC_KEY LIKE '%" + key + "%'";

    console.log(qry);

    con.query(qry, function (err, res) {
      if (err) {
        myErr = err;
        cb(myErr, result);
      } else {
        result = res;
        console.log(result);
        cb(myErr, result);
      }
    });
  };
};
