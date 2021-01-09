const express = require("express");
const router = express.Router();
const multer = require('multer');

var upload = multer({ dest: 'uploads/' });

router.route('/').get((req, res) => {
    res.send('Welcome to Chatapp!').status(200);
})

module.exports = router;