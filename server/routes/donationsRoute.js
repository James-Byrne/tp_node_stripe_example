const donationsRoute = {};

/**
 * @method handleGet
 * Render the index page
 */
donationsRoute.handleGet = function (req, res, next) {
  res.render('index', { title: 'Express' });
};

module.exports = donationsRoute;
