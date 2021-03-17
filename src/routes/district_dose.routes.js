const express = require('express')
const router = express.Router()
const districtDoseController = require('../controllers/district_dose.controller');
// Retrieve all employees
router.get('/live/district/:id', districtDoseController.onlineScrap);
router.get('/date/:date', districtDoseController.dateWiseData);
router.get('/district_names', districtDoseController.districtNames);
router.get('/', districtDoseController.findAll);
// Create a new employee
router.post('/', districtDoseController.create);
// Retrieve a single employee with id
router.get('/:id', districtDoseController.findById);
// Update a employee with id
router.put('/:id', districtDoseController.update);
// Delete a employee with id
router.delete('/:id', districtDoseController.delete);
module.exports = router