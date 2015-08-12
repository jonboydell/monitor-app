var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'temperature'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {

    connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('index', { title: 'Hello World', results: result});
    });
});

router.post(/^(.*)$/, function(req, res, next) {
    console.log(req.body.temperature);
    res.render('index', { title: 'Hello World' });

    connection.query('INSERT INTO records SET ?', {temperature: req.body.temperature}, function(err, result) {
        if (err) throw err;
        console.log(result.insertId);
    });
});

module.exports = router;
