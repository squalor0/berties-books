// Create a new router
const express = require("express")
const router = express.Router()

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect('/users/login') // redirect to the login page
    } else { 
        next()
    } 
}

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    let keyword = req.sanitize(req.query.keyword);

    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

    let searchValue = '%' + keyword + '%';

    db.query(sqlquery, [searchValue], (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('search-result.ejs', {
                searchTerm: keyword,
                searchResults: result
            });
        }
    });
});


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render("list.ejs", {availableBooks: result});
        }
     });
});

router.get('/add', redirectLogin, function (req, res, next) {
    res.render('addbook.ejs');
});

router.get('/bargainbooks', function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', { bargainBooks: result });
        }
    });
});


router.post('/add', redirectLogin,
    [
        check('name').notEmpty(),
        check('price').isFloat({ min: 0 })
    ],
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addbook.ejs');
        }

        const name = req.sanitize(req.body.name);
        const price = req.body.price;



        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
        // execute sql query
        let newrecord = [name, price];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.send(
                    'This book is added to database, name: ' +
                    name +
                    ' price ' +
                    price
                );
            }
        });
    }
);

// Export the router object so index.js can access it
module.exports = router
