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
