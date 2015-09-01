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

    connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc LIMIT 1', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('index', { title: 'Current Temperature', results: result});
    });
});

router.get('/history', function(req, res, next) {

    connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('history', { title: 'Historic Temperatures', results: result});
    });
});

router.get('/hour', function(req, res, next) {

    connection.query('select max(temperature) as temperature, date_format(ts, "%Y-%m-%d %H") as ds from records group by ds ORDER BY ds desc', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('history', { title: 'Historic Temperatures', results: result});
    });
});

router.get('/history.json', function(req, res, next) {

    connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc', function(err, result) {
        if (err) throw err;
        console.log(result);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
        //res.render('history', { title: 'Historic Temperatures', results: result});
    });
});

router.post(/^(.*)$/, function(req, res, next) {
    console.log(req.body.temperature);

    connection.query('INSERT INTO records SET ?', {temperature: req.body.temperature}, function(err, result) {
        if (err) throw err;
        console.log(result.insertId);
    });

    connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc LIMIT 1', function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render('index', { title: 'Current Temperature', results: result});
    });
});

module.exports = router;
