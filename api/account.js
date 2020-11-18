const { Router } = require("express");
const { use } = require("../middleware/error");
const authController = require("../controllers/authController");

const api = Router();

api.get('/users/signup', use(authController.create));
api.get('/users/signin', use(authController.signin));

module.exports = api;