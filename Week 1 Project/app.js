const express = require('express'),
engines = require('consolidate'),
bodyParser = require('body-parser'),
db = require('./db/dbClient'),
app = express();



db.getConnection().then(conn => {
    console.log("Successfully connected to MongoDB.");

    setupMiddleware();
    startServer();

    app.get('/', (req, res, next) => {
        res.render('add_movie', {});
    });

    app.post('/add_movie', (req,res,next) => {
        let title = req.body.title;
        let year = req.body.year;
        let imdb = req.body.imdb;
    
        if ((title == '') || (year == '') || (imdb == '')) {
            next('Please provide an entry for all fields.');
        } else {
            let movie = {'Title': title, 'Year': year, 'Imdb': imdb};

            conn.collection('movies').insertOne(movie, (err, r) => {
                res.send(`Document inserted with _id: ${r.insertedId}`)
            });
        }
    })
})
.catch(err => {
    throw err;
});

function setupMiddleware() {
    app.engine('html', engines.nunjucks);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(errorHandler);
}

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.log(err.message);
    console.log(err.stack);
    res.status(500).render('error_template', { error: err });
}

function startServer() {
    app.listen(3000, () => {
        console.log('Express server listening on port 3000.');
    });
}
