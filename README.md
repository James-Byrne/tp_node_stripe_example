# Stripe Node.js Example Application

Integrated example application using [Stripe's Charges API](https://stripe.com/docs/api#create_charge).

## Requirements

In order to run this application you will need to install [Node.js](https://nodejs.org/en/). We recommend you use the latest LTS release (long term suport).


## Setup

Firstly pull down the repo.

```bash
$ git clone https://github.com/TestingPays/stripe_node_example_app.git
```

Next enter the directory and install the applications dependencies.

```bash
$ npm install
```

## Running the application

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
"scripts": {
  "start": "node ./bin/www",
  "dev": "nodemon -w . -x npm run start",
  "test": "./node_modules/.bin/mocha --compilers js:babel-core/register",
  "test:all": "npm run test -- ./test --recursive",
  "watch:test:all": "nodemon --watch ./ --recursive --exec npm run test:all",
  "watch:test": "nodemon --watch ./ --recursive --exec npm run test"
}
```

### API Keys

In order to work with Stripe we need to provide our [Publishable api key](https://stripe.com/docs/dashboard#api-keys). This is the key Stripe uses to [create tokens](https://stripe.com/docs/api#create_card_token).

Open [charges.js](server/public/javascripts/charges.js) and replace `'YOUR-PUBLISHABLE-KEY'` with the key [stripe gave you](https://support.stripe.com/questions/where-do-i-find-my-api-keys).

```js
// server/public/javascripts/charges.js
Stripe.setPublishableKey('YOUR-PUBLISHABLE-KEY');
```
### Developing with Testing Pays

In order to work with [Testing Pays](http://www.testingpays.com) you need to provide your API Key. You can find that in the [instructions](https://admin.testingpays.com/) or in your team page. Open [the configuration file](config/config.js) Insert your API key in place of `"YOUR-API-KEY-HERE"`.

```js
// config/config.js
const config = {};

config.stripeKey = "YOUR-STRIPE-KEY";

export default config;
```

### Unit Testing with Testing Pays

Testing Pays makes testing many types of responses easy. In order to get a particular response simply pass in the associated response mapping. E.g.

```js
amount: 91  # => rate_limit_error
amount: 80  # => card_expired
amount: 0   # => success
```

For a full list of response mappings see the [response mappings table](https://admin.testingpays.com/) under your account.

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
