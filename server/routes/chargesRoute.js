const chargesRoute = {};

/**
 * @method handleGet
 * Render the index page
 */
chargesRoute.handleGet = function (req, res, next) {
  res.render('index', { title: 'Express' });
};

module.exports = chargesRoute;
