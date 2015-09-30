var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.db.getConnection(function(err, connection) {
        connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc LIMIT 1', function(err, result) {
            connection.release();
            if (err) throw err;
            console.log(result);
            res.render('index', { title: 'Current Temperature', results: result});
        });
    });
});

router.get('/history', function(req, res, next) {
    req.db.getConnection(function(err, connection) {
        connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc', function(err, results) {
            connection.release();
            if (err) throw err;
            console.log(results);
            res.render('history', { title: 'Historic Temperatures', results: results});
            results = null;
        });
    });
});

router.get('/hour', function(req, res, next) {
    req.db.getConnection(function(err, connection) {
        connection.query('select max(temperature) as temperature, date_format(ts, "%Y-%m-%d %H") as ds from records group by ds ORDER BY ds desc', function(err, result) {
            connection.release();
            if (err) throw err;
            console.log(result);
            res.render('history', { title: 'Historic Temperatures', results: result});
        });
    });
});

router.get('/history.json', function(req, res, next) {
    req.db.getConnection(function(err, connection) {
        connection.query('SELECT date_format(ts, "%Y-%m-%d %k:%i:%s") as ts, temperature FROM records ORDER BY ts desc', function(err, result) {
            connection.release();
            if (err) throw err;
            console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
    });
});

router.post(/^(.*)$/, function(req, res, next) {
    req.db.getConnection(function(err, connection) {
        connection.query('INSERT INTO records SET ?', {temperature: req.body.temperature}, function(err, result) {
            connection.release();
            if (err) throw err;
            console.log(result.insertId);
        });
    });
});

module.exports = router;
