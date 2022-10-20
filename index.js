const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Celebrity = require('./models/celebrity');
const Movie = require('./models/movie');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.render('home');
});

app.get('/celebrities/create', (req, res, next) => {
  res.render('celebrities/new-celebrity');
});

app.post('/celebrities/create', (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  Celebrity.create({ name, occupation, catchPhrase })
    .then((celebrity) => {
      res.redirect('/celebrities');
    })
    .catch((error) => {
      res.render('celebrities/new-celebrity');
    });
});

app.get('/celebrities', (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      res.render('celebrities/celebrities', { celebrities });
    })
    .catch((error) => {
      next(error);
    });
});

// Add route handlers for get and post to /movies/create

app.get('/movies/create', (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      res.render('movies/new-movie', { celebrities });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/movies/create', (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })
    .then((movie) => {
      res.redirect('/movies');
    })
    .catch((error) => {
      res.render('movies/new-movie');
    });
});

app.get('/movies', (req, res, next) => {
  Movie.find()
    .populate('cast')
    .then((movies) => {
      res.render('movies/movies', { movies });
    })
    .catch((error) => {
      next(error);
    });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.render('error');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.log('There was an error connecting to the database');
    console.log(error);
  });
