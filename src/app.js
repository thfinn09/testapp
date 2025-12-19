const express = require('express');
const session = require('express-session');
const path = require('path');
const hbs = require('hbs');

const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');

const app = express();

// body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// static
app.use(express.static(path.join(__dirname, 'public')));

// user global
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});



// routes
app.use(authRoutes);
app.use('/notes', noteRoutes);

app.get('/', (req, res) => {
  res.redirect('/notes');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

