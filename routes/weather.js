const express = require("express");
const router = express.Router();
const request = require("request");

router.get('/weather', (req, res) => {
    res.render('weather.ejs');
});

router.post('/weather', (req, res, next) => {
    let city = req.sanitize(req.body.city.trim());
    let apiKey = process.env.WEATHER_API_KEY;

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            let weather = JSON.parse(body);

            if (weather && weather.main) {
                let msg = `
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background: #eef2f7;
                                padding: 40px;
                            }

                            .box {
                                max-width: 450px;
                                margin: 0 auto;
                                padding: 25px;
                                background: white;
                                border-radius: 12px;
                                box-shadow: 0 0 12px rgba(0,0,0,0.15);
                                text-align: center;
                            }

                            h2 {
                                margin-top: 0;
                                color: #333;
                            }

                            .temp {
                                font-size: 2.2em;
                                margin: 10px 0;
                                color: #0077cc;
                            }

                            .detail {
                                font-size: 1.1em;
                                margin: 6px 0;
                                color: #444;
                            }

                            a {
                                display: inline-block;
                                margin-top: 20px;
                                text-decoration: none;
                                color: white;
                                background: #0077cc;
                                padding: 8px 15px;
                                border-radius: 5px;
                            }       
                            a:hover {
                                background: #005fa3;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="box">
                            <h2>Weather for ${weather.name}</h2>
                            <div class="temp">${weather.main.temp}°C</div>

                            <div class="detail">Feels like: ${weather.main.feels_like}°C</div>
                            <div class="detail">Humidity: ${weather.main.humidity}%</div>
                            <div class="detail">Wind speed: ${weather.wind.speed} m/s</div>
                            <div class="detail">Conditions: ${weather.weather[0].description}</div>

                            <a href="/weather">Search again</a>
                        </div>
                    </body>
                    </html>
                `;

                res.send(msg);
            } else {
                res.send("No data found — check your spelling or try another city.");
                console.log("API returned:", body);
            }
        }
    });
});

module.exports = router;