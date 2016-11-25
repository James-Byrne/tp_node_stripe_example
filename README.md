# Testing Pays
<img src="TestingPaysLogo.png" width="250" height="200" align="right">
> Demonstrating how Testing Pays API can be used to test Stripe's payment processor.

### Existing Projects
To integrate an existing project with TestingPays we recommend you follow the short guide on your [instructions page](https://admin.testingpays.com/teams_apis/stripe-v1-charges).

### Requirements
In order to run this application you will need to install [Node.js](https://nodejs.org/en/). We recommend you use the latest LTS release (long term suport).


##### Accounts
You will also require an account with both [Stripe](https://stripe.com/) and [TestingPays](http://www.testingpays.com/).


### Setup
Firstly pull down the repo.
```bash
$ git clone https://github.com/ThePaymentWorks/tp_node_stripe_example.git
```

Next enter the directory and install the applications dependencies.
```bash
$ cd tp_node_stripe_example/
$ npm install
```


### Running the application
Now that we have the application installed and our api keys setup we can start using the application. Firstly lets run the tests to make everything is in order.

```bash
$ npm run test:all
```

Your tests should have ran successfully. Now to run the application use the following command.

```bash
$ npm run dev
```

The full list of npm scripts can be found in the [package.json file](package.json).

```json
"start": "node ./bin/www",
"dev": "nodemon -w . -x npm run start",
"test": "./node_modules/.bin/mocha --compilers js:babel-core/register",
"test:all": "npm run test -- ./test --recursive",
"watch:test:all": "nodemon --watch ./ --recursive --exec npm run test:all",
"watch:test": "nodemon --watch ./ --recursive --exec npm run test"
```

##### API Keys
In order to work with Stripe we need to provide our [Publishable api key](https://stripe.com/docs/dashboard#api-keys). This is the key Stripe uses to [create tokens](https://stripe.com/docs/api#create_card_token).

Open [donations.js](server/public/javascripts/donations.js) and replace `'YOUR-PUBLISHABLE-KEY'` with the key [stripe gave you](https://support.stripe.com/questions/where-do-i-find-my-api-keys).

```js
// server/public/javascripts/donations.js
Stripe.setPublishableKey('YOUR-PUBLISHABLE-KEY');
```

Last thing we need to do before starting the application is insert our TestingPays api key. You can find that in the [instructions](https://admin.testingpays.com/teams_apis/stripe-v1-charges) or in your [team page](https://admin.testingpays.com/teams). Open [stripeHandlerModule](server/modules/stripeHandlerModule.js) Insert your API key in place of `"YOUR-API-KEY-HERE"`.


Last thing we need to do before starting the application is insert our TestingPays API key. You can find that in the [instructions](https://admin.testingpays.com/teams_apis/stripe-v1-charges) or in your [team page](https://admin.testingpays.com/teams). To do this create a config folder with a file called config.js inside it. From there add the following

```js
// config/config.js
const config = {};

config.stripeKey = "YOUR-STRIPE-KEY";

export default config;
```

### Testing with TestingPays
TestingPays makes testing many types of responses easy. In order to get a particular response simply pass in the associated response mapping. E.g.

```js
amount: 91  # => rate_limit_error
amount: 80  # => card_expired
amount: 0   # => success
```

For a full list of response mappings see the [response mappings table](https://admin.testingpays.com/teams_apis/stripe-v1-charges).

```js
import { expect } from 'chai';
import supertest from 'supertest-as-promised';
import { describe, it, beforeEach, afterEach } from 'mocha';
import app from '../../server/app';

describe('/charges', function () {
  beforeEach(function () {});
  afterEach(function () {});

  describe('Make POST requests', function () {
    it('should return success message', function () {
      return supertest(app)
      .post('/charges')
      .send({
        amount: 123.00,
        stripeToken: 'tok_12345678'
      }).expect(200).then((res) => {
        expect(res.body.status).to.equal('success');
      }).catch((err) => {
        console.log(err);
      });
    });

    it('should return invalid_request_error', function () {
      return supertest(app)
      .post('/charges')
      .send({
        amount: 123.80,
        stripeToken: 'tok_12345678'
      }).expect(400).then((res) => {
        expect(res.body.type).to.equal('invalid_request_error');
      }).catch((err) => {
        console.log(err);
      });
    });

    it('should return rate_limit_error', function () {
      return supertest(app)
      .post('/charges')
      .send({
        amount: 123.91,
        stripeToken: 'tok_12345678'
      }).expect(429).then((res) => {
        expect(res.body.type).to.equal('rate_limit_error');
      }).catch((err) => {
        console.log(err);
      });
    });

    it('should return authentication_error', function () {
      return supertest(app)
      .post('/charges')
      .send({
        amount: 123.86,
        stripeToken: 'tok_12345678'
      }).expect(401).then((res) => {
        expect(res.body.type).to.equal('authentication_error');
      }).catch((err) => {
        console.log(err);
      });
    });
  });
});
```
