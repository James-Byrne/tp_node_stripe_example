import stripeHandlerModule from '../modules/stripeHandlerModule';
const chargesController = {};

/**
 * @method handlePost
 * This method recieves a request with an amount and stripe token from the
 * client. We then create a Stripe Charge using the token, for the given amount.
 */
chargesController.handlePost = function (req, res, next) {
  stripeHandlerModule.createCharge(req.body.amount, req.body.stripeToken)
  .then((result) => {
    if (result.error) {
      res.status(422).send(result.error);
    } else {
      res.status(200).send(result);
    }
  });
};

export default chargesController;
