const stripe = require('stripe')('YourAPIKey');
const chargesController = {};

/**
 * @method handlePost
 * This method recieves a request with an amount and stripe token from the
 * client. We then create a Stripe Charge using the token, for the given amount.
 */
chargesController.handlePost = function (req, res, next) {
  // Point the app at Testing Pays' Stripe charge Sim
  stripe.setHost('api.testingpays.com', 443, 'https');
  stripe._setApiField('basePath', '/stripe/v1/');
  stripe._prepResources();

  /**
   * NOTE: Stripe and most other payment processors only accept amounts as a
   * cent value. Below we multiply the amount by 100 and round the value.
   *
   * This approach is simple though perhaps slightly naieve. In a real
   * application you may want to find a more robust method of carrying out the
   * operation.
   */

  stripe.charges.create({
    amount: Math.round(parseFloat(req.body.amount) * 100),
    currency: 'eur',
    source: req.body.stripeToken,
    description: 'Charge for testing.pays@example.com'
  }, function (err, charge) {
    if (err) {
      return res.send(err);
    } else {
      return res.send(charge);
    }
  });
};

export default chargesController;
