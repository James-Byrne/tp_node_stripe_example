Testing Pays Node with Stripe Example App
---

#### Perquisites
In order to run the application you must have a version of [Nodejs](https://nodejs.org/) already installed. This app was built and tested using the Node 4.X LTS version, we recommend you use the same.

#### Setup
In order to run the application locally input the following commands

```
$ git clone https://github.com/ThePaymentWorks/tp_node_stripe_example.git
$ cd tp_node_stripe_example
$ npm install
$ npm run dev
```

You should now be able to view the app at localhost:3000/ .

#### Connecting to testingpays
In order to gain access to the Testing Pays sim you need to insert your API key. To do this create a config folder with a file called config.js inside it. From there add the following 

```js
const config = {};

config.stripeKey = "YOUR STRIPE KEY";

export default config;
```

Complete instructions on integrating an existing project with TestingPays can be found in the instructions section of the Stripe Charges API.


#### Viewing responses
In order to view the responses received from Testing Pays open your browsers dev tools. In the network section you will be able to view the responses being returned.
