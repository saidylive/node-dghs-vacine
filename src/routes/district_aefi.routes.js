const express = require('express')
const router = express.Router()
const districtAefiController = require('../controllers/district_aefi.controller');
// Retrieve all employees
router.get('/date/:date', districtAefiController.dateWiseData);
router.get('/', districtAefiController.findAll);
// Create a new employee
router.post('/', districtAefiController.create);
// Retrieve a single employee with id
router.get('/:id', districtAefiController.findById);
// Update a employee with id
router.put('/:id', districtAefiController.update);
// Delete a employee with id
router.delete('/:id', districtAefiController.delete);
module.exports = router