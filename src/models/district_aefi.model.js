'use strict';
var dbConn = require('../../config/db.config');

//DistrictAefi object create
var DistrictAefi = function (district_dose) {
    this.date = district_dose.date;
    this.district_id = district_dose.district_id;
    this.district_name = district_dose.district_name;
    this.aefi = district_dose.aefi;
    this.created_at = district_dose.created_at ? district_dose.created_at : new Date();
};
DistrictAefi.create = function (newEmp, result) {
    dbConn.query("INSERT INTO district_aefi set ?", newEmp, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

DistrictAefi.createOrUpdate = function (newEmp, result) {
    dbConn.query("INSERT INTO district_aefi set ? ON DUPLICATE KEY UPDATE aefi=VALUES(aefi)", newEmp, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

DistrictAefi.findById = function (id, result) {
    dbConn.query("Select * from district_aefi where id = ? ", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
DistrictAefi.findAll = function (result) {
    dbConn.query("Select * from district_aefi", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('district_aefi : ', res);
            result(null, res);
        }
    });
};

DistrictAefi.findAllByDate = function (rdate, result) {
    dbConn.query("Select * from district_aefi where date = ?", rdate, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('district_aefi : ', res);
            result(null, res);
        }
    });
};

DistrictAefi.update = function (id, district_dose, result) {
    dbConn.query("UPDATE district_aefi SET date=?,district_id=?,district_name=?,aefi=? WHERE id = ?", [district_dose.date, district_dose.district_id, district_dose.district_name, district_dose.aefi, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
DistrictAefi.delete = function (id, result) {
    dbConn.query("DELETE FROM district_aefi WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
module.exports = DistrictAefi;