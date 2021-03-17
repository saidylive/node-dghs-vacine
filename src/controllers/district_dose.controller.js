'use strict';
const DistrictDose = require('../models/district_dose.model');
const scrapper = require('../helpers/dghs_vacine_scrapper');

exports.onlineScrap = async function (req, res) {
    const dist_id = req.params.id
    let data = await scrapper.scrap_district_page(dist_id)
    res.json(data);
};

exports.dateWiseData = function (req, res) {
    const rdate = req.params.date
    // res.send(rdate)
    DistrictDose.findAllByDate(rdate, function (err, district_dose) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', district_dose);
        res.send(district_dose);
    });
};

exports.districtNames = function (req, res) {
    res.json(scrapper.districts);
    
    // DistrictDose.districtNameAll(function (err, items) {
    //     console.log('controller')
    //     if (err)
    //         res.send(err);
    //     let mapping = {}
    //     for (const item of items) {
    //         mapping[item.district_id] = item.district_name 
    //     }
    //     res.json(mapping);
    // });
};

exports.findAll = function (req, res) {
    DistrictDose.findAll(function (err, district_dose) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', district_dose);
        res.send(district_dose);
    });
};
exports.create = function (req, res) {
    const new_district_dose = new DistrictDose(req.body);
    //handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        DistrictDose.create(new_district_dose, function (err, district_dose) {
            if (err)
                res.send(err);
            res.json({ error: false, message: "DistrictDose added successfully!", data: district_dose });
        });
    }
};
exports.findById = function (req, res) {
    DistrictDose.findById(req.params.id, function (err, district_dose) {
        if (err)
            res.send(err);
        res.json(district_dose);
    });
};
exports.update = function (req, res) {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).send({ error: true, message: 'Please provide all required field' });
    } else {
        DistrictDose.update(req.params.id, new DistrictDose(req.body), function (err, district_dose) {
            if (err)
                res.send(err);
            res.json({ error: false, message: 'DistrictDose successfully updated' });
        });
    }
};
exports.delete = function (req, res) {
    DistrictDose.delete(req.params.id, function (err, district_dose) {
        if (err)
            res.send(err);
        res.json({ error: false, message: 'DistrictDose successfully deleted' });
    });
};