'use strict';
const DistrictAefi = require('../models/district_aefi.model');
const scrapper = require('../helpers/dghs_vacine_scrapper');

exports.onlineScrap = async function (req, res) {
    const dist_id = req.params.id
    let data = await scrapper.scrap_district_page(dist_id)
    res.json(data);
};

exports.dateWiseData = function (req, res) {
    const rdate = req.params.date
    // res.send(rdate)
    DistrictAefi.findAllByDate(rdate, function (err, district_dose) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', district_dose);
        res.send(district_dose);
    });
};

exports.findAll = function (req, res) {
    DistrictAefi.findAll(function (err, district_dose) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', district_dose);
        res.send(district_dose);
    });
};
exports.create = function (req, res) {
    const new_district_dose = new DistrictAefi(req.body);
    //handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        DistrictAefi.create(new_district_dose, function (err, district_dose) {
            if (err)
                res.send(err);
            res.json({ error: false, message: "DistrictAefi added successfully!", data: district_dose });
        });
    }
};
exports.findById = function (req, res) {
    DistrictAefi.findById(req.params.id, function (err, district_dose) {
        if (err)
            res.send(err);
        res.json(district_dose);
    });
};
exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        DistrictAefi.update(req.params.id, new DistrictAefi(req.body), function (err, district_dose) {
            if (err)
                res.send(err);
            res.json({ error: false, message: 'DistrictAefi successfully updated' });
        });
    }
};
exports.delete = function (req, res) {
    DistrictAefi.delete(req.params.id, function (err, district_dose) {
        if (err)
            res.send(err);
        res.json({ error: false, message: 'DistrictAefi successfully deleted' });
    });
};