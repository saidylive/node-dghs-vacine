'use strict';
var dbConn = require('./../../config/db.config');

//DistrictDose object create
var DistrictDose = function (district_dose) {
    this.date = district_dose.date;
    this.district_id = district_dose.district_id;
    this.district_name = district_dose.district_name;
    this.male = district_dose.male;
    this.female = district_dose.female;
    this.total = district_dose.total;
    this.rate = district_dose.rate;
    this.created_at = district_dose.created_at ? district_dose.created_at : new Date();
};
DistrictDose.create = function (newEmp, result) {
    dbConn.query("INSERT INTO district_doses set ?", newEmp, function (err, res) {
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

DistrictDose.createOrUpdate = function (newEmp, result) {
    dbConn.query("INSERT INTO district_doses set ? ON DUPLICATE KEY UPDATE male=VALUES(male),female=VALUES(female),total=VALUES(total),rate=VALUES(rate)", newEmp, function (err, res) {
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

DistrictDose.findById = function (id, result) {
    dbConn.query("Select * from district_doses where id = ? ", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
DistrictDose.findAll = function (result) {
    dbConn.query("Select * from district_doses", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('district_doses : ', res);
            result(null, res);
        }
    });
};

DistrictDose.districtNameAll = function (result) {
    dbConn.query("Select distinct district_id, district_name from district_doses group by district_id", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('district_doses : ', res);
            result(null, res);
        }
    });
};

DistrictDose.findAllByDate = function (rdate, result) {
    dbConn.query("Select * from district_doses where date = ?", rdate, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('district_doses : ', res);
            result(null, res);
        }
    });
};

DistrictDose.update = function (id, district_dose, result) {
    dbConn.query("UPDATE district_doses SET date=?,district_id=?,district_name=?,male=?,female=?,total=?,rate=? WHERE id = ?", [district_dose.date, district_dose.district_id, district_dose.district_name, district_dose.male, district_dose.female, district_dose.total, district_dose.rate, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
DistrictDose.delete = function (id, result) {
    dbConn.query("DELETE FROM district_doses WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
module.exports = DistrictDose;