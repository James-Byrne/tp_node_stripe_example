import express from 'express';
import partials from 'express-partials';
import path from 'path';
import bodyParser from 'body-parser';

// import the charges controller
// this will be used to handle stripe requests
import chargesController from './controllers/chargesController';

// import the donations route
// this will serve as our index route
import donationsRoute from './routes/donationsRoute';

const app = express();

// Set the CORS headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Setup the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure the node sass middleware
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

// Include the static assets (images, js, stlesheets)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 * / -> index route for displaying content
 * /charges -> controller for handling posts to stripe
 */

// Render the index page to the user
app.get('/', donationsRoute.handleGet);
// Expose the charges controller
app.post('/charges', chargesController.handlePost);

// Catch 404 and re-direct to the index page
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const port = 3001;

app.listen(port, () => console.log(`Running on port ${port}`));

module.exports = app;
