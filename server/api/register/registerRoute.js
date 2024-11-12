const express = require('express');
const registerRouter = express.Router();
const registerController = require('./registerController'); 

registerRouter.post('/', registerController.createRegister); 

module.exports = registerRouter;
