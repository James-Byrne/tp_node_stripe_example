import config from '../config/config';
const stripe = require('stripe')(config.stripeKey);
const stripeHandlerModule = {};

// Point the app at Testing Pays' Stripe Charge sim
stripe.setHost('api.testingpays.com', 443, 'https');
stripe._setApiField('basePath', '/stripe/v1/');
stripe._prepResources();

/**
 * Attempts to charge the user a given amount against a given source (usually a card)
 * @method createCharge
 * @param  float      amount      An amount to charge the user
 * @param  string     source      The source (generally a card) to charge
 * @return object     return      Returns the result of the stripe charge
 *
 * NOTE: Stripe and most other payment processors only accept amounts as a
 * cent value. Below we multiply the amount by 100 and round the value.
 *
 * This approach is simple though perhaps slightly naieve. In a real
 * application you may want to find a more robust method of carrying out the
 * operation.
 */
stripeHandlerModule.createCharge = function (amount, source) {
  return stripe.charges.create({
    amount: Math.round(parseFloat(amount) * 100),
    currency: 'usd',
    source: source,
    description: 'Charge for testing.pays@example.com'
  }).then(
    (res) => {
      return res;
    },
    (err) => {
      return this._stripeHandler(err);
    }
  );
};

/**
 * Finds the type of error being returned
 * @method _stripeHandler
 * @param  object      err      The error returned from the stripe charge
 * @return object      {}       Returns an object with an error message
 */
stripeHandlerModule._stripeHandler = function (err) {
  switch (err.type) {
    case ('RateLimitError'):            // Too many requests hit the API too quickly
    case ('StripeAPIError'):            // Generic stripe error
    case ('StripeCardError'):           // Most common error, occurs when card cannot be charged
    case ('StripeConnectionError'):     // Failed to connect to stripes api
    case ('StripeInvalidRequestError'): // The request has invalid params
    case ('StripeAuthenticationError'): // Failed to authenticate with stripes api
      if (err.raw) {
        return { error: err.raw };
      } else {
        return { error: err.message };
      }

    default:
      // Handle any other types of unexpected errors
      return { error: { type: 'err_not_stripe' } };
  }
};

export default stripeHandlerModule;
