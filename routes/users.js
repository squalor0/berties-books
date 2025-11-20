// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT username, firstName, lastName, email FROM users"; 

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("listusers.ejs", { users: result });
        }
    });
});

router.get('/audit', function (req, res, next) {
    let sqlquery = "SELECT username, success, time FROM audit ORDER BY time DESC";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('audit.ejs', { auditRecords: result });
        }
    });
});


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {

    let username = req.body.username;

    function logAudit(username, success) {
        let auditQuery = "INSERT INTO audit (username, success) VALUES (?, ?)";
        db.query(auditQuery, [username, success], (err, result) => {
            if (err) {
                console.error("Audit log error:", err);
            }
        });
    }


    // Select the hashed password for usr
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err);
        } else {
            if (result.length == 0) {
                // No username in database
                logAudit(username, 0);
                res.send("Login failed: incorrect username or password.");
            } else {
                let hashedPassword = result[0].hashedPassword;

                // Compare passwords
                bcrypt.compare(req.body.password, hashedPassword, function(err, compResult) {
                  if (err) {
                    // TODO: Handle error
                    logAudit(username, 0);
                    res.send("An error occurred during login.");
                  }
                  else if (compResult == true) {
                    // TODO: Send message
                    logAudit(username, 1);
                    res.send("Login successful! Welcome, " + username + ".");
                  }
                  else {
                    // TODO: Send message
                    logAudit(username, 0);
                    res.send("Login failed: incorrect username or password.");
                  }
                });
            }

        }
    });

});


router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        let sqlquery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";

        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword
        ];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
                result += ', your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            }
        });
    });                                                                            
}); 

// Export the router object so index.js can access it
module.exports = router
